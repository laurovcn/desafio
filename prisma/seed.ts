import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Remove all data
  await prisma.crop.deleteMany();
  await prisma.harvest.deleteMany();
  await prisma.property.deleteMany();
  await prisma.farmer.deleteMany();

  // Create farmers
  const farmer1 = await prisma.farmer.create({
    data: {
      cpfCnpj: '12345678901',
      name: 'John Smith',
      role: Role.ADMIN,
    },
  });
  const farmer2 = await prisma.farmer.create({
    data: {
      cpfCnpj: '98765432100',
      name: 'Mary Johnson',
      role: Role.FARMER,
    },
  });

  // Create properties
  const property1 = await prisma.property.create({
    data: {
      name: 'Green Valley Farm',
      city: 'Springfield',
      state: 'IL',
      totalArea: 100,
      arableArea: 60,
      vegetationArea: 40,
      farmerId: farmer1.id,
    },
  });
  const property2 = await prisma.property.create({
    data: {
      name: 'Sunny Acres',
      city: 'Riverdale',
      state: 'CA',
      totalArea: 80,
      arableArea: 50,
      vegetationArea: 30,
      farmerId: farmer2.id,
    },
  });

  // Create harvests
  const harvest1 = await prisma.harvest.create({
    data: {
      name: 'Harvest 2021',
      propertyId: property1.id,
    },
  });
  const harvest2 = await prisma.harvest.create({
    data: {
      name: 'Harvest 2022',
      propertyId: property2.id,
    },
  });

  // Create crops
  await prisma.crop.createMany({
    data: [
      { name: 'Soy', harvestId: harvest1.id },
      { name: 'Corn', harvestId: harvest1.id },
      { name: 'Coffee', harvestId: harvest2.id },
    ],
  });
}

main()
  .then(() => {
    console.log('Seeds created successfully!');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
