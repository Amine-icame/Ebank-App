package ma.emi.ebank_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity // Indique à Spring que c'est une table SQL
@Data @NoArgsConstructor @AllArgsConstructor // Lombok génère Getters/Setters/Constructeurs
public class Customer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String identityNumber; // CIN
    private String firstname;
    private String lastname;
    private String email;

    // Un Client peut avoir plusieurs comptes (Relation 1 -> N)
    // "mappedBy" indique que la clé étrangère est dans l'autre classe (BankAccount)
    @OneToMany(mappedBy = "customer")
    private List<BankAccount> bankAccounts;
}