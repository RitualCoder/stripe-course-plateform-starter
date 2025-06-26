# Stripe Course Platform - TODO

## Webhooks Stripe

```sh
  brew install stripe/stripe-cli/stripe
  stripe login
  stripe listen --forward-to localhost:8000/webhooks/stripe
  stripe listen --print-secret
```

## 📋 Fonctionnalités à implémenter

### 🛒 Système d'achat Stripe V1

#### Backend (API)

- [x] **Configuration le compte Stripe**

  - [x] Créer les produits

- [x] **Configuration Stripe coté back**

  - [x] Installer et configurer `stripe` dans l'API NestJS
  - [x] Ajouter les clés Stripe (publique/secrète) dans les variables d'environnement
  - [x] Créer un module Stripe dans NestJS

- [x] **Modèles de données**

  - [x] Modifier le modèle course
    - [x] Ajouter le stripeProductId
    - [x] Ajouter le stripePriceId
  - [x] Modifier le modèle User
    - [x] Ajouter le stripeCustomerId
  - [x] Migrer la base de données

- [ ] **API Endpoints**
  - [x] `POST /payments/create-checkout-session` - Créer une session Stripe Checkout
    - [x] Créer le customer id s'il n'existe pas
    - [x] Construire l'URL de redirection
    - [x] Créer la session Stripe Checkout en indiquant le customer
    - [x] Retourner l'URL de redirection

#### Frontend (React)

- [x] **Intégration Stripe**
  - [x] Appeler la route pour le checkout

### 🛒 Système d'achat Stripe V2

#### Backend (API)

- [x] **Stocker les achats effectués par l'utilisateur**

  - [x] Créer une table purchase
  - [x] Créer le modèle Purchase dans NestJS
  - [x] Créer les relations entre Purchase, User et Course

- [x] **Webhooks Stripe**

  - [x] `POST /webhooks/stripe` - Endpoint pour recevoir les webhooks Stripe
    - [x] Configurer la signature des webhooks pour la sécurité
    - [x] Gérer l'événement `checkout.session.completed`
    - [x] Gérer l'événement `payment_intent.succeeded`
    - [x] Gérer l'événement `charge.dispute.created` (litiges)
    - [x] Mettre à jour le statut des purchases en base

- [x] **API Endpoints pour les achats**

  - [x] `GET /purchases` - Récupérer l'historique des achats de l'utilisateur
  - [x] `GET /purchases/:id` - Récupérer les détails d'un achat
  - [x] `GET /courses/:id/access` - Vérifier si l'utilisateur a accès au cours

- [x] **Gestion des accès aux cours**
  - [x] Middleware pour vérifier l'accès aux cours payants
  - [x] Service pour vérifier les purchases valides

#### Frontend (React)

- [x] **Interface utilisateur pour les achats**

  - [x] Page d'historique des achats (`/purchases`)
  - [x] Affichage du statut des paiements
  - [x] Affichage des détails de chaque achat

- [x] **Composants de vérification d'accès**

  - [x] Composant `ProtectedCourse` pour vérifier l'accès
  - [x] Affichage conditionnel du contenu payant
  - [x] Redirection vers la page d'achat si pas d'accès

### 🛒 Système d'achat Stripe V2

- [ ] **Refacto BACK**
- [ ] **Refacto FRONT**
