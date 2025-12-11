import { jwtDecode } from "jwt-decode";

export const getToken = () => {
    return localStorage.getItem("jwtToken");
};

export const getRoles = () => {
    const token = getToken();
    if (!token) return [];
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.roles; // Retourne ['ROLE_ADMIN', 'ROLE_USER', ...]
    } catch (e) {
        return [];
    }
};

export const isAdmin = () => {
    const roles = getRoles();
    // On vérifie simplement si la liste contient la chaîne exacte "ROLE_ADMIN"
    return roles.includes("ROLE_ADMIN");
};

export const isAuthenticated = () => {
    const token = getToken();
    if(!token) return false;
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
    } catch (e) {
        return false;
    }
};