import { Router } from "express";

/**
 * Minimal legacy router used to keep compatibility with older Supabase function paths.
 * For now it just responds with a health payload.
 */
const router = Router();

router.all("*", (_req, res) => {
  res.json({ status: "ok", legacy: true });
});

export const legacyRouter = router;
