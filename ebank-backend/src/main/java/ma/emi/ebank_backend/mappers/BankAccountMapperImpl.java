package ma.emi.ebank_backend.mappers;

import ma.emi.ebank_backend.dtos.AccountOperationDTO;
import ma.emi.ebank_backend.dtos.BankAccountDTO;
import ma.emi.ebank_backend.dtos.CustomerDTO;
import ma.emi.ebank_backend.entities.AccountOperation;
import ma.emi.ebank_backend.entities.BankAccount;
import ma.emi.ebank_backend.entities.Customer;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service // Important pour que Spring puisse l'injecter ailleurs
public class BankAccountMapperImpl {

    // Convertir Customer -> CustomerDTO
    public CustomerDTO fromCustomer(Customer customer){
        CustomerDTO customerDTO = new CustomerDTO();
        BeanUtils.copyProperties(customer, customerDTO); // Copie automatique des attributs qui ont le même nom
        return customerDTO;
    }

    // Convertir CustomerDTO -> Customer
    public Customer fromCustomerDTO(CustomerDTO customerDTO){
        Customer customer = new Customer();
        BeanUtils.copyProperties(customerDTO, customer);
        return customer;
    }

    public BankAccountDTO fromBankAccount(BankAccount bankAccount){
        BankAccountDTO bankAccountDTO = new BankAccountDTO();
        BeanUtils.copyProperties(bankAccount, bankAccountDTO);
        bankAccountDTO.setCustomerDTO(fromCustomer(bankAccount.getCustomer())); // On gère manuellement la relation
        return bankAccountDTO;
    }

    public BankAccount fromBankAccountDTO(BankAccountDTO bankAccountDTO){
        BankAccount bankAccount = new BankAccount();
        BeanUtils.copyProperties(bankAccountDTO, bankAccount);
        bankAccount.setCustomer(fromCustomerDTO(bankAccountDTO.getCustomerDTO()));
        return bankAccount;
    }

    public AccountOperationDTO fromAccountOperation(AccountOperation accountOperation){
        AccountOperationDTO accountOperationDTO = new AccountOperationDTO();
        BeanUtils.copyProperties(accountOperation, accountOperationDTO);
        return accountOperationDTO;
    }
}