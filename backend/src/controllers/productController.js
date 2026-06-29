const prisma = require('../lib/prisma');

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { variants: true } });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur catalogue' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { variants: true }
    });
    if (!product) return res.status(404).json({ message: 'Introuvable' });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur produit' });
  }
};

module.exports = {
  getAllProducts,
  getProductById
};
