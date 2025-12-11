package ma.emi.ebank_backend.repositories;

import ma.emi.ebank_backend.entities.AccountOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountOperationRepository extends JpaRepository<AccountOperation, Long> {
    // Pour afficher l'historique d'un compte spécifique
    List<AccountOperation> findByBankAccountId(String accountId);
}