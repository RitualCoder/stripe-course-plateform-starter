import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting seed process...');

    // Vérification de la connexion à la base de données
    await prisma.$connect();
    console.log('Database connection successful');

    // Création d'un utilisateur test
    console.log('Creating test user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      },
    });
    console.log('User created successfully:', user);

    // Création de plusieurs cours
    console.log('Creating courses...');
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Introduction à la Programmation',
          description: 'Apprenez les bases de la programmation',
          price: 49.99,
        },
      }),
      prisma.course.create({
        data: {
          title: 'Développement Web Avancé',
          description: 'Maîtrisez le développement web moderne',
          price: 99.99,
        },
      }),
      prisma.course.create({
        data: {
          title: 'Base de Données SQL',
          description: 'Apprenez à gérer vos données avec SQL',
          price: 79.99,
        },
      }),
    ]);
    console.log('Courses created successfully:', courses);
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed');
  });
