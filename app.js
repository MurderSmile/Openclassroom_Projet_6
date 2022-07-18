const express = require('express');

const app = express();

const mongoose = require('mongoose');

const path = require('path');


const sauceRoutes = require('./routes/Sauce');

const userRoutes = require('./routes/user');



// Connexion au serveur MongoDB //
mongoose.connect('mongodb+srv://MurderSmile:DeathLaugh@cluster13.wdfny.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

// Autorisation CORS //
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});



// Lien vers le fichier 'Sauce.js' du dossier 'routes' //
app.use('/api/sauces', sauceRoutes);

// Lien vers le fichier 'user.js' du dossier 'routes' //
app.use('/api/auth', userRoutes);

// Lien vers le répertoire 'images' //
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;