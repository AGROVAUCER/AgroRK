import { Router } from "express";
import { prisma } from "../db/prisma";
import { createEntry, ensureEntryRules } from "../modules/entries/entries.service";

const router = Router();

// helper to resolve orgId (fallback to default)
const resolveOrg = (req: any) => req.headers["x-org-id"]?.toString() || req.user?.orgId || "default-org";

const resolveStatus = (status: string | undefined) => {
  if (!status) return "DONE";
  const s = status.toLowerCase();
  if (s.startsWith("u ") || s.startsWith("in_")) return "IN_PROGRESS";
  return "DONE";
};

const resolveEntryType = (type: string | undefined) => {
  if (!type) return "WORK";
  const t = type.toLowerCase();
  return t.startsWith("rad") ? "WORK" : "SERVICE";
};

const resolveSource = (src: string | undefined) => {
  if (!src) return "WEB";
  const s = src.toLowerCase();
  return s.startsWith("voice") ? "VOICE" : "WEB";
};

const defaultCreator = async (orgId: string) => {
  const user = await prisma.user.findFirst({ where: { orgId, role: "ADMIN", isActive: true } }) ||
    await prisma.user.findFirst({ where: { orgId } });
  if (!user) throw { status: 500, message: "No user found to attribute entry" };
  return user.id;
};

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
          update: { applyTo: op.applyTo ?? "BOTH", aliases: op.aliases ?? [], userName: op.userName ?? op.name, canonicalKey: op.canonicalKey ?? op.name.toUpperCase() },
          create: {
            name: op.name,
            applyTo: op.applyTo ?? "BOTH",
            userName: op.userName ?? op.name,
            canonicalKey: op.canonicalKey ?? op.name.toUpperCase(),
            aliases: op.aliases ?? [],
            orgId,
          },
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
      const creatorId = await defaultCreator(orgId);
      await prisma.workEntry.createMany({
        data: entries.map((e: any) => ({
          date: e.date ? new Date(e.date) : new Date(),
          entryType: resolveEntryType(e.type || e.entryType),
          fieldId: e.fieldId ?? null,
          clientId: e.clientId ?? null,
          operationId: e.operationId,
          cropId: e.cropId ?? null,
          executorId: e.executorId ?? null,
          quantity: e.quantity ?? null,
          unit: e.unit ?? null,
          status: resolveStatus(e.status),
          note: e.notes ?? e.note ?? null,
          source: resolveSource(e.source),
          voiceOriginalText: e.voiceText ?? e.voiceOriginalText ?? null,
          createdByUserId: creatorId,
          orgId,
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
    const creatorId = req.user?.id ?? (await defaultCreator(orgId));
    const payload = {
      ...body,
      entryType: resolveEntryType(body.type || body.entryType),
      status: resolveStatus(body.status),
      source: resolveSource(body.source),
      note: body.notes ?? body.note,
      voiceOriginalText: body.voiceText ?? body.voiceOriginalText,
    };
    await ensureEntryRules(orgId, payload);
    const entry = await createEntry(orgId, creatorId, payload);
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

router.get("/", (_req, res) => res.json({ status: "ok", legacy: true }));

export const legacyRouter = router;
