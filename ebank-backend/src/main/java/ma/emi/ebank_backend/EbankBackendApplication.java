package ma.emi.ebank_backend;

import ma.emi.ebank_backend.dtos.BankAccountDTO;
import ma.emi.ebank_backend.dtos.CustomerDTO;
import ma.emi.ebank_backend.exceptions.CustomerNotFoundException;
import ma.emi.ebank_backend.security.service.AccountService;
import ma.emi.ebank_backend.services.BankAccountService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.stream.Stream;

@SpringBootApplication
public class EbankBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EbankBackendApplication.class, args);
	}
	/*
	@Bean
	CommandLineRunner commandLineRunnerSecurity(AccountService accountService){
		return args -> {
			// Ajout des Rôles
			accountService.addNewRole("USER");
			accountService.addNewRole("ADMIN");

			// Ajout des Users
			accountService.addNewUser("user1", "1234", "user1@gmail.com", "1234");
			accountService.addNewUser("admin", "1234", "admin@gmail.com", "1234");

			// Attribution des Rôles
			accountService.addRoleToUser("user1", "USER");
			accountService.addRoleToUser("admin", "USER");
			accountService.addRoleToUser("admin", "ADMIN");
		};
	}*/
}