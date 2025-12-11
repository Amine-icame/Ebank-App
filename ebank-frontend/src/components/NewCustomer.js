import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewCustomer() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const navigate = useNavigate();

  const handleSaveCustomer = (event) => {
    event.preventDefault();

    const data = {
      firstname,
      lastname,
      email,
      identityNumber,
    };

    axios
      .post("http://localhost:8085/customers", data)
      .then(() => {
        alert("Client enregistré avec succès !");
        navigate("/customers");
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur lors de l'enregistrement. Vérifiez si l'email existe déjà.");
      });
  };

  return (
    <>
      {/* ---------------- 🔵 STYLE ULTRA MODERNE ---------------- */}
      <style>{`
        .modern-container {
          width: 95%;
          margin: 30px auto;
          display: flex;
          justify-content: center;
          animation: fadeIn 0.4s ease;
        }

        .modern-form-card {
          width: 520px;
          background: #ffffff;
          padding: 30px;
          border-radius: 18px;
          box-shadow: 0 8px 22px rgba(0,0,0,0.08);
        }

        .modern-form-title {
          background: linear-gradient(135deg, #4a90e2, #007bff);
          padding: 18px;
          border-radius: 14px;
          color: white;
          font-size: 22px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 25px;
        }

        .modern-label {
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
        }

        .modern-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1px solid #d1d9e0;
          font-size: 15px;
          transition: 0.2s;
        }

        .modern-input:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0px 0px 4px rgba(74, 144, 226, 0.5);
        }

        .modern-btn-submit {
          width: 100%;
          margin-top: 10px;
          background: linear-gradient(135deg, #4a90e2, #007bff);
          color: white;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.25s;
        }

        .modern-btn-submit:hover {
          background: #0066dd;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ---------------- 🧩 INTERFACE ---------------- */}
      <div className="modern-container">
        <div className="modern-form-card">
          <div className="modern-form-title">Ajouter un nouveau client</div>

          <form onSubmit={handleSaveCustomer}>
            <div className="mb-3">
              <label className="modern-label">Nom :</label>
              <input
                className="modern-input"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="modern-label">Prénom :</label>
              <input
                className="modern-input"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="modern-label">Email :</label>
              <input
                type="email"
                className="modern-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="modern-label">Numéro d'identité (CIN) :</label>
              <input
                className="modern-input"
                value={identityNumber}
                onChange={(e) => setIdentityNumber(e.target.value)}
                required
              />
            </div>

            <button className="modern-btn-submit">Enregistrer</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewCustomer;
