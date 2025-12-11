package ma.emi.ebank_backend.security.service;

import lombok.AllArgsConstructor;
import ma.emi.ebank_backend.security.entities.AppUser;
import ma.emi.ebank_backend.security.repositories.AppUserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private AppUserRepository appUserRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. AU LIEU DE CHERCHER PAR USERNAME, ON CHERCHE PAR EMAIL
        // Attention : il faut que tu aies injecté 'appUserRepository' dans cette classe
        // Si tu n'as que 'accountService', tu dois ajouter 'private AppUserRepository appUserRepository;'
        AppUser appUser = appUserRepository.findByEmail(email);

        // 2. Si on ne trouve pas l'email
        if(appUser == null) throw new UsernameNotFoundException(String.format("Aucun utilisateur trouvé avec l'email %s", email));

        // 3. On récupère les rôles
        String[] roles = appUser.getRoles().stream().map(u -> u.getRoleName()).toArray(String[]::new);

        // 4. On construit l'utilisateur pour Spring Security
        return User
                .withUsername(appUser.getEmail()) // On dit à Spring : "Son identifiant principal, c'est son email"
                .password(appUser.getPassword())
                .roles(roles)
                .disabled(!appUser.isActive()) // On garde la vérification du compte actif/inactif
                .build();    }
}