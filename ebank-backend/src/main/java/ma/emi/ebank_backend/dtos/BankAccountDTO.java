package ma.emi.ebank_backend.dtos;
import lombok.Data;
import ma.emi.ebank_backend.enums.AccountStatus;
import java.util.Date;

@Data
public class BankAccountDTO {
    private String id;
    private double balance;
    private Date createdAt;
    private AccountStatus status;
    private CustomerDTO customerDTO; // On inclut le client lié, mais version DTO
}