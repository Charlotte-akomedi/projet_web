const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient(); // Initialisation de Prisma

// ROUTE : Inscription (POST /api/auth/register)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Vérifier si l'utilisateur existe déjà via Prisma
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ message: "Cet utilisateur existe déjà" });

    // 2. Crypter le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Créer l'utilisateur dans PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CLIENT' // Correspond à ton Enum Role
      }
    });

    res.status(201).json({ message: "Utilisateur créé avec succès !", userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
});

//  ROUTE : Connexion (POST /api/auth/login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Trouver l'utilisateur
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Identifiants invalides" });

    // 2. Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Identifiants invalides" });

    // 3. Créer le Token JWT (utilise la variable d'env ou une clé par défaut)
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET || "SECRET_KEY_SNEAKERS", 
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
});

module.exports = router;