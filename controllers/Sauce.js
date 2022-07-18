const Sauce = require('../models/Sauce')
const fs = require('fs')

// Ajout d'une nouvelle sauce //
exports.createSauce = (req, res, next) => {

  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id;
  delete sauceObject._userId;

  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })

  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }))

};

// Changer une sauce //
exports.modifySauce = (req, res, next) => {

  const sauceObject = 

  // Modification AVEC Image //
  req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } 

  // Modification SANS Image //
  : { 
    ...req.body 
  }

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {

      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message : 'Not authorized'})
      } 

      else {
        Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({message : 'Objet modifié!'}))
          .catch(error => res.status(401).json({ error }))
      }

    })

    .catch((error) => {res.status(400).json({ error })})

};

// Supprimer une sauce //
exports.supprimSauce = (req, res, next) => {

  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {

      if (sauce.userId != req.auth.userId) {
        res.status(401).json({message: 'Not authorized'})
      } 

      else {
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          
          Sauce.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
            .catch(error => res.status(401).json({ error }))

        })
      }

    })

    .catch( error => {res.status(500).json({ error })})

};

// Afficher une sauce //
exports.findOneSauce = (req, res, next) => {

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))

};

// Afficher toutes les sauces //
exports.findAllSauce = (req, res, next) => {

  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))

};

// Donner son opinion sur une sauce //
exports.likeAndDislike = (req, res, next) => {

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {

      // Si l'utilisateur n'a pas encore aimé ou non une sauce //
      if(sauce.usersDisliked.indexOf(req.body.userId) == -1 && sauce.usersLiked.indexOf(req.body.userId) == -1) {
        
        // L'utilisateur aime la sauce //
        if(req.body.like == 1) { 
          sauce.usersLiked.push(req.body.userId);
          sauce.likes += req.body.like;
        } 

        // L'utilisateur n'aime pas la sauce //
        else if(req.body.like == -1) { 
          sauce.usersDisliked.push(req.body.userId);
          sauce.dislikes -= req.body.like;
        }

      }

      // Si l'utilisateur veut annuler son "like"
      if(sauce.usersLiked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
        const likesUserIndex = sauce.usersLiked.findIndex(user => user === req.body.userId)
        sauce.usersLiked.splice(likesUserIndex, 1)
        sauce.likes -= 1;
      }

      // Si l'utilisateur veut annuler son "dislike"
      if(sauce.usersDisliked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
        const likesUserIndex = sauce.usersDisliked.findIndex(user => user === req.body.userId)
        sauce.usersDisliked.splice(likesUserIndex, 1)
        sauce.dislikes -= 1;
      }

      sauce.save();
      res.status(201).json({ message: 'Like / Dislike mis à jour' })
    
    })

    .catch(error => res.status(500).json({ error }))
    
};