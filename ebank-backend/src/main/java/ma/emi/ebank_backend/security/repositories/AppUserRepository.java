package ma.emi.ebank_backend.security.repositories;
import ma.emi.ebank_backend.security.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppUserRepository extends JpaRepository<AppUser, String> {
    AppUser findByUsername(String username);
    AppUser findByEmail(String email);
    List<AppUser> findByActive(boolean active);
}