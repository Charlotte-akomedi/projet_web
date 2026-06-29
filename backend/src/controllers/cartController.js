const prisma = require('../lib/prisma');

let tempCart = [];

const addToCart = (req, res) => {
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
};

const getCart = async (req, res) => {
  const now = new Date();
  tempCart = tempCart.filter(item => new Date(item.expiresAt) > now);

  try {
    const enrichedCart = await Promise.all(
      tempCart.map(async (item) => {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        return {
          ...item,
          productName: product?.name || 'Modèle Inconnu',
          productImage: product?.imageUrl || '',
          productPrice: product?.basePrice || 0
        };
      })
    );
    res.json(enrichedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur enrichissement' });
  }
};

const deleteCartItem = (req, res) => {
  tempCart = tempCart.filter(item => item.id !== req.params.id);
  res.status(204).send();
};

const clearCart = (req, res) => {
  tempCart = [];
  res.status(204).send();
};

module.exports = {
  addToCart,
  getCart,
  deleteCartItem,
  clearCart
};
