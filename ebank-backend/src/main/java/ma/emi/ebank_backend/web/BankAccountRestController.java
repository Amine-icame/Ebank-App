package ma.emi.ebank_backend.web;

import lombok.AllArgsConstructor;
import ma.emi.ebank_backend.dtos.AccountOperationDTO;
import ma.emi.ebank_backend.dtos.BankAccountDTO;
import ma.emi.ebank_backend.dtos.CustomerDTO;
import ma.emi.ebank_backend.exceptions.BalanceNotSufficientException;
import ma.emi.ebank_backend.exceptions.BankAccountNotFoundException;
import ma.emi.ebank_backend.exceptions.CustomerNotFoundException;
import ma.emi.ebank_backend.services.BankAccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
public class BankAccountRestController {
    private BankAccountService bankAccountService;

    @GetMapping("/accounts/{accountId}")
    public BankAccountDTO getBankAccount(@PathVariable String accountId) throws BankAccountNotFoundException {
        return bankAccountService.getBankAccount(accountId);
    }

    @GetMapping("/accounts")
    public List<BankAccountDTO> listAccounts(){
        return bankAccountService.listBankAccounts();
    }

    @GetMapping("/accounts/{accountId}/operations")
    public List<AccountOperationDTO> getHistory(@PathVariable String accountId){
        return bankAccountService.accountHistory(accountId);
    }

    // --- Opérations Bancaires ---

    @PostMapping("/accounts/debit")
    public DebitDTO debit(@RequestBody DebitDTO debitDTO) throws BankAccountNotFoundException, BalanceNotSufficientException {
        this.bankAccountService.debit(debitDTO.getAccountId(), debitDTO.getAmount(), debitDTO.getDescription());
        return debitDTO;
    }

    @PostMapping("/accounts/credit")
    public CreditDTO credit(@RequestBody CreditDTO creditDTO) throws BankAccountNotFoundException {
        this.bankAccountService.credit(creditDTO.getAccountId(), creditDTO.getAmount(), creditDTO.getDescription());
        return creditDTO;
    }

    @PostMapping("/accounts/transfer")
    public void transfer(@RequestBody TransferRequestDTO transferRequestDTO) throws BankAccountNotFoundException, BalanceNotSufficientException {
        this.bankAccountService.transfer(
                transferRequestDTO.getAccountSource(),
                transferRequestDTO.getAccountDestination(),
                transferRequestDTO.getAmount());
    }

    @PostMapping("/accounts")
    public BankAccountDTO saveBankAccount(
            @RequestParam(name = "balance") double balance,
            @RequestParam(name = "type") String type, // "SAVING" ou "CURRENT" (on gérera ça plus tard, pour l'instant on fait simple)
            @RequestParam(name = "customerId") Long customerId) throws CustomerNotFoundException {

        // On met 0 de découvert par défaut pour simplifier
        return bankAccountService.saveBankAccount(balance, 0, customerId);
    }

    @GetMapping("/accounts/me")
    public List<BankAccountDTO> myAccounts(java.security.Principal principal) {
        // "principal.getName()" retourne l'email de l'utilisateur connecté (grâce au Token JWT)
        String email = principal.getName();

        // On appelle le service qu'on vient de créer
        return bankAccountService.getBankAccountByEmail(email);
    }
}

// --- DTOs locaux (tu peux aussi les mettre dans le package dtos pour faire propre) ---

@lombok.Data
class DebitDTO {
    private String accountId;
    private double amount;
    private String description;
}

@lombok.Data
class CreditDTO {
    private String accountId;
    private double amount;
    private String description;
}

@lombok.Data
class TransferRequestDTO {
    private String accountSource;
    private String accountDestination;
    private double amount;
    private String description;
}