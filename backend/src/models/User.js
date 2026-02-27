const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true, // Empêche deux comptes avec le même email
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: 6 // Sécurité de base
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user' // Par défaut, tout le monde est client
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);