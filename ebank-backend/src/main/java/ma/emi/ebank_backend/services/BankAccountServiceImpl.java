package ma.emi.ebank_backend.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.emi.ebank_backend.dtos.AccountOperationDTO;
import ma.emi.ebank_backend.dtos.BankAccountDTO;
import ma.emi.ebank_backend.dtos.CustomerDTO;
import ma.emi.ebank_backend.entities.*;
import ma.emi.ebank_backend.enums.AccountStatus;
import ma.emi.ebank_backend.enums.OperationType;
import ma.emi.ebank_backend.exceptions.BalanceNotSufficientException;
import ma.emi.ebank_backend.exceptions.BankAccountNotFoundException;
import ma.emi.ebank_backend.exceptions.CustomerNotFoundException;
import ma.emi.ebank_backend.mappers.BankAccountMapperImpl;
import ma.emi.ebank_backend.repositories.AccountOperationRepository;
import ma.emi.ebank_backend.repositories.BankAccountRepository;
import ma.emi.ebank_backend.repositories.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional // IMPORTANT : Garantit que toutes les opérations sont atomiques (tout ou rien)
@AllArgsConstructor // Injection de dépendances via le constructeur (Bonne pratique)
@Slf4j // Pour les logs (System.out.println en mieux)
public class BankAccountServiceImpl implements BankAccountService {

    private CustomerRepository customerRepository;
    private BankAccountRepository bankAccountRepository;
    private AccountOperationRepository accountOperationRepository;
    private BankAccountMapperImpl dtoMapper;

    @Override
    public CustomerDTO saveCustomer(CustomerDTO customerDTO) {
        log.info("Enregistrement d'un nouveau client");

        // 1. Vérification défensive : Est-ce que cet email existe déjà ?
        Customer existingCustomer = customerRepository.findByEmail(customerDTO.getEmail());

        if (existingCustomer != null) {
            log.warn("Ce client existe déjà avec l'email : " + customerDTO.getEmail());
            // Au lieu de planter, on retourne le client existant !
            // Comme ça, le processus de création de compte peut continuer sur ce client.
            return dtoMapper.fromCustomer(existingCustomer);
        }

        // 2. Si n'existe pas, on procède à la sauvegarde normale
        Customer customer = dtoMapper.fromCustomerDTO(customerDTO);
        Customer savedCustomer = customerRepository.save(customer);
        return dtoMapper.fromCustomer(savedCustomer);
    }

    @Override
    public List<CustomerDTO> listCustomers() {
        List<Customer> customers = customerRepository.findAll();
        // Programmation fonctionnelle pour convertir la liste
        return customers.stream()
                .map(customer -> dtoMapper.fromCustomer(customer))
                .collect(Collectors.toList());
    }

