package ma.emi.ebank_backend.services;

import ma.emi.ebank_backend.dtos.AccountOperationDTO;
import ma.emi.ebank_backend.dtos.BankAccountDTO;
import ma.emi.ebank_backend.dtos.CustomerDTO;
import ma.emi.ebank_backend.exceptions.BalanceNotSufficientException;
import ma.emi.ebank_backend.exceptions.BankAccountNotFoundException;
import ma.emi.ebank_backend.exceptions.CustomerNotFoundException;

import java.util.List;

public interface BankAccountService {
    // Gestion des Clients
    CustomerDTO saveCustomer(CustomerDTO customerDTO);
    List<CustomerDTO> listCustomers();
    CustomerDTO getCustomer(Long customerId) throws CustomerNotFoundException;

    // Nouvelle méthode pour récupérer les comptes via l'email
    List<BankAccountDTO> getBankAccountByEmail(String email);

    CustomerDTO updateCustomer(CustomerDTO customerDTO);
    void deleteCustomer(Long customerId);

    // Gestion des Comptes
    BankAccountDTO saveBankAccount(double initialBalance, double overDraft, Long customerId) throws CustomerNotFoundException;
    BankAccountDTO getBankAccount(String accountId) throws BankAccountNotFoundException;
    List<BankAccountDTO> listBankAccounts();

    // Opérations (Débit, Crédit, Virement)
    void debit(String accountId, double amount, String description) throws BankAccountNotFoundException, BalanceNotSufficientException;
    void credit(String accountId, double amount, String description) throws BankAccountNotFoundException;
    void transfer(String accountIdSource, String accountIdDestination, double amount) throws BankAccountNotFoundException, BalanceNotSufficientException;

    // Consulter les opérations
    List<AccountOperationDTO> accountHistory(String accountId);
}