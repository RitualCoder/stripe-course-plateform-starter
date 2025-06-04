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

- [ ] **Configuration le compte Stripe**

  - [ ] Créer les produits

- [ ] **Configuration Stripe coté back**

  - [ ] Installer et configurer `stripe` dans l'API NestJS
  - [ ] Ajouter les clés Stripe (publique/secrète) dans les variables d'environnement
  - [ ] Créer un module Stripe dans NestJS

- [ ] **Modèles de données**

  - [ ] Modifier le modèle course
    - [ ] Ajouter le stripeProductId
    - [ ] Ajouter le stripePriceId
  - [ ] Modifier le modèle User
    - [ ] Ajouter le stripeCustomerId
  - [ ] Migrer la base de données

- [ ] **API Endpoints**
  - [ ] `POST /payments/create-checkout-session` - Créer une session Stripe Checkout
    - [ ] Créer le customer id s'il n'existe pas
    - [ ] Construire l'URL de redirection
    - [ ] Créer la session Stripe Checkout en indiquant le customer
    - [ ] Retourner l'URL de redirection

#### Frontend (React)

- [ ] **Intégration Stripe**
  - [ ] Appeler la route pour le checkout

### 🛒 Système d'achat Stripe V2

#### Backend (API)

- [ ] **Stocker les achats effectués par l'utilisateur**

  - [ ] Créer une table purchase
  - [ ] Créer le modèle Purchase dans NestJS
  - [ ] Créer les relations entre Purchase, User et Course

- [ ] **Webhooks Stripe**

  - [ ] `POST /webhooks/stripe` - Endpoint pour recevoir les webhooks Stripe
    - [ ] Configurer la signature des webhooks pour la sécurité
    - [ ] Gérer l'événement `checkout.session.completed`
    - [ ] Gérer l'événement `payment_intent.succeeded`
    - [ ] Gérer l'événement `charge.dispute.created` (litiges)
    - [ ] Mettre à jour le statut des purchases en base

- [ ] **API Endpoints pour les achats**

  - [ ] `GET /purchases` - Récupérer l'historique des achats de l'utilisateur
  - [ ] `GET /purchases/:id` - Récupérer les détails d'un achat
  - [ ] `GET /courses/:id/access` - Vérifier si l'utilisateur a accès au cours

- [ ] **Gestion des accès aux cours**
  - [ ] Middleware pour vérifier l'accès aux cours payants
  - [ ] Service pour vérifier les purchases valides

#### Frontend (React)

- [ ] **Interface utilisateur pour les achats**

  - [ ] Page d'historique des achats (`/purchases`)
  - [ ] Affichage du statut des paiements
  - [ ] Affichage des détails de chaque achat

- [ ] **Composants de vérification d'accès**

  - [ ] Composant `ProtectedCourse` pour vérifier l'accès
  - [ ] Affichage conditionnel du contenu payant
  - [ ] Redirection vers la page d'achat si pas d'accès

### 🛒 Système d'achat Stripe V2

- [ ] **Refacto BACK**
- [ ] **Refacto FRONT**
