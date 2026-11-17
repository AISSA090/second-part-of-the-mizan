# ⚖️ Mizan — Cours des Métaux Précieux & Back-Office Catalogue

**Mizan** est une application web développée sur mesure pour la bijouterie **Al Andalous** à Nador. Initialement conçue pour suivre en temps réel les cours de l'or et de l'argent (`MAD`, `USD`, `EUR`) et estimer la valeur d'un bijou au gramme, elle intègre désormais un **back-office CRUD complet** permettant de gérer le catalogue d'articles (bijoux, lingots, pièces) et les réservations clients de manière résiliente.

---

## ✨ Fonctionnalités principales

### Module Vitrine & Cours (Brief 1)
- **Cours en temps réel :** Affichage dynamique des cartes de métaux (prix actuel, variation, indicateur de tendance et horodatage).
- **Convertisseur multi-devises persistant :** Basculement fluide entre `MAD`, `USD` et `EUR` sans rechargement de page.
- **Historique graphique :** Visualisation interactive des variations sur 7 ou 30 jours.
- **Estimateur de bijoux au gramme :** Calculateur instantané basé sur des fonctions pures avec validation stricte des saisies.

### Module Back-Office Catalogue & Résilience (Brief 2)
- **Client API unique (`request()`) :** Tous les appels réseau transitent par une fonction centralisée en `async/await` avec URL de base configurable, en-têtes JSON, validation `response.ok`, timeout via `AbortController` (8 secondes max) et normalisation des erreurs (`offline`, `network`, `http`, `parse`, `timeout`).
- **Gestion complète du catalogue (CRUD) :**
  - **Lecture (`GET`) :** Liste complète et détail d'un article avec recherche insensible à la casse, filtrage par statut et tri combinés en temps réel à chaque frappe.
  - **Création (`POST`) :** Formulaire validé (titre de 3 à 80 caractères, description d'au moins 10 caractères, prix strictement positif) avec retour visuel pendant l'envoi et ajout en tête de liste.
  - **Modification (`PUT` & `PATCH`) :** Remplacement complet via formulaire pré-rempli (`PUT`) et modification partielle rapide du prix ou du statut depuis la liste (`PATCH`).
  - **Suppression (`DELETE`) :** Modale de confirmation personnalisée (aucun `confirm()` natif) avec mise à jour optimiste et restauration automatique en cas d'échec réseau.
- **Cache hors-ligne & TTL :** Mise en cache des réponses `GET` dans le `localStorage` sous clés versionnées (`catalogue:v1:items`) avec un TTL de 5 minutes, bannière d'alerte hors-ligne, bouton de rafraîchissement forcé et récupération sécurisée en cas de cache corrompu.
- **Gestion des 4 états d'interface :** Chaque vue gère explicitement les états *Chargement* (skeletons/indicateur), *Succès*, *Vide* (avec bouton de réinitialisation des filtres) et *Erreur* différenciée (404, 500, hors-ligne avec bouton *Réessayer*).
- **Préférences persistées :** Sauvegarde des favoris, filtres actifs, tri, devise et thème clair/sombre entre les sessions.
- **Journal des requêtes (Bonus) :** Panneau de débogage rétractable traçant la méthode, l'URL, le code HTTP et la durée en millisecondes de chaque appel réseau.

---

## 🛠️ Architecture & Choix Techniques

L'application respecte une séparation stricte des responsabilités grâce aux **Modules ES6 natifs** (`type="module"`), sans aucun framework, et insère toutes les données distantes exclusivement via `textContent` (zéro `innerHTML` sur le contenu réseau) :

```text
mizan/
├── index.html             # Structure sémantique de l'interface et modales personnalisées
├── style.css              # Styles personnalisés, thèmes clair/sombre et états visuels
├── README.md              # Documentation, architecture et captures des états
└── js/
    ├── main.js            # Point d'entrée, initialisation et écouteurs d'événements
    ├── services/
    │   ├── apiClient.js   # Fonction unique request(), AbortController (8s) et erreurs normalisées
    │   └── catalogApi.js  # Appels CRUD (GET, POST, PUT, PATCH, DELETE)
    ├── storage/
    │   ├── cache.js       # Gestion du cache versionné (TTL 5 min) et protection contre la corruption
    │   └── preferences.js # Persistance des favoris, filtres, tri, devise et thème
    ├── state/
    │   └── store.js       # État local (source de vérité) et mises à jour optimistes
    └── ui/
        ├── ui.js          # Rendu DOM sécurisé (createElement + textContent) et gestion des 4 états
        ├── modals.js      # Contrôleur des modales de confirmation et d'édition
        └── debugPanel.js  # Journal rétractable du trafic HTTP