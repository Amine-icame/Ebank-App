package ma.emi.ebank_backend.security.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AppUser {
    @Id
    private String userId; // On utilisera un UUID ici aussi
    @Column(unique = true)
    private String username;
    private String password;
    private String email;
    private boolean active;

    @ManyToMany(fetch = FetchType.EAGER) // EAGER = Charge les rôles dès qu'on charge l'user
    private List<AppRole> roles;
}