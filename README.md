# WhereBuy — Trouvez où acheter à Taroudant

Application mobile full-stack (React Native + Express) qui permet aux habitants de Taroudant de trouver facilement où acheter un produit en ville.

## Fonctionnalites

- Rechercher un produit par nom
- Afficher la liste des magasins qui vendent ce produit
- Visualiser une image du produit (depuis une URL)
- Noter les magasins (1 a 5 etoiles)
- Ajouter des magasins aux favoris
- Ajouter un nouveau magasin pour un produit existant
- Voir une carte simplifiee de Taroudant (WebView)

## Structure du projet

pro/
├── backend/
│   └── server.js            Serveur Express (API, stockage en memoire)
│
└── frontend/
    ├── App.js               Navigation principale
    └── screens/
        ├── AuthScreen.js        Connexion / Inscription
        ├── HomeScreen.js        Accueil (liste des produits, recherche)
        ├── StoresScreen.js      Detail d un produit + magasins associes
        ├── AddStoreScreen.js    Ajouter un magasin
        ├── MapScreen.js         Carte simple (WebView)
        └── FavoritesScreen.js   Liste des favoris

## Lancer le projet

Terminal 1 - Backend :
cd backend
node server.js

Terminal 2 - Frontend :
cd frontend
npm run web        navigateur
npx expo start     mobile via Expo Go

## Identifiants de test

Champ      Valeur
username   admin
password   1234

## Adresse IP du backend

Si vous changez de reseau Wi-Fi, l adresse IP de votre ordinateur change.

Dans chaque ecran, modifiez la ligne suivante :

const URL = "http://192.168.4.103:3000";

Remplacez 192.168.4.103 par votre nouvelle IP (obtenue avec ipconfig sous Windows ou ifconfig sous Mac/Linux).

## Technologies utilisees

- Frontend : React Native (Expo)
- Backend : Node.js + Express
- Requetes HTTP : Axios
- Carte : WebView (Google Maps / lien statique)
- Stockage : tableaux JavaScript en memoire (pas de base de donnees)

## Remarque

L application ne stocke aucune donnee de facon permanente (pas de base de donnees).
Les produits sont predefinis (telephone, livre, velo).
Les utilisateurs peuvent ajouter des magasins et les noter, mais ils ne peuvent ni ajouter ni modifier des produits (choix pedagogique pour rester dans le cadre du cours).

## Auteur

Projet realise dans le cadre du cours de programmation full-stack.
Etudiant : Mohamed (github.com/mohamed1116)