import axios from "axios";
import React, { useState } from "react";

function Accounts() {
    // --- VARIABLES D'ÉTAT ---
    const [accountId, setAccountId] = useState(""); // L'ID saisi dans la barre de recherche
    const [account, setAccount] = useState(null);   // Les infos du compte (Solde...)
    const [operations, setOperations] = useState([]); // La liste des opérations
    const [errorMessage, setErrorMessage] = useState("");
    
    // Pour le formulaire d'opération
    const [operationType, setOperationType] = useState("DEBIT"); // DEBIT, CREDIT ou TRANSFER
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [accountDestination, setAccountDestination] = useState(""); // Pour le virement

    // --- 1. CHERCHER UN COMPTE ---
    const handleSearchAccount = (event) => {
        event.preventDefault(); // Empêche le rechargement de page
        setErrorMessage(""); 
        
        // Appel 1 : Récupérer les infos du compte
        axios.get("http://localhost:8085/accounts/" + accountId)
            .then(resp => {
                setAccount(resp.data);
                // Appel 2 : Récupérer les opérations (si le compte existe)
                loadOperations(accountId);
            })
            .catch(err => {
                setAccount(null);
                setOperations([]);
                setErrorMessage("Compte introuvable ! (Vérifiez le RIB)");
            });
    };

    const loadOperations = (id) => {
        axios.get("http://localhost:8085/accounts/" + id + "/operations")
            .then(resp => {
                setOperations(resp.data);
            });
    };

    // --- 2. EFFECTUER UNE OPÉRATION ---
    const handleOperation = (event) => {
        event.preventDefault();
        
        // On prépare l'objet à envoyer (selon ce que le Backend attend)
        let url = "";
        let data = { accountId: accountId, amount: amount, description: description };

        if(operationType === "DEBIT"){
            url = "http://localhost:8085/accounts/debit";
        } else if(operationType === "CREDIT"){
            url = "http://localhost:8085/accounts/credit";
        } else if(operationType === "TRANSFER"){
            url = "http://localhost:8085/accounts/transfer";
            // Pour le virement, les noms des champs sont un peu différents dans notre DTO Backend
            data = { 
                accountSource: accountId, 
                accountDestination: accountDestination, 
                amount: amount, 
                description: description 
            };
        }

        axios.post(url, data)
            .then(resp => {
                alert("Opération réussie !");
                handleSearchAccount(event); // On recharge les données pour voir le nouveau solde
                setAmount(0);
                setDescription("");
                setAccountDestination("");
            })
            .catch(err => {
                console.error(err);
                alert("Erreur lors de l'opération (Solde insuffisant ou compte destinataire faux)");
            });
    };

    return (
        <div className="container-fluid">
            {/* Barre de recherche (Toujours visible) */}
            <div className="card m-3">
                <div className="card-header">Gestion des Comptes</div>
                <div className="card-body">
                    <form onSubmit={handleSearchAccount}>
                        <div className="input-group">
                            <label className="input-group-text">Rechercher un Compte (RIB) :</label>
                            <input type="text" className="form-control" 
                                   value={accountId} onChange={(e)=>setAccountId(e.target.value)} 
                                   placeholder="Entrez l'ID du compte ici..." />
                            <button className="btn btn-info text-white">Rechercher</button>
                        </div>
                    </form>
                    {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}
                </div>
            </div>

            {/* N'afficher la suite que si un compte est chargé */}
            {account && (
                <div className="row m-3">
                    {/* COLONNE GAUCHE : INFOS ET HISTORIQUE */}
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header bg-success text-white">
                                Informations & Historique
                            </div>
                            <div className="card-body">
                                <h5>Solde : <span className="badge bg-warning text-dark">{account.balance} MAD</span></h5>
                                <hr/>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Date</th>
                                            <th>Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {operations.map((op) => (
                                            <tr key={op.id}>
                                                <td>{op.type}</td>
                                                <td>{new Date(op.operationDate).toLocaleString()}</td>
                                                <td className="text-end">{op.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* COLONNE DROITE : NOUVELLE OPÉRATION */}
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header bg-primary text-white">Opérations</div>
                            <div className="card-body">
                                <form onSubmit={handleOperation}>
                                    <div className="mb-3">
                                        <label className="form-label">Type d'opération :</label>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="opType" 
                                                   checked={operationType==="DEBIT"} onChange={()=>setOperationType("DEBIT")} />
                                            <label className="form-check-label">Débit</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="opType" 
                                                   checked={operationType==="CREDIT"} onChange={()=>setOperationType("CREDIT")} />
                                            <label className="form-check-label">Crédit</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="opType" 
                                                   checked={operationType==="TRANSFER"} onChange={()=>setOperationType("TRANSFER")} />
                                            <label className="form-check-label">Virement</label>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label>Montant :</label>
                                        <input type="number" className="form-control" 
                                               value={amount} onChange={(e)=>setAmount(e.target.value)}/>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label>Description :</label>
                                        <input type="text" className="form-control" 
                                               value={description} onChange={(e)=>setDescription(e.target.value)}/>
                                    </div>

                                    {/* Champ spécial seulement pour le Virement */}
                                    {operationType === "TRANSFER" && (
                                        <div className="mb-3">
                                            <label>Compte Destinataire (RIB) :</label>
                                            <input type="text" className="form-control" 
                                                   value={accountDestination} onChange={(e)=>setAccountDestination(e.target.value)}/>
                                        </div>
                                    )}

                                    <button className="btn btn-success w-100">Valider l'opération</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Accounts;