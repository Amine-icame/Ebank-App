import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NewAccount() {
    const [balance, setBalance] = useState(0);
    const [customerId, setCustomerId] = useState("");
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8085/customers")
            .then(resp => {
                setCustomers(resp.data);
                if (resp.data.length > 0) {
                    setCustomerId(resp.data[0].id);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleSaveAccount = (event) => {
        event.preventDefault();

        axios.post("http://localhost:8085/accounts", null, {
            params: {
                balance: balance,
                type: "CURRENT",
                customerId: customerId
            }
        })
        .then(resp => {
            alert("Compte créé avec succès ! RIB : " + resp.data.id);
            navigate("/accounts");
        })
        .catch(err => {
            console.error(err);
            alert("Erreur lors de la création du compte.");
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                
                <h2 style={styles.title}>Créer un Compte Bancaire</h2>

                <form onSubmit={handleSaveAccount} style={styles.form}>
                    
                    <label style={styles.label}>Client :</label>
                    <select
                        style={styles.input}
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                    >
                        {customers.map(cust => (
                            <option key={cust.id} value={cust.id}>
                                {cust.firstname} {cust.lastname} ({cust.email})
                            </option>
                        ))}
                    </select>

                    <label style={styles.label}>Solde Initial :</label>
                    <input
                        type="number"
                        style={styles.input}
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                    />

                    <button style={styles.button}>Créer le Compte</button>
                </form>

            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f6fb",
    },

    card: {
        width: "420px",
        padding: "35px",
        background: "#ffffff",
        borderRadius: "18px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    },

    title: {
        textAlign: "center",
        marginBottom: "25px",
        color: "#1e1e2f",
        fontWeight: "600",
    },

    form: {
        display: "flex",
        flexDirection: "column",
    },

    label: {
        marginTop: "10px",
        marginBottom: "5px",
        color: "#333",
        fontWeight: "500",
    },

    input: {
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid #d0d0d5",
        outline: "none",
        fontSize: "15px",
        marginBottom: "12px",
    },

    button: {
        marginTop: "20px",
        padding: "12px",
        borderRadius: "12px",
        background: "#4f46e5",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "16px",
        transition: "0.25s",
    },
};

export default NewAccount;
