🚀 AuthAPI - Système d'Authentification Complet

Bienvenue sur AuthAPI, une solution robuste d'authentification construite avec Node.js, Express, et Prisma. Ce projet implémente l'authentification locale avec vérification par email et l'authentification tierce via l'OAuth 2.0 de GitHub.
👥 Présentation de l'Équipe

    Membre 1 : [Ton Nom] - Développeur Backend / Architecture API.

    Membre 2 : [Nom Collègue] - Gestion Base de données / DevOps.

    Membre 3 : [Nom Collègue] - Intégration Services (Emails & OAuth).

✨ Fonctionnalités

    Authentification Classique : Inscription et Connexion avec hachage de mot de passe (Argon2/Bcrypt).

    Vérification par Email : Envoi de codes uniques via SMTP pour valider les comptes.

    GitHub OAuth 2.0 : Connexion simplifiée en un clic via les comptes GitHub.

    Gestion de Base de Données : Utilisation de Prisma ORM pour une manipulation fluide et sécurisée des données.

    Sécurité : Protection contre les attaques CSRF via l'utilisation de state et validation stricte des entrées.

🛠️ Stack Technique

    Runtime : Node.js

    Framework : Express.js

    ORM : Prisma

    Base de données : SQLite (ou PostgreSQL/MySQL)

    Emailing : Nodemailer (testé avec Mailhog)

⚙️ Installation et Configuration
1. Clonage du projet
Bash

git clone https://github.com/votre-repo/auth-api.git
cd auth-api

2. Installation des dépendances
Bash

npm install

3. Configuration des variables d'environnement

Créez un fichier .env à la racine et remplissez-le :
Extrait de code

DATABASE_URL="file:./dev.db"
PORT=3000

# GitHub OAuth
GITHUB_CLIENT_ID="votre_id"
GITHUB_CLIENT_SECRET="votre_secret"
GITHUB_STATE="une_chaine_aleatoire"

# Email Config (Exemple Mailhog)
EMAIL_HOST="localhost"
EMAIL_PORT=1025

4. Initialisation de la base de données
Bash

npx prisma db push
npx prisma generate

🚀 Utilisation
Démarrage
Bash

npm run dev

L'API sera accessible sur http://localhost:3000.
Points de terminaison (Endpoints) principaux
Méthode	Route	Description
POST	/register	Inscription d'un nouvel utilisateur.
GET	/auth/emailVerification	Valide le compte via le code reçu par mail.
POST	/login	Connexion et génération de session/token.
GET	/auth/github	Redirige vers la page de connexion GitHub.
GET	/auth/githubCallback	Callback gérant l'échange de token GitHub.
🧪 Tests de développement

Pour tester l'envoi d'emails en local, nous recommandons l'utilisation de Mailhog. Une fois lancé, vous pouvez voir les emails de vérification sur http://localhost:8025.
🔒 Sécurité

    Les mots de passe sont hachés avant stockage.

    Le paramètre state est vérifié lors des retours OAuth pour empêcher les injections.

    Les données entrantes sont validées via un schéma (Joi ou Zod).
