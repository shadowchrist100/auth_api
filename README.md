🚀 AuthAPI - Système d'Authentification Complet

Bienvenue sur AuthAPI, une solution robuste d'authentification construite avec Node.js, Express, et Prisma. Ce projet implémente l'authentification locale avec vérification par email et l'authentification tierce via l'OAuth 2.0 de GitHub.
👥 Présentation de l'Équipe

    Membre 1 : [Lewhe Abel] - Authentification OAuth / Envoi d'Emails.

    Membre 2 : [MOLOKE Maëlys] - Authentification de Base .

    Membre 3 : [OSSENI Rosmiyath] - Gestion du Profil / Sécurité.

    Membre 4 : [ETTEKA Samuel] - Authentifcation 2FA

✨ Fonctionnalités

    Authentification Classique : Inscription et Connexion avec hachage de mot de passe (Argon2/Bcrypt).

    Vérification par Email : Envoi de codes uniques via SMTP pour valider les comptes.

    GitHub OAuth 2.0 : Connexion simplifiée en un clic via les comptes GitHub.

    Gestion de Base de Données : Utilisation de Prisma ORM pour une manipulation fluide et sécurisée des données.

    Sécurité : Protection contre les attaques CSRF via l'utilisation de state et validation stricte des entrées.  / Protection contre le brute Force

🛠️ Stack Technique

    Runtime : Node.js

    ORM : Prisma

    Base de données : SQLite 

    Emailing : Nodemailer (testé avec Mailpit)

    Cron : node-cron

    OTP : otplib

⚙️ Installation et Configuration
1. Clonage du projet
Bash

git clone https://github.com/votre-repo/auth-api.git
cd auth-api

2. Installation des dépendances
Bash

npm install

3. Configuration des variables d'environnement

Créez un fichier .env à la racine et copiez y le contenu du fichier .env.example :


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
