package ma.emi.ebank_backend.dtos;
import lombok.Data;

@Data
public class CustomerDTO {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String identityNumber;
}