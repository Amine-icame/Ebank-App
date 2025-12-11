package ma.emi.ebank_backend.repositories;

import ma.emi.ebank_backend.entities.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BankAccountRepository extends JpaRepository<BankAccount, String> {
    // String car l'ID est un RIB (String)
    List<BankAccount> findByCustomer_Id(Long customerId);
}