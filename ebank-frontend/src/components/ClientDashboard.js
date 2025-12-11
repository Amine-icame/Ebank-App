import axios from "axios";
import React, { useEffect, useState } from "react";

function ClientDashboard() {
    const [accounts, setAccounts] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // C'est ici qu'on appelle la route SPÉCIALE qui ne renvoie que MES comptes
        axios.get("http://localhost:8085/accounts/me")
            .then(resp => {
                setAccounts(resp.data);
            })
            .catch(err => {
                console.error(err);
                setErrorMessage("Impossible de charger vos comptes.");
            });
    }, []);

    return (
        <div className="container mt-4">
            <div className="alert alert-info">
                <h4>👋 Bienvenue dans votre Espace Client</h4>
            </div>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <div className="row">
                {/* Carte de Résumé (Total) */}
                <div className="col-12 mb-4">
                    <div className="card bg-light border-primary">
                        <div className="card-body text-center">
                            <h3>Total de vos avoirs</h3>
                            {/* On calcule la somme des soldes */}
                            <h1 className="text-primary">
                                {accounts.reduce((total, acc) => total + acc.balance, 0)} MAD
                            </h1>
                        </div>
                    </div>
                </div>

                <h4 className="mb-3">Vos Comptes Bancaires :</h4>
                
                {/* Liste des comptes sous forme de cartes */}
                {accounts.length === 0 ? <p>Aucun compte actif.</p> : (
                    accounts.map(account => (
                        <div className="col-md-6" key={account.id}>
                            <div className="card shadow-sm mb-3">
                                <div className="card-header bg-dark text-white">
                                    Compte Courant
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Solde : {account.balance} MAD</h5>
                                    {account.balance === 0 && (
                                        <p className="text-danger small">
                                            Votre compte est vide. Veuillez effectuer un dépôt en agence.
                                        </p>
                                    )}
                                    <p className="card-text text-muted">RIB : {account.id}</p>
                                    <p className="card-text">
                                        Statut : 
                                        <span className={account.status === "ACTIVATED" ? "badge bg-success ms-2" : "badge bg-warning ms-2"}>
                                            {account.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ClientDashboard;