# Rendu TP - R6.05 Développement Avancé Anthony Gardelle 31B

## Sujet
Ce TP a pour objectif d'implémenter une API NestJS pour un système de classement ELO en temps réel.

## Objectifs
- Initialiser un projet NestJS
- Créer un serveur HTTP avec NestJS
- Implémenter un service Singleton pour stocker les données du classement en cache
- Mettre en place un service pour la gestion des joueurs en base de données
- Ajouter la logique métier pour la mise à jour du classement
- Utiliser `EventEmitter` pour émettre des notifications en temps réel
- Implémenter l'API décrite par le Swagger fourni
- Tester l'application avec des tests unitaires et d'intégration

## Préparation
- Utilisation d'un environnement Node.js récent avec `pnpm`
- Possibilité d'utiliser les ressources Docker des travaux dirigés
- Clonage du dépôt de départ : [Realtime ELO Ranker](https://gitlab.cloud0.openrichmedia.org/iuto/realtime-elo-ranker)

## Organisation du dépôt
Le projet utilise `pnpm workspaces` et est structuré comme suit :
```
.: Racine du projet
├── apps/
│   ├── realtime-elo-ranker-server/   # Serveur NestJS à implémenter
│   ├── realtime-elo-ranker-client/   # Client React/NextJS fourni
│   ├── realtime-elo-ranker-api-mock/ # Serveur de mock pour tests
|   ├── realtime-elo-ranker-simulator/ # Simulation des matchs
├── libs/
│   ├── ui/   # Composants UI partagés
├── docs/     # Documentation du projet
└── swagger/  # Définition Swagger de l'API
```

## Les commandes importantes
Lancer les commandes suivantes :  
Suivre l'ordre d'éxecution
```sh
.: Racine du projet
pnpm apps:server:dev  # Démarrer le serveur
pnpm apps:simulator:dev # Démarrer la simulation
pnpm apps:client:dev # Démarrer le clients
pnpm apps:server:test # Démarrer les tests unitaires
pnpm apps:server:cov # Démarrer le coverage
pnpm apps:server:e2e # Démarer les tests E2E
```

## API Implémentée

Les Players et les Matchs sont enregistrés en BD

### **POST /api/match** - Publication des résultats d'un match
- Met à jour le classement ELO
- Paramètres :
  ```json
  {
    "winner": "string",
    "loser": "string",
    "draw": true
  }
  ```
- Réponses :
  - `200` : Match publié avec succès
  - `422` : Joueur inexistant

### **POST /api/player** - Création d'un joueur
- Paramètres :
  ```json
  {
    "id": "string"
  }
  ```
- Réponses :
  - `200` : Joueur créé
  - `400` : Identifiant invalide
  - `409` : Joueur existant

### **GET /api/ranking** - Récupération du classement
- Réponses :
  - `200` : Liste des joueurs avec leur classement
  - `404` : Aucun joueur existant

### **GET /api/ranking/events** - Abonnement aux mises à jour du classement
- Permet d'écouter les changements en temps réel via un flux `text/event-stream`
- Réponse `200` : Client abonné

## Technologies Utilisées
- **NestJS** : Framework backend
- **TypeORM** : ORM pour la gestion de la base de données
- **Swagger** : Documentation de l'API
- **Jest** : Tests unitaires et d'intégration

## Tests
- Mise en place de tests unitaires et d'intégration avec Jest
- Validation du fonctionnement des endpoints avec Swagger

## Conclusion
Ce TP a permis de se familiariser avec NestJS, TypeORM et la gestion d'événements en temps réel via `EventEmitter`. Il met en pratique des concepts clés comme les services Singleton, les DTOs et l’inversion de contrôle sous NestJS.

