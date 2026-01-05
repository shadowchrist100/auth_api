// Connexion avec fonction de hachage  

// Importation du framework Express (serveur HTTP)
import express from 'express';
// Importation du middleware de gestion des sessions
import session from 'express-session';
// Importation du middleware pour gérer les cookies
import cookieParser from 'cookie-parser';
// Importation de bcrypt pour le hachage des mots de passe
import bcrypt from 'bcrypt';


// Création de l'application Express
const app = express();

// Définition du port
const PORT = 3000;

// Middleware pour lire le body des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware cookies
app.use(cookieParser());

// Configuration des sessions
app.use(session({
  secret: 'VotreSecretTrèsSécurisé',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 jours
}));

/*
====================================================
FONCTIONS DE SÉCURITÉ MOT DE PASSE
====================================================
*/
const saltRounds = 10;

// Hacher un mot de passe
const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, saltRounds);
};

// Vérifier un mot de passe
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
// simulation d'une base de données en utilisant un tableau

/*
====================================================
UTILISATEUR DE TEST (mot de passe haché)
====================================================
*/
const fakeUser = {
  id: 1,
  email: 'test@gmail.com',
  // Mot de passe "1234" haché
  password: await hashPassword('1234')
};

/*
====================================================
LOGIN HISTORY (simulation base de données)
====================================================
*/
const loginHistory = [];


/*
====================================================
ROUTE DE CONNEXION (LOGIN)
====================================================
*/
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Vérifier l'email
  if (email !== fakeUser.email) {
    return res.status(401).send('Email ou mot de passe incorrect');
  }

  // Vérifier le mot de passe haché
  const isPasswordValid = await verifyPassword(password, fakeUser.password);

  if (!isPasswordValid) {
    return res.status(401).send('Email ou mot de passe incorrect');
  }

  // Création de la session utilisateur
  req.session.userId = fakeUser.id;
  req.session.email = fakeUser.email;
  req.session.loginAt = new Date();

  res.send('Connexion réussie ');

  // Enregistrer l'historique de connexion
  loginHistory.push({
  userId: fakeUser.id,
  email: fakeUser.email,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  loginAt: new Date()
});

});

/*
====================================================
ROUTE PROTÉGÉE
====================================================
*/
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Accès refusé : non connecté');
  }

  res.send(`
    Bienvenue ${req.session.email}<br>
    Connecté depuis : ${req.session.loginAt}
  `);
});
// route vers le dashboard d'historique de connexion
app.get('/login-history', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Accès refusé');
  }

  const history = loginHistory.filter(
    h => h.userId === req.session.userId
  );

  res.json(history);
});



//DÉCONNEXION

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return res.status(500).send('Erreur lors de la déconnexion');
    }
    res.send('Vous êtes déconnecté ');
  });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

