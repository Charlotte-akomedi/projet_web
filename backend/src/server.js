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

let tempCart = []; 


app.get('/api/health', (req, res) => {
  res.json({ status: "OK", message: "Le serveur Sneakers Family est en ligne ! 👟" });
});

async function main() {
  try {
    await prisma.$connect();
    console.log(" Prisma connecté");
    try { app.use('/api/auth', require('./routes/auth')); } catch (err) { console.warn("Auth absent"); }
    try { app.use('/api/users', require('./routes/users')); } catch (err) { console.warn("Users absent"); }
    try { app.use('/api/products', require('./routes/products')); } catch (err) { console.warn("Products absent"); }
    try { app.use('/api/cart', require('./routes/cart')); } catch (err) { console.warn("Cart absent"); }
    app.listen(PORT, () => console.log(` Port ${PORT}`));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
main();