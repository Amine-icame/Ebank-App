# 🏦 E-Bank Application (Digital Banking System)

Application web complète de gestion bancaire (e-Banking) développée avec une architecture **Micro-services** (monolithique modulaire) utilisant **Spring Boot 3** pour le Backend et **React JS** pour le Frontend.

Ce projet met en œuvre une sécurité avancée, une gestion des rôles (Admin/Client) et des flux de validation d'inscription réalistes.

---

## 🚀 Stack Technique

### Backend (API REST)
*   **Framework :** Spring Boot 3.x
*   **Langage :** Java 17
*   **Sécurité :** Spring Security 6 (Stateless), JWT (JSON Web Token), BCrypt.
*   **Base de données :** MySQL 8.
*   **ORM :** Spring Data JPA (Hibernate).
*   **Documentation :** Swagger / OpenAPI (`/swagger-ui.html`).

### Frontend (SPA)
*   **Framework :** React JS 18.
*   **Http Client :** Axios (avec Interceptors pour l'injection du Token).
*   **Routage :** React Router DOM.
*   **UI/UX :** Bootstrap / Material UI, CSS Moderne.
*   **Sécurité :** Gestion des rôles (Admin/User), Décodage JWT.

---

## 🛠 Fonctionnalités Clés

### 🔐 Sécurité & Authentification
*   **Authentification Stateless** via JWT.
*   Protection des mots de passe avec **BCrypt**.
*   **Login par Email** (et non par simple username).
*   **Workflow d'inscription réaliste :**
    1.  Un visiteur s'inscrit en ligne.
    2.  Son compte est créé en statut **INACTIF**.
    3.  L'Administrateur valide l'inscription via son Dashboard.
    4.  À la validation, le système crée **automatiquement** un Compte Bancaire (Solde 0) et un profil Client.

### 👤 Espace Client
*   **Dashboard Personnel :** Visualisation du total des avoirs et liste des comptes.
*   **Ségrégation des données :** Un client ne voit **QUE** ses propres comptes (`/accounts/me`).
*   **Opérations :** Consultation du solde, historique des transactions.

### 👨‍💼 Espace Agent / Admin
*   **Gestion complète :** Liste des clients, recherche, suppression.
*   **Gestion des Comptes :** Création de comptes bancaires, Ajout de solde.
*   **Opérations Guichet :** Débit, Crédit, Virement compte à compte.
*   **Module de Validation :** Tableau de bord pour activer les nouveaux inscrits.

---

## 📂 Architecture du Projet

Le dépôt contient deux dossiers principaux :

*   `/ebank-backend` : Le code source Java/Spring Boot.
*   `/ebank-frontend` : Le code source React.

---

## ⚙️ Installation et Démarrage

### 1. Prérequis
*   Java JDK 17 ou plus.
*   Node.js et NPM.
*   MySQL Server (ou XAMPP/WAMP).

### 2. Base de Données
1.  Démarrez votre serveur MySQL.
2.  Créez une base de données vide nommée `ebank_db`.
    ```sql
    CREATE DATABASE ebank_db;
    ```

### 3. Démarrage du Backend
1.  Naviguez dans le dossier `ebank-backend`.
2.  Vérifiez le fichier `src/main/resources/application.properties` pour confirmer vos identifiants MySQL (user/password).
3.  Lancez l'application :
    ```bash
    ./mvnw spring-boot:run
    ```
4.  Le serveur démarre sur `http://localhost:8085`.
5.  *Note : Des données de test (Admin, Clients, Comptes) sont insérées automatiquement au démarrage.*

### 4. Démarrage du Frontend
1.  Ouvrez un nouveau terminal et naviguez dans le dossier `ebank-frontend`.
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Lancez le serveur de développement :
    ```bash
    npm start
    ```
4.  L'application s'ouvre sur `http://localhost:3000`.

---

## 🧪 Comptes de Test (Par défaut)

Pour tester l'application immédiatement, utilisez ces comptes générés au démarrage :

| Rôle | Email | Mot de passe | Accès |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `1234` | Accès complet, Validation, Gestion Clients/Comptes |
| **Client** | `user1@gmail.com` | `1234` | Accès Dashboard Client uniquement |

---


## 📝 Auteur
Projet réalisé dans le cadre du module **Architecture des Composants d'Entreprise**.
