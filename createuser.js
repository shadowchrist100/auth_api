import prisma from './src/lib/prisma.js';

async function seed() {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "mon_mot_de_passe_securise",
        firstName: "Samuel",
        lastName: "TP",
        emailVerifiedAt: new Date(), // On le marque comme vérifié pour le test
      },
    });
    console.log("✅ Utilisateur créé :", newUser);
  } catch (error) {
    console.error("❌ Erreur lors de la création :", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();