import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

// helper to resolve orgId (fallback to default)
const resolveOrg = (req: any) => req.headers["x-org-id"]?.toString() || req.user?.orgId || "default-org";

router.get("/api/data", async (req, res, next) => {
  try {
    const orgId = resolveOrg(req);
    const [fields, crops, clients, operations, entries] = await Promise.all([
      prisma.field.findMany({ where: { orgId } }),
      prisma.crop.findMany({ where: { orgId } }),
      prisma.client.findMany({ where: { orgId } }),
      prisma.operation.findMany({ where: { orgId } }),
      prisma.workEntry.findMany({ where: { orgId }, orderBy: { date: "desc" } }),
    ]);
    res.json({ fields, crops, clients, operations, entries });
  } catch (err) {
    next(err);
  }
});

router.post("/api/seed", async (req, res, next) => {
  try {
    const orgId = resolveOrg(req);
    const { fields = [], crops = [], clients = [], operations = [], entries = [] } = req.body || {};

    await prisma.$transaction([
      ...crops.map((c: any) =>
        prisma.crop.upsert({
          where: { name_orgId: { name: c.name, orgId } },
          update: { aliases: c.aliases ?? [] },
          create: { name: c.name, aliases: c.aliases ?? [], orgId },
        })
      ),
      ...operations.map((op: any) =>
        prisma.operation.upsert({
          where: { name_orgId: { name: op.name, orgId } },
          update: { type: op.type, aliases: op.aliases ?? [] },
          create: { name: op.name, type: op.type ?? "Oba", aliases: op.aliases ?? [], orgId },
        })
      ),
      ...fields.map((f: any) =>
        prisma.field.upsert({
          where: { name_orgId: { name: f.name, orgId } },
          update: { area: f.area, unit: f.unit, currentCropId: f.currentCropId },
          create: {
            name: f.name,
            area: f.area ?? 0,
            unit: f.unit ?? "ha",
            aliases: f.aliases ?? [],
            currentCropId: f.currentCropId,
            orgId,
          },
        })
      ),
      ...clients.map((c: any) =>
        prisma.client.upsert({
          where: { name_orgId: { name: c.name, orgId } },
          update: { phone: c.phone, location: c.location, aliases: c.aliases ?? [] },
          create: { name: c.name, phone: c.phone, location: c.location, aliases: c.aliases ?? [], orgId },
        })
      ),
    ]);

    if (entries.length > 0) {
      await prisma.workEntry.createMany({
        data: entries.map((e: any) => ({
          ...e,
          orgId,
          date: e.date ? new Date(e.date) : new Date(),
        })),
        skipDuplicates: true,
      });
    }

    res.status(201).json({ status: "seeded" });
  } catch (err) {
    next(err);
  }
});

router.post("/api/entry", async (req, res, next) => {
  try {
    const orgId = resolveOrg(req);
    const body = req.body || {};
    const entry = await prisma.workEntry.create({
      data: {
        date: body.date ? new Date(body.date) : new Date(),
        type: body.type ?? "Rad",
        fieldId: body.fieldId,
        clientId: body.clientId,
        operationId: body.operationId,
        cropId: body.cropId,
        executorId: body.executorId,
        quantity: body.quantity,
        unit: body.unit,
        status: body.status ?? "Zavrseno",
        source: body.source ?? "Web",
        voiceText: body.voiceText,
        notes: body.notes,
        orgId,
      },
    });
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

router.get("/", (_req, res) => res.json({ status: "ok", legacy: true }));

export const legacyRouter = router;
