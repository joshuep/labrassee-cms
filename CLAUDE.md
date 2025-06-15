# Payload CMS - Guide d'utilisation

## Architecture du projet

Ce projet utilise Payload CMS comme système de gestion de contenu avec une API REST automatiquement générée.

### Structure des collections :
- **Users** : Gestion des utilisateurs administrateurs
- **Media** : Stockage des fichiers (images, SVG, etc.)
- **Events** : Événements avec catégorisation automatique
- **EventGenres** : Genres d'événements avec mots-clés et icônes SVG
- **MenuItems** : Éléments du menu du café
- **BusinessInfo** : Informations globales de l'entreprise

## API REST Payload

### URL de base
- **Développement** : `http://localhost:3001/api`
- **Production** : `${NEXT_PUBLIC_SERVER_URL}/api`

### Authentification

#### Se connecter
```javascript
const response = await fetch(`${API_URL}/api/users/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'votre-email@example.com',
    password: 'votre-mot-de-passe'
  })
})

const { token } = await response.json()
```

#### Utiliser le token
```javascript
const response = await fetch(`${API_URL}/api/collection-name`, {
  headers: {
    'Authorization': `JWT ${token}`,
    'Content-Type': 'application/json',
  }
})
```

### Opérations CRUD

#### Lire (GET)
```javascript
// Tous les documents
const events = await fetch(`${API_URL}/api/events`)

// Un document par ID
const event = await fetch(`${API_URL}/api/events/123`)

// Avec paramètres de requête
const events = await fetch(`${API_URL}/api/events?limit=10&sort=-createdAt&populate=genre`)
```

#### Créer (POST)
```javascript
const newEvent = await fetch(`${API_URL}/api/events`, {
  method: 'POST',
  headers: {
    'Authorization': `JWT ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Nouveau concert',
    date: '2024-12-25',
    slug: 'nouveau-concert'
  })
})
```

#### Modifier (PATCH)
```javascript
const updatedEvent = await fetch(`${API_URL}/api/events/123`, {
  method: 'PATCH',
  headers: {
    'Authorization': `JWT ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Titre modifié'
  })
})
```

#### Supprimer (DELETE)
```javascript
await fetch(`${API_URL}/api/events/123`, {
  method: 'DELETE',
  headers: {
    'Authorization': `JWT ${token}`,
  }
})
```

## Paramètres de requête utiles

- **depth** : Populer les relations (`?depth=2`)
- **limit** : Limiter le nombre de résultats (`?limit=10`)
- **page** : Pagination (`?page=2`)
- **sort** : Tri (`?sort=-createdAt` pour ordre décroissant)
- **where** : Filtres avancés (`?where[status][equals]=published`)
- **populate** : Spécifier les champs à populer (`?populate=genre,image`)

## Erreurs fréquentes à éviter

### ❌ Erreur : "You are not allowed to perform this action"
**Cause** : Pas d'authentification ou permissions insuffisantes
**Solution** : 
```javascript
// Toujours inclure le token JWT
headers: {
  'Authorization': `JWT ${token}`,
}
```

### ❌ Erreur : Tentative d'import du config TypeScript depuis un script JS
**Cause** : Les scripts Node.js ne peuvent pas importer directement des fichiers .ts
**Solution** : Utiliser l'API REST au lieu de l'import direct

### ❌ Erreur : Cannot find module lors de l'exécution de scripts
**Cause** : Mauvais répertoire de travail
**Solution** : 
```bash
# Toujours exécuter depuis la racine du projet
cd /chemin/vers/labrassee.cafe
node scripts/mon-script.js
```

### ❌ Erreur : Conversion de type enum vers integer
**Cause** : Migration automatique de Payload qui ne peut pas convertir les enums
**Solution** : 
- Créer une migration manuelle avec `USING NULL`
- Ou réinitialiser la base avec `PAYLOAD_DROP_DATABASE=true`

### ❌ Erreur : RichText Slate vers Lexical
**Cause** : Changement d'éditeur dans Payload
**Solution** : 
- Supprimer les champs `richText` problématiques
- Ou migrer avec le script officiel Payload

## Scripts utiles

### Seed des genres d'événements
```bash
npm run seed:genres
```

### Reset complet de la base
```bash
PAYLOAD_DROP_DATABASE=true npm run dev
```

### Création de migration
```bash
cd apps/cms
npx payload migrate:create nom-de-la-migration
```

## Bonnes pratiques

1. **Toujours s'authentifier** avant d'utiliser l'API pour créer/modifier
2. **Utiliser les relations** plutôt que des champs texte pour les références
3. **Préfixer les slugs** de collections en kebab-case
4. **Tester les scripts** sur une base de développement avant la production
5. **Utiliser les hooks** pour automatiser les tâches (génération de slug, catégorisation)

## Configuration spécifique au projet

### Catégorisation automatique des événements
Les événements sont automatiquement associés à un genre selon leur titre grâce au hook `beforeChange` qui :
1. Compare le titre avec les mots-clés de chaque genre
2. Assigne le premier genre qui correspond
3. Laisse vide si aucune correspondance

### Permissions
- **Lecture** : Ouverte à tous (`read: () => true`)
- **Écriture** : Réservée aux utilisateurs authentifiés (`create/update/delete: ({ req: { user } }) => !!user`)