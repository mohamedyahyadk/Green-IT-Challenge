# 🌱 Application Web Éco-Conçue — Green IT Challenge

Une application web légère, optimisée et respectueuse de l’environnement, développée pour le défi **Nuit de l’Info**.  
Le projet met en avant une architecture éco-responsable, un backend optimisé, un frontend minimaliste et un système complet de monitoring Green IT basé sur les diagrammes UML fournis.

---

## 🚀 Fonctionnalités principales

### 👤 Utilisateur

- Consulter les contenus affichés de manière légère
- Effectuer une recherche optimisée avec logs
- S’inscrire et se connecter
- Visualiser la consommation / performance (Front + Back)

### 🛠️ Administrateur / Éco-concepteur

- Gérer les contenus
- Consulter les métriques de performance et consommation
- Ajuster les optimisations Green IT

---

## 🧱 Stack Technique

### **Frontend (Green UI)**

- HTML / CSS minimalistes
- JavaScript réduit au strict nécessaire
- Lazy-loading, minification, compression
- Hébergé sur GitHub Pages

### **Backend (Éco-optimisé)**

- Node.js + Express
- API REST optimisée
- Compression Brotli, caching intelligent
- Monitoring CPU/RAM intégré

### **Base de données**

- PostgreSQL optimisé
- Tables : `users`, `contents`, `search_logs`
- Index et requêtes efficaces

### **Déploiement**

- Frontend : GitHub Pages
- Backend : VPS (O2Switch / Cloud éco-responsable)
- Base PostgreSQL

---

## 📐 UML & Architecture

Le projet inclut les diagrammes suivants :

- Diagramme **de cas d’utilisation**
- Diagramme **de composants**
- Diagramme **de déploiement**
- Diagramme **de classes**
- Diagramme **de séquence** (Consultation contenu)
- Diagramme **d’activité** (Optimisation Green IT)
- Diagramme **d’état** (Session utilisateur)
- Diagramme **ER** (Modèle de données)

Ces diagrammes définissent l’architecture technique globale.

---

## 👥 Rôles & Responsabilités de l’équipe

### 🟦 Développeur Frontend

Dossier : `frontend/`

**Tâches :**

- Développement UI minimaliste
- Intégration API
- Optimisation Green IT (lazy-loading, ressources compressées)

### 🟩 Développeur Backend

Dossier : `backend/`

**Tâches :**

- Création API Express optimisée
- Authentification & sécurité
- Optimisation des requêtes SQL
- Monitoring de performance

### 🟨 UX / Designer

Dossiers : `frontend/` et `docs/`

**Tâches :**

- Wireframes et maquettes
- Accessibilité WCAG
- Amélioration UX / UI

### 🟥 QA / Testeur

Dossier : `tests/`

**Tâches :**

- Tests API et fonctionnels
- Tests UX
- Tests de performance & optimisation

---

## 🔧 Installation & Workflow Git

### 1. **Cloner le dépôt**

````bash
git clone https://github.com/username/nom-du-projet.git
cd nom-du-projet

2. **Créer une branche feature:**

```bash
git checkout -b feature/nom-de-la-feature

````

3. **Travailler sur l’Issue assignée :**

```bash
git commit -m "Implémentation fonctionnalité X #issue_number"

```

4. **Pusher et ouvrir un Pull Request :**

```bash
git push origin feature/nom-de-la-feature

```

5. **Mettre à jour le Kanban Board :**

- Déplacer la carte Issue selon l’avancement :
  - Backlog → To Do → In Progress → Review → Done

## Bonnes pratiques Green IT

- Minifier HTML / CSS / JS
- Utiliser compression GZIP / Brotli
- Réduire la taille des réponses JSON
- Mettre en cache intelligemment
- Utiliser lazy-loaded images
- Optimiser les requêtes SQL
- Limiter les scripts lourds et ressources inutiles

## 📁 Structure du projet

- /frontend
  index.html
  styles.css
  app.js

- /backend
  server.js
  /routes
  /controllers
  /services
  /database

- /docs
  UML/
  README_assets/

- /tests
  api/
  e2e/
