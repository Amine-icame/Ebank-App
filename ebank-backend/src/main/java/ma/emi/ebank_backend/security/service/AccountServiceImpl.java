package ma.emi.ebank_backend.security.service;

import lombok.AllArgsConstructor;
import ma.emi.ebank_backend.security.entities.AppRole;
import ma.emi.ebank_backend.security.entities.AppUser;
import ma.emi.ebank_backend.security.repositories.AppRoleRepository;
import ma.emi.ebank_backend.security.repositories.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class AccountServiceImpl implements AccountService {
    private AppUserRepository appUserRepository;
    private AppRoleRepository appRoleRepository;
    private PasswordEncoder passwordEncoder; // On va le configurer juste après

    @Override
    public AppUser addNewUser(String username, String password, String email, String confirmPassword) {
        AppUser appUser = appUserRepository.findByUsername(email);
        if(appUser != null) throw new RuntimeException("Cet utilisateur existe déjà");
        if(!password.equals(confirmPassword)) throw new RuntimeException("Les mots de passe ne correspondent pas");

        AppUser user = AppUser.builder()
                .userId(UUID.randomUUID().toString())
                .username(username)
                .password(passwordEncoder.encode(password)) // Cryptage du MDP
                .email(email)
                .active(true)
                .roles(new ArrayList<>()) // Liste vide au début
                .build();
        return appUserRepository.save(user);
    }

    // AJOUTE CETTE MÉTHODE dans l'interface et ici
    @Override
    public void activateUser(String username) {
        AppUser user = appUserRepository.findByUsername(username);
        if(user != null){
            user.setActive(true); // On active le compte
            // Le @Transactional va sauvegarder automatiquement à la fin de la méthode
            // Mais pour être sûr, on peut faire un save :
            appUserRepository.save(user);
        }
    }

    @Override
    public List<AppUser> listInactiveUsers() {
        return appUserRepository.findByActive(false);
    }

    @Override
    public AppRole addNewRole(String role) {
        AppRole appRole = appRoleRepository.findByRoleName(role);
        if(appRole != null) throw new RuntimeException("Ce rôle existe déjà");
        appRole = AppRole.builder().roleName(role).build();
        return appRoleRepository.save(appRole);
    }

    @Override
    public void addRoleToUser(String username, String role) {
        AppUser appUser = appUserRepository.findByUsername(username);
        AppRole appRole = appRoleRepository.findByRoleName(role);
        appUser.getRoles().add(appRole);
    }

    @Override
    public void removeRoleFromUser(String username, String role) {
        AppUser appUser = appUserRepository.findByUsername(username);
        AppRole appRole = appRoleRepository.findByRoleName(role);
        appUser.getRoles().remove(appRole);
    }

    @Override
    public AppUser loadUserByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }
}