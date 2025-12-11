package ma.emi.ebank_backend.repositories;

import ma.emi.ebank_backend.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Méthode personnalisée pour chercher par nom (Spring comprend le nom de la méthode !)
    List<Customer> findByFirstnameContains(String keyword);
    // Pour vérifier l'unicité du mail (RG_6)
    Customer findByEmail(String email);
}