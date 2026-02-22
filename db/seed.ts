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
    { name: "Oranje", applyTo: "BOTH" },
    { name: "Setva", applyTo: "BOTH" },
    { name: "Prskanje", applyTo: "BOTH" },
    { name: "Žetva", applyTo: "BOTH" },
    { name: "Transport", applyTo: "SERVICE" },
    { name: "Špartanje", applyTo: "BOTH" },
    { name: "Gruberovanje", applyTo: "BOTH" },
    { name: "Podrivanje", applyTo: "BOTH" },
    { name: "Tanjiranje", applyTo: "BOTH" },
    { name: "Zalivanje", applyTo: "BOTH" },
    { name: "Branje", applyTo: "BOTH" },
    { name: "Baliranje", applyTo: "BOTH" },
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
        update: {
          applyTo: op.applyTo,
          canonicalKey: op.canonicalKey ?? op.name.toLowerCase(),
          userName: op.userName ?? op.name,
        },
        create: {
          name: op.name,
          applyTo: op.applyTo,
          canonicalKey: op.canonicalKey ?? op.name.toLowerCase(),
          userName: op.userName ?? op.name,
          aliases: op.aliases ?? [],
          orgId: org.id,
        },
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
          aliases: f.aliases ?? [],
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
        create: { name: c.name, phone: c.phone, location: c.location, aliases: c.aliases ?? [], orgId: org.id },
      })
    )
  );

  const executorRecords = await Promise.all(
    executors.map((ex) =>
      prisma.executor.upsert({
        where: { name_orgId: { name: ex.name, orgId: org.id } },
        update: {},
        create: { name: ex.name, aliases: ex.aliases ?? [], orgId: org.id },
      })
    )
  );

  // Default admin user (needed for createdByUserId)
  const adminUser = await prisma.user.upsert({
    where: { email: "user@agro.local" },
    update: { name: "Default Admin", passwordHash: "$2a$10$U5frAzlZk90un0nLBKBP/.ZiY4QmiFjCwXTlzAIXazhbugzuDUFcW", role: "ADMIN", isActive: true, orgId: org.id },
    create: {
      name: "Default Admin",
      email: "user@agro.local",
      phone: "000-0000",
      passwordHash: "$2a$10$U5frAzlZk90un0nLBKBP/.ZiY4QmiFjCwXTlzAIXazhbugzuDUFcW", // "password123"
      role: "ADMIN",
      isActive: true,
      orgId: org.id,
    },
  });

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
        entryType: "WORK",
        fieldId: fieldRecords[0].id,
        operationId: opOranje?.id || operationRecords[0].id,
        executorId: executorRecords[0].id,
        status: "DONE",
        source: "WEB",
        quantity: 5.5,
        unit: "ha",
        note: "Završeno pre kiše",
        createdByUserId: adminUser.id,
        orgId: org.id,
      },
      {
        date: today,
        entryType: "SERVICE",
        clientId: clientRecords[0].id,
        operationId: opPrskanje?.id || operationRecords[2].id,
        cropId: cropRecords.find((c) => c.name === "Kukuruz")?.id,
        executorId: executorRecords[1].id,
        status: "IN_PROGRESS",
        source: "VOICE",
        quantity: 10,
        unit: "ha",
        note: "Pera prska kod Jovana",
        voiceOriginalText: "Pera prska kod Jovana",
        createdByUserId: adminUser.id,
        orgId: org.id,
      },
      {
        date: yesterday,
        entryType: "WORK",
        fieldId: fieldRecords[1].id,
        operationId: opSetva?.id || operationRecords[1].id,
        cropId: cropRecords.find((c) => c.name === "Soja")?.id,
        executorId: executorRecords[0].id,
        status: "DONE",
        source: "WEB",
        quantity: 2.3,
        unit: "ha",
        createdByUserId: adminUser.id,
        orgId: org.id,
      },
      {
        date: twoDaysAgo,
        entryType: "SERVICE",
        clientId: clientRecords[1].id,
        operationId: operationRecords.find((o) => o.name === "Transport")?.id || operationRecords[4].id,
        executorId: executorRecords[2].id,
        status: "DONE",
        source: "WEB",
        quantity: 8,
        unit: "sati",
        createdByUserId: adminUser.id,
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
        note: null,
        orgId: org.id,
      },
      {
        year: 2023,
        fieldId: fieldRecords[1].id,
        cropId: cropRecords.find((c) => c.name === "Soja")?.id || cropRecords[2].id,
        area: 2.3,
        totalYield: 8050,
        note: null,
        orgId: org.id,
      },
    ],
    skipDuplicates: true,
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
