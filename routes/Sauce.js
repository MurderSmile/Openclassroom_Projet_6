const express = require('express');

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const router = express.Router();

const sauceControl = require('../controllers/Sauce')


// Ajout d'une nouvelle sauce //
router.post('/', auth, multer, sauceControl.createSauce);
  
// Changer une sauce //
router.put('/:id', auth, multer, sauceControl.modifySauce);
  
// Supprimer une sauce //
router.delete('/:id', auth, sauceControl.supprimSauce);
  
// Afficher une sauce //
router.get('/:id', auth, sauceControl.findOneSauce);
  
// Afficher toutes les sauces //
router.get('/', auth, sauceControl.findAllSauce);

// Donner un like/dislike pour une sauce //
router.post('/:id/like', auth, sauceControl.likeAndDislike);

module.exports = router;