    @Override
    public CustomerDTO getCustomer(Long customerId) throws CustomerNotFoundException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Client introuvable"));
        return dtoMapper.fromCustomer(customer);
    }

    @Override
    public CustomerDTO updateCustomer(CustomerDTO customerDTO) {
        log.info("Mise à jour du client");
        Customer customer = dtoMapper.fromCustomerDTO(customerDTO);
        Customer savedCustomer = customerRepository.save(customer);
        return dtoMapper.fromCustomer(savedCustomer);
    }

    @Override
    public void deleteCustomer(Long customerId) {
        customerRepository.deleteById(customerId);
    }

    @Override
    public BankAccountDTO saveBankAccount(double initialBalance, double overDraft, Long customerId) throws CustomerNotFoundException {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if(customer == null)
            throw new CustomerNotFoundException("Client introuvable");

        BankAccount bankAccount = new BankAccount();
        bankAccount.setId(UUID.randomUUID().toString()); // Génère un RIB aléatoire unique
        bankAccount.setCreatedAt(new Date());
        bankAccount.setBalance(initialBalance);
        bankAccount.setStatus(AccountStatus.CREATED); // Statut par défaut (RG_10)
        bankAccount.setCustomer(customer);

        BankAccount savedBankAccount = bankAccountRepository.save(bankAccount);
        return dtoMapper.fromBankAccount(savedBankAccount);
    }

    @Override
    public BankAccountDTO getBankAccount(String accountId) throws BankAccountNotFoundException {
        BankAccount bankAccount = bankAccountRepository.findById(accountId)
                .orElseThrow(()->new BankAccountNotFoundException("Compte bancaire introuvable"));
        return dtoMapper.fromBankAccount(bankAccount);
    }

    @Override
    public void debit(String accountId, double amount, String description) throws BankAccountNotFoundException, BalanceNotSufficientException {
        BankAccount bankAccount = bankAccountRepository.findById(accountId)
                .orElseThrow(()->new BankAccountNotFoundException("Compte introuvable"));

        if(bankAccount.getBalance() < amount)
            throw new BalanceNotSufficientException("Solde insuffisant");

        AccountOperation accountOperation = new AccountOperation();
        accountOperation.setType(OperationType.DEBIT);
        accountOperation.setAmount(amount);
        accountOperation.setDescription(description);
        accountOperation.setOperationDate(new Date());
        accountOperation.setBankAccount(bankAccount);
        accountOperationRepository.save(accountOperation);

        bankAccount.setBalance(bankAccount.getBalance() - amount);
        bankAccountRepository.save(bankAccount);
    }

    @Override
    public void credit(String accountId, double amount, String description) throws BankAccountNotFoundException {
        BankAccount bankAccount = bankAccountRepository.findById(accountId)
                .orElseThrow(()->new BankAccountNotFoundException("Compte introuvable"));

        AccountOperation accountOperation = new AccountOperation();
        accountOperation.setType(OperationType.CREDIT);
        accountOperation.setAmount(amount);
        accountOperation.setDescription(description);
        accountOperation.setOperationDate(new Date());
        accountOperation.setBankAccount(bankAccount);
        accountOperationRepository.save(accountOperation);

        bankAccount.setBalance(bankAccount.getBalance() + amount);
        bankAccountRepository.save(bankAccount);
    }

    @Override
    public void transfer(String accountIdSource, String accountIdDestination, double amount) throws BankAccountNotFoundException, BalanceNotSufficientException {
        // Grâce à @Transactional, si le crédit échoue, le débit est annulé automatiquement !
        debit(accountIdSource, amount, "Virement vers " + accountIdDestination);
        credit(accountIdDestination, amount, "Virement de " + accountIdSource);
    }

    @Override
    public List<BankAccountDTO> listBankAccounts() {
        return bankAccountRepository.findAll().stream()
                .map(bankAccount -> dtoMapper.fromBankAccount(bankAccount))
                .collect(Collectors.toList());
    }

    @Override
    public List<AccountOperationDTO> accountHistory(String accountId) {
        List<AccountOperation> accountOperations = accountOperationRepository.findByBankAccountId(accountId);
        return accountOperations.stream()
                .map(op -> dtoMapper.fromAccountOperation(op))
                .collect(Collectors.toList());
    }

    @Override
    public List<BankAccountDTO> getBankAccountByEmail(String email) {
        // 1. On cherche le Client qui a cet email
        Customer customer = customerRepository.findByEmail(email);

        // Sécurité : Si l'email ne correspond à aucun client bancaire (ex: c'est juste un Admin technique)
        if(customer == null){
            return java.util.Collections.emptyList(); // On retourne une liste vide
        }

        // 2. On cherche les comptes de ce client
        List<BankAccount> bankAccounts = bankAccountRepository.findByCustomer_Id(customer.getId());

        // 3. On transforme en DTO pour le renvoyer au Frontend
        return bankAccounts.stream()
                .map(account -> dtoMapper.fromBankAccount(account))
                .collect(Collectors.toList());
    }
}