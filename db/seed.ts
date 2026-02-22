import "dotenv/config";
import { prisma } from "./prisma";

const defaultOrgId = "default-org";

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: defaultOrgId },
    update: {},
    create: {
      id: defaultOrgId,
      name: "Default Farm",
      plan: "Basic",
      status: "Active",
    },
  });

  const crops = [
    { name: "Pšenica" },
    { name: "Kukuruz" },
    { name: "Soja" },
    { name: "Suncokret" },
    { name: "Ječam" },
    { name: "Uljana Repica" },
    { name: "Šećerna Repa" },
    { name: "Paprika" },
    { name: "Luk" },
    { name: "Krompir" },
    { name: "Šargarepa" },
    { name: "Kupus" },
  ];

  const operations = [
    { name: "Oranje", type: "Oba" },
    { name: "Setva", type: "Oba" },
    { name: "Prskanje", type: "Oba" },
    { name: "Žetva", type: "Oba" },
    { name: "Transport", type: "Usluga" },
    { name: "Špartanje", type: "Oba" },
    { name: "Gruberovanje", type: "Oba" },
    { name: "Podrivanje", type: "Oba" },
    { name: "Tanjiranje", type: "Oba" },
    { name: "Zalivanje", type: "Oba" },
    { name: "Branje", type: "Oba" },
    { name: "Baliranje", type: "Oba" },
  ];

  const fields = [
    { name: "Velika Njiva", area: 5.5, unit: "ha", currentCrop: "Pšenica" },
    { name: "Mala Livada", area: 2.3, unit: "ha", currentCrop: "Kukuruz" },
    { name: "Vinograd", area: 1.2, unit: "ha", currentCrop: "Suncokret" },
  ];

  const clients = [
    { name: "Jovan Jovanović", phone: "0641234567", location: "Novi Sad" },
    { name: "Firma Agro", phone: "021123456", location: "Beograd" },
  ];

  const executors = [
    { name: "Marko Marković" },
    { name: "Petar Petrović" },
    { name: "Zoran" },
  ];

  // Insert data
  const cropRecords = await Promise.all(
    crops.map((c) =>
      prisma.crop.upsert({
        where: { name_orgId: { name: c.name, orgId: org.id } },
        update: {},
        create: { name: c.name, orgId: org.id },
      })
    )
  );

  const operationRecords = await Promise.all(
    operations.map((op) =>
      prisma.operation.upsert({
        where: { name_orgId: { name: op.name, orgId: org.id } },
        update: {},
        create: { name: op.name, type: op.type, orgId: org.id },
      })
    )
  );

  const fieldRecords = await Promise.all(
    fields.map((f) => {
      const cropId = cropRecords.find((c) => c.name === f.currentCrop)?.id;
      return prisma.field.upsert({
        where: { name_orgId: { name: f.name, orgId: org.id } },
        update: { currentCropId: cropId || undefined },
        create: {
          name: f.name,
          area: f.area,
          unit: f.unit,
          currentCropId: cropId,
          orgId: org.id,
        },
      });
    })
  );

  const clientRecords = await Promise.all(
    clients.map((c) =>
      prisma.client.upsert({
        where: { name_orgId: { name: c.name, orgId: org.id } },
        update: {},
        create: { name: c.name, phone: c.phone, location: c.location, orgId: org.id },
      })
    )
  );

  const executorRecords = await Promise.all(
    executors.map((ex) =>
      prisma.executor.upsert({
        where: { name_orgId: { name: ex.name, orgId: org.id } },
        update: {},
        create: { name: ex.name, orgId: org.id },
      })
    )
  );

  // Sample entries
  const today = new Date();
  const yesterday = new Date(Date.now() - 24 * 3600 * 1000);
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3600 * 1000);

  const opOranje = operationRecords.find((o) => o.name === "Oranje");
  const opPrskanje = operationRecords.find((o) => o.name === "Prskanje");
  const opSetva = operationRecords.find((o) => o.name === "Setva");

  await prisma.workEntry.createMany({
    data: [
      {
        date: today,
        type: "Rad",
        fieldId: fieldRecords[0].id,
        operationId: opOranje?.id || operationRecords[0].id,
        executorId: executorRecords[0].id,
        status: "Zavrseno",
        source: "Web",
        quantity: 5.5,
        unit: "ha",
        notes: "Završeno pre kiše",
        orgId: org.id,
      },
      {
        date: today,
        type: "Usluga",
        clientId: clientRecords[0].id,
        operationId: opPrskanje?.id || operationRecords[2].id,
        cropId: cropRecords.find((c) => c.name === "Kukuruz")?.id,
        executorId: executorRecords[1].id,
        status: "U toku",
        source: "Voice",
        quantity: 10,
        unit: "ha",
        notes: "Pera prska kod Jovana",
        orgId: org.id,
      },
      {
        date: yesterday,
        type: "Rad",
        fieldId: fieldRecords[1].id,
        operationId: opSetva?.id || operationRecords[1].id,
        cropId: cropRecords.find((c) => c.name === "Soja")?.id,
        executorId: executorRecords[0].id,
        status: "Zavrseno",
        source: "Web",
        quantity: 2.3,
        unit: "ha",
        orgId: org.id,
      },
      {
        date: twoDaysAgo,
        type: "Usluga",
        clientId: clientRecords[1].id,
        operationId: operationRecords.find((o) => o.name === "Transport")?.id || operationRecords[4].id,
        executorId: executorRecords[2].id,
        status: "Zavrseno",
        source: "Web",
        quantity: 8,
        unit: "sati",
        orgId: org.id,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.yield.createMany({
    data: [
      {
        year: 2023,
        fieldId: fieldRecords[0].id,
        cropId: cropRecords.find((c) => c.name === "Pšenica")?.id || cropRecords[0].id,
        area: 5.5,
        totalYield: 33000,
        yieldPerUnit: 6000,
        orgId: org.id,
      },
      {
        year: 2023,
        fieldId: fieldRecords[1].id,
        cropId: cropRecords.find((c) => c.name === "Soja")?.id || cropRecords[2].id,
        area: 2.3,
        totalYield: 8050,
        yieldPerUnit: 3500,
        orgId: org.id,
      },
    ],
    skipDuplicates: true,
  });

  // Default admin user
  await prisma.user.upsert({
    where: { email: "user@agro.local" },
    update: {},
    create: {
      email: "user@agro.local",
      password: "$2a$10$U5frAzlZk90un0nLBKBP/.ZiY4QmiFjCwXTlzAIXazhbugzuDUFcW", // "password123"
      role: "ADMIN",
      orgId: org.id,
    },
  });

  console.log("Seed completed");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
