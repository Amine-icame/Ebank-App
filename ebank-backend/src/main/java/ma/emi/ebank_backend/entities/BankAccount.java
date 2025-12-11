package ma.emi.ebank_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.emi.ebank_backend.enums.AccountStatus;
import java.util.Date;
import java.util.List;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class BankAccount {
    @Id
    private String id; // Le RIB est un String (ex: UUID ou format banque), on le générera nous-mêmes.

    private double balance;
    private Date createdAt;

    @Enumerated(EnumType.STRING) // Stocke le texte "ACTIVATED" en base au lieu de 0 ou 1
    private AccountStatus status;

    @ManyToOne // Un compte appartient à un seul client
    private Customer customer;

    @OneToMany(mappedBy = "bankAccount", fetch = FetchType.LAZY)
    private List<AccountOperation> accountOperations;
}