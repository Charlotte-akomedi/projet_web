const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Nettoyage de la base de données...");
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();

  console.log("Génération des 100 produits avec images variées...");

  const brands = ["Sneakers Family", "EcoStep", "GreenStride", "NatureWalk", "UrbanLeaf"];
  const categories = ["Men", "Women", "Kids"];
  
  // ✅ Liste d'images corrigée (montre supprimée, sneakers diversifiées)
  const images = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800", // Rouge Sport
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800", // Pastel
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800", // Colorée
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800", // Verte
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800", // Noire
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800", // Jaune
    "https://images.unsplash.com/photo-1584466113914-8742878d2b93?q=80&w=800", // Bleue
    "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800"  // Marron
  ];

  for (let i = 1; i <= 100; i++) {
    const category = categories[i % categories.length];
    
    //  Logique de pointures réaliste selon la catégorie
    let baseSize = 40; // Par défaut Homme
    if (category === "Women") baseSize = 36;
    if (category === "Kids") baseSize = 24;

    await prisma.product.create({
      data: {
        name: `Modèle Éco ${i}`,
        description: `Une sneaker écoresponsable de la gamme ${brands[i % brands.length]}, conçue pour durer.`,
        brand: brands[i % brands.length],
        category: category,
        basePrice: 75 + (i % 60),
        imageUrl: images[i % images.length],
        variants: {
          create: [
            { size: baseSize + (i % 5), stock: 10 + (i % 20) },
            { size: baseSize + 1 + (i % 5), stock: 5 + (i % 15) },
            { size: baseSize + 2 + (i % 5), stock: 8 + (i % 10) }
          ]
        }
      }
    });
  }

  console.log(" Base de données initialisée avec 100 produits et pointures réalistes !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });