import axios from "axios";
import React, { useEffect, useState } from "react";

function AdminDashboard() {
    const [inactiveUsers, setInactiveUsers] = useState([]);

    // Charger la liste au démarrage
    useEffect(() => {
        loadInactiveUsers();
    }, []);

    const loadInactiveUsers = () => {
        // GET vers le backend
        axios.get("http://localhost:8085/auth/users/inactive")
            .then(resp => setInactiveUsers(resp.data))
            .catch(err => console.error("Erreur chargement inactifs", err));
    };

    const handleActivate = (username) => {
        if(window.confirm(`Voulez-vous vraiment activer le compte de ${username} ?`)){
            // PUT vers le backend pour activer
            axios.put("http://localhost:8085/auth/activate/" + username)
                .then(() => {
                    alert("Compte activé avec succès !");
                    loadInactiveUsers(); // On recharge la liste pour faire disparaître la ligne
                })
                .catch(err => alert("Erreur lors de l'activation"));
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-warning text-dark">
                    <h4>🛠 Espace de Validation des Inscriptions</h4>
                </div>
                <div className="card-body">
                    {inactiveUsers.length === 0 ? (
                        <div className="alert alert-info">Aucune demande d'inscription en attente.</div>
                    ) : (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nom d'utilisateur</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inactiveUsers.map(user => (
                                    <tr key={user.userId}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleActivate(user.username)} 
                                                className="btn btn-success btn-sm">
                                                ✅ Valider le compte
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;