const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

let tempCart = []; // Simulation panier temporaire

// 1. Santé
app.get('/api/health', (req, res) => {
  res.json({ status: "OK", message: "Le serveur Sneakers Family est en ligne ! 👟" });
});

// 2. Catalogue
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { variants: true } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erreur catalogue" });
  }
});

// 3. Détails Produit
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { variants: true }
    });
    product ? res.json(product) : res.status(404).json({ message: "Introuvable" });
  } catch (error) {
    res.status(500).json({ error: "Erreur produit" });
  }
});

// 4. Ajouter au panier
app.post('/api/cart/add', (req, res) => {
  const { productId, size, quantity } = req.body;
  const newItem = {
    id: Math.random().toString(36).substr(2, 9),
    productId,
    size,
    quantity,
    expiresAt: new Date(Date.now() + 15 * 60000)
  };
  tempCart.push(newItem);
  res.status(201).json(newItem);
});

// 5. Récupérer le panier (Enrichi via Prisma)
app.get('/api/cart', async (req, res) => {
  const now = new Date();
  tempCart = tempCart.filter(item => new Date(item.expiresAt) > now);

  try {
    const enrichedCart = await Promise.all(
      tempCart.map(async (item) => {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        return { 
          ...item, 
          productName: product?.name || "Modèle Inconnu",
          productImage: product?.imageUrl || "",
          productPrice: product?.basePrice || 0
        };
      })
    );
    res.json(enrichedCart);
  } catch (error) {
    res.status(500).json({ error: "Erreur enrichissement" });
  }
});

// 6. Supprimer UN article
app.delete('/api/cart/:id', (req, res) => {
  tempCart = tempCart.filter(item => item.id !== req.params.id);
  res.status(204).send();
});

//  7. VIDER TOUT LE PANIER (Après paiement ou logout)
app.delete('/api/cart/all', (req, res) => {
  tempCart = [];
  res.status(204).send();
});

async function main() {
  try {
    await prisma.$connect();
    console.log(" Prisma connecté");
    try { app.use('/api/auth', require('./routes/auth')); } catch (err) { console.warn("Auth absent"); }
    app.listen(PORT, () => console.log(` Port ${PORT}`));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
main();