// routes/legacy.ts
import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import authRouter from "../modules/auth/auth.routes";
import { createEntry, ensureEntryRules } from "../modules/entries/entries.service";

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceKeyRaw = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const serviceKey = serviceKeyRaw.split("\n")[0].trim();

const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// legacy auth endpoints (frontend expects /auth/*)
router.use("/auth", authRouter);

// helper to resolve orgId (fallback to default)
const resolveOrg = (req: any) =>
  req.headers["x-org-id"]?.toString() || req.user?.orgId || "default-org";

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
  // prvo admin active, ako nema onda bilo koji user
  const { data: admin, error: e1 } = await supabaseAdmin
    .from("User")
    .select("id")
    .eq("orgId", orgId)
    .eq("role", "ADMIN")
    .eq("isActive", true)
    .limit(1)
    .maybeSingle();

  if (e1) throw e1;
  if (admin?.id) return admin.id;

  const { data: anyUser, error: e2 } = await supabaseAdmin
    .from("User")
    .select("id")
    .eq("orgId", orgId)
    .limit(1)
    .maybeSingle();

  if (e2) throw e2;
  if (!anyUser?.id) throw { status: 500, message: "No user found to attribute entry" };
  return anyUser.id;
};

router.get("/api/data", async (req, res, next) => {
  try {
    const orgId = resolveOrg(req);

    const [fields, crops, clients, operations, entries] = await Promise.all([
      supabaseAdmin.from("Field").select("*").eq("orgId", orgId),
      supabaseAdmin.from("Crop").select("*").eq("orgId", orgId),
      supabaseAdmin.from("Client").select("*").eq("orgId", orgId),
      supabaseAdmin.from("Operation").select("*").eq("orgId", orgId),
      supabaseAdmin
        .from("WorkEntry")
        .select("*")
        .eq("orgId", orgId)
        .order("date", { ascending: false }),
    ]);

    if (fields.error) throw fields.error;
    if (crops.error) throw crops.error;
    if (clients.error) throw clients.error;
    if (operations.error) throw operations.error;
    if (entries.error) throw entries.error;

    res.json({
      fields: fields.data ?? [],
      crops: crops.data ?? [],
      clients: clients.data ?? [],
      operations: operations.data ?? [],
      entries: entries.data ?? [],
    });
  } catch (err) {
    next(err);
  }
});

router.post("/api/entry", async (req: any, res, next) => {
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