const prisma = require('../lib/prisma');

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur récupération utilisateurs" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur récupération utilisateur" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, role } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, role }
    });
    res.json({ message: "Utilisateur mis à jour", id: updated.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur mise à jour utilisateur" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur suppression utilisateur" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
