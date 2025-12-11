package ma.emi.ebank_backend.security.service;

import ma.emi.ebank_backend.security.entities.AppRole;
import ma.emi.ebank_backend.security.entities.AppUser;

import java.util.List;

public interface AccountService {
    AppUser addNewUser(String username, String password, String email, String confirmPassword);
    AppRole addNewRole(String role);
    void addRoleToUser(String username, String role);
    void removeRoleFromUser(String username, String role);
    AppUser loadUserByUsername(String email);


    void activateUser(String username);
    List<AppUser> listInactiveUsers();
}