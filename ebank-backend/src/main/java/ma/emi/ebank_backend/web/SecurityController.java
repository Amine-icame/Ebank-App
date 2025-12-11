package ma.emi.ebank_backend.web;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import ma.emi.ebank_backend.dtos.CustomerDTO;
import ma.emi.ebank_backend.dtos.RegistrationDTO;
import ma.emi.ebank_backend.security.entities.AppUser;
import ma.emi.ebank_backend.security.filters.JwtAuthorizationFilter;
import ma.emi.ebank_backend.security.repositories.AppUserRepository;
import ma.emi.ebank_backend.security.service.AccountService;
import ma.emi.ebank_backend.security.service.AccountServiceImpl;
import ma.emi.ebank_backend.services.BankAccountService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class SecurityController {

    private AuthenticationManager authenticationManager;

    private AccountService accountService;
    private BankAccountService bankAccountService;
    private AppUserRepository appUserRepository;

    @PostMapping("/login")
    public Map<String, String> login(@RequestParam String username, @RequestParam String password){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        Instant now = Instant.now();

        // CORRECTION ICI : On récupère une LISTE de strings, pas une seule phrase
        java.util.List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        SecretKey secretKey = Keys.hmacShaKeyFor(JwtAuthorizationFilter.SECRET.getBytes());

        String jwtAccessToken = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(60, ChronoUnit.MINUTES)))
                .claim("roles", roles) // On passe la liste directement
                .signWith(secretKey)
                .compact();

        Map<String, String> idToken = new HashMap<>();
        idToken.put("accessToken", jwtAccessToken);
        return idToken;
    }

    // Inscription (Client) - Compte inactif par défaut
    @PostMapping("/register")
    public AppUser register(@RequestBody RegistrationDTO dto){
        AppUser user = accountService.addNewUser(dto.getUsername(), dto.getPassword(), dto.getEmail(), dto.getPassword());
        user.setActive(false); // On force INACTIF
        // On lui donne le rôle USER par défaut
        accountService.addRoleToUser(user.getUsername(), "USER");
        return appUserRepository.save(user); // On sauvegarde le changement d'état
    }

    // Validation (Admin seulement)
    @PutMapping("/activate/{username}")
    public void activate(@PathVariable String username){
        // 1. Activation de l'utilisateur (Sécurité)
        accountService.activateUser(username);

        // 2. Automatisme : Création du Client et du Compte Bancaire
        try {
            // A. On récupère les infos de l'utilisateur inscrit
            AppUser appUser = appUserRepository.findByUsername(username);

            // B. On prépare le Client Bancaire (Customer)
            CustomerDTO customerDTO = new CustomerDTO();
            customerDTO.setFirstname(appUser.getUsername());
            customerDTO.setLastname("Nouveau Client"); // Valeur par défaut
            customerDTO.setEmail(appUser.getEmail());
            customerDTO.setIdentityNumber("CIN-" + appUser.getUserId().substring(0, 8)); // Faux CIN basé sur l'ID

            // C. On sauvegarde (Grâce à notre modif, ça ne plantera pas si l'email existe déjà !)
            CustomerDTO savedCustomer = bankAccountService.saveCustomer(customerDTO);

            // D. On vérifie s'il a déjà un compte pour ne pas en créer un deuxième inutilement
            // On utilise la méthode qu'on a créée tout à l'heure pour le Dashboard
            try {
                var existingAccounts = bankAccountService.getBankAccountByEmail(savedCustomer.getEmail());
                if(existingAccounts.isEmpty()) {
                    // E. Création du compte SEULEMENT s'il n'en a pas
                    bankAccountService.saveBankAccount(0, 0, savedCustomer.getId());
                    System.out.println("Compte bancaire créé pour " + username);
                } else {
                    System.out.println("L'utilisateur " + username + " a déjà un compte, on ne fait rien.");
                }
            } catch (Exception e) {
                // Fallback si la vérification échoue, on tente quand même la création
                bankAccountService.saveBankAccount(0, 0, savedCustomer.getId());
            }

        } catch (Exception e) {
            // On log l'erreur mais on ne bloque pas l'activation du compte utilisateur
            System.err.println("Erreur Warning : Le compte bancaire n'a pas pu être créé auto : " + e.getMessage());
            e.printStackTrace();
        }
    }

    @GetMapping("/users/inactive")
    public List<AppUser> listInactive(){
        return ((AccountServiceImpl) accountService).listInactiveUsers();
    }
}