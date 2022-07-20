const express = require('express');
const router = express.Router();

const userControl = require('../controllers/user');

// Création d'un nouvel utilisateur //
router.post('/signup', userControl.signup);
// Connexion d'un utilisateur déja existant //
router.post('/login', userControl.login);

module.exports = router;