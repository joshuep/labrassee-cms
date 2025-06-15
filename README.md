# La Brassée CMS - PayloadCMS

Interface d'administration pour gérer le contenu du site web de La Brassée.

## Collections disponibles

### 📅 Events (Événements)
- **title**: Nom de l'événement
- **slug**: Identifiant unique (auto-généré)
- **date**: Date de l'événement
- **image**: Affiche de l'événement
- **facebookLink**: Lien Facebook (optionnel)
- **description**: Description (optionnel)
- **status**: Publié/Brouillon/Archivé

### 🍽️ Menu Items (Catégories de menu)
- **title**: Nom de la catégorie
- **slug**: Identifiant unique (auto-généré)
- **image**: Image de la catégorie
- **order**: Ordre d'affichage
- **description**: Description (optionnel)
- **status**: Publié/Brouillon/Archivé

### 📁 Media (Médias)
- **alt**: Texte alternatif
- **caption**: Légende (optionnel)
- **Tailles générées**: thumbnail, card, tablet, desktop

## Configuration globale

### 🏢 Business Info (Informations du café)
- **Informations générales**: Nom, slogan, tagline
- **Adresse**: Rue, quartier, lien Google Maps
- **Réseaux sociaux**: Facebook, Instagram, OnlyFans
- **Contact**: Emails général, artistes, expositions
- **Horaires**: Lundi-Mercredi, Jeudi-Samedi, Dimanche
- **Message personnalisé**: Message aux clients

## Configuration

### Variables d'environnement
Créer un fichier `.env` basé sur `.env.example`:

```bash
cp .env.example .env
```

Variables requises:
- `PAYLOAD_SECRET`: Clé secrète pour chiffrement
- `DATABASE_URI`: URI de la base de données PostgreSQL
- `NEXT_PUBLIC_SERVER_URL`: URL du serveur (http://localhost:3001 en dev)

### Base de données
Ce CMS utilise PostgreSQL. Assurez-vous d'avoir une base de données configurée et accessible.

## Commandes

```bash
# Développement (port 3001)
npm run dev

# Build de production
npm run build

# Démarrage en production
npm run start

# Génération des types TypeScript
npm run generate:types

# Génération de l'import map
npm run generate:importmap

# Linting
npm run lint

# Commandes Payload CLI
npm run payload
```

## Accès

### Interface d'administration
- **URL**: http://localhost:3001/admin
- **Premier utilisateur**: Créé au premier lancement

### API REST
- **URL**: http://localhost:3001/api
- **Collections**: 
  - `/api/events` - Événements
  - `/api/menu-items` - Catégories de menu
  - `/api/media` - Médias
  - `/api/users` - Utilisateurs
- **Globals**:
  - `/api/globals/business-info` - Informations du café

### GraphQL
- **URL**: http://localhost:3001/api/graphql
- **Playground**: http://localhost:3001/api/graphql-playground

## Permissions

### Lecture publique
Toutes les collections sont lisibles publiquement pour permettre l'affichage sur le site web.

### Modification
Seuls les utilisateurs authentifiés peuvent créer, modifier ou supprimer du contenu.

## Tailles d'images

Les images uploadées sont automatiquement redimensionnées:
- **thumbnail**: 400x300px
- **card**: 768x1024px  
- **tablet**: 1024px de largeur
- **desktop**: 1920px de largeur

## Intégration avec l'app web

Les données du CMS sont consommées par l'application React via l'API REST. Les endpoints sont accessibles depuis `http://localhost:3001/api/`.

Exemple d'utilisation:
```javascript
// Récupérer tous les événements publiés
fetch('http://localhost:3001/api/events?where[status][equals]=published')

// Récupérer les informations du café
fetch('http://localhost:3001/api/globals/business-info')
```