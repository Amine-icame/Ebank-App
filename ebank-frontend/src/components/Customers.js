import axios from "axios";
import React, { useEffect, useState } from "react";
import { isAdmin } from "../services/AuthService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // État pour ouvrir/fermer la popup
  const [showModal, setShowModal] = useState(false);

  // Champs du formulaire (ancien NewCustomer)
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");

  useEffect(() => {
    handleGetCustomers();
  }, []);

  const handleGetCustomers = () => {
    axios
      .get("http://localhost:8085/customers")
      .then((resp) => {
        setCustomers(resp.data);
      })
      .catch(() => {
        setErrorMessage("Impossible de charger les clients.");
      });
  };

  const handleDeleteCustomer = (customer) => {
    if (window.confirm("Supprimer " + customer.firstname + " ?")) {
      axios
        .delete("http://localhost:8085/customers/" + customer.id)
        .then(() => handleGetCustomers());
    }
  };

  const handleSaveCustomer = (event) => {
    event.preventDefault();

    const data = { firstname, lastname, email, identityNumber };

    axios
      .post("http://localhost:8085/customers", data)
      .then(() => {
        alert("Client enregistré !");
        setShowModal(false);
        setFirstname("");
        setLastname("");
        setEmail("");
        setIdentityNumber("");
        handleGetCustomers();
      })
      .catch(() => {
        alert("Erreur lors de l'enregistrement.");
      });
  };

  return (
    <>
      {/* ----------- STYLE ULTRA MODERNE -------------- */}
      <style>{`
        .modern-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          animation: fadeIn 0.3s ease;
        }

        .modern-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          border-radius: 14px;
          background: linear-gradient(135deg, #4a90e2, #007bff);
          color: white;
          margin-bottom: 20px;
        }

        .modern-btn {
          background: #ffffff;
          color: #007bff;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.25s;
        }

        .modern-btn:hover {
          background: #f0f6ff;
        }

        /* -------- POPUP / MODAL -------- */
        .modal-bg {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.45);
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeIn 0.3s ease;
          z-index: 999;
        }

        .modal-card {
          width: 480px;
          background: white;
          padding: 25px;
          border-radius: 18px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          animation: slideDown 0.3s ease;
        }

        .modal-title {
          text-align: center;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #4a90e2, #007bff);
          color: white;
          padding: 12px;
          border-radius: 10px;
        }

        .modern-field {
          font-weight: 600;
          margin-bottom: 6px;
        }

        .modern-input {
          width: 100%;
          padding: 11px;
          border-radius: 10px;
          border: 1px solid #d1d9e0;
          margin-bottom: 14px;
        }

        .modal-btn-submit {
          width: 100%;
          background: linear-gradient(135deg, #4a90e2, #007bff);
          color: white;
          padding: 12px;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }

        .modal-btn-submit:hover {
          background: #0066dd;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from { transform: translateY(-15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* ------------------- CONTENU ------------------- */}
      <div className="modern-card">
        <div className="modern-header">
          <h3>Liste des Clients</h3>

          {isAdmin() && (
            <button className="modern-btn" onClick={() => setShowModal(true)}>
              + Nouveau Client
            </button>
          )}
        </div>

        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th><th>Nom</th><th>Prénom</th><th>Email</th>
              {isAdmin() && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.lastname}</td>
                <td>{customer.firstname}</td>
                <td>{customer.email}</td>

                {isAdmin() && (
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCustomer(customer)}
                    >
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✨ POPUP MODERNE */}
      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Nouveau Client</div>

            <form onSubmit={handleSaveCustomer}>
              <label className="modern-field">Nom :</label>
              <input
                className="modern-input"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />

              <label className="modern-field">Prénom :</label>
              <input
                className="modern-input"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />

              <label className="modern-field">Email :</label>
              <input
                type="email"
                className="modern-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label className="modern-field">Numéro d'identité (CIN) :</label>
              <input
                className="modern-input"
                value={identityNumber}
                onChange={(e) => setIdentityNumber(e.target.value)}
                required
              />

              <button className="modal-btn-submit">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Customers;
