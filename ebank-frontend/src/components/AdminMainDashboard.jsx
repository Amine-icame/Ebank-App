import React, { useState } from "react";
import Accounts from "./Accounts";
import AdminDashboard from "./AdminDashboard"; // validation
import Customers from "./Customers";
import NewAccount from "./NewAccount";

function AdminMainDashboard() {

    // Page sélectionnée
    const [page, setPage] = useState("home");

    const renderPage = () => {
        switch (page) {
            case "customers": return <Customers />;
            case "accounts": return <Accounts />;
            case "newAccount": return <NewAccount />;
            case "validation": return <AdminDashboard />;
            default:
                return (
                    <div style={{ padding: "30px", textAlign: "center" }}>
                        <h2>Bienvenue dans l’Espace Admin</h2>
                        <p>Sélectionnez une section dans la barre latérale.</p>
                    </div>
                );
        }
    };

    return (
        <div style={styles.container}>
            
            {/* ---------------- SIDEBAR ---------------- */}
            <div style={styles.sidebar}>
                <h2 style={styles.logo}>ADMIN</h2>

                <button style={styles.menuBtn} onClick={() => setPage("customers")}>
                    👥 Gestion des Clients
                </button>

                <button style={styles.menuBtn} onClick={() => setPage("accounts")}>
                    💳 Gestion des Comptes
                </button>

                <button style={styles.menuBtn} onClick={() => setPage("newAccount")}>
                    ➕ Nouveau Compte
                </button>

                <button style={styles.menuBtn} onClick={() => setPage("validation")}>
                    🔐 Validation Comptes
                </button>
            </div>

            {/* ---------------- CONTENT ---------------- */}
            <div style={styles.content}>
                <div style={styles.header}>
                    <h3>Dashboard Administrateur</h3>
                </div>

                <div style={styles.pageContainer}>
                    {renderPage()}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#f5f7fb",
    },

    sidebar: {
        width: "240px",
        background: "#ffffff",
        boxShadow: "4px 0 12px rgba(0,0,0,0.05)",
        padding: "25px 15px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    logo: {
        textAlign: "center",
        fontWeight: "700",
        fontSize: "22px",
        marginBottom: "30px",
        color: "#4f46e5",
    },

    menuBtn: {
        padding: "12px",
        textAlign: "left",
        background: "#f0f2ff",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
        transition: "0.25s",
    },

    content: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
    },

    header: {
        padding: "18px 30px",
        background: "#ffffff",
        borderBottom: "1px solid #e3e7ef",
        fontWeight: "600",
    },

    pageContainer: {
        flexGrow: 1,
        padding: "25px",
        overflowY: "auto",
    }
};

export default AdminMainDashboard;
