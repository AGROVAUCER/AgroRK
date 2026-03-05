// db/seed.ts
// Run (PowerShell):
// 1) Seed all organizations (recommended):
//    $env:SEED_ALL_ORGS="true"
//    npx ts-node --transpile-only .\db\seed.ts
//
// 2) Seed only current token tenant:
//    $env:API_URL="https://agrork.onrender.com/api/v1"
//    $env:ACCESS_TOKEN="PASTE_ACCESS_TOKEN"
//    npx ts-node --transpile-only .\db\seed.ts

import { randomUUID } from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { CROPS, OPERATIONS, toCanonicalKey } from "./defaultSeedData";

const BASE_URL = process.env.API_URL ?? "https://agrork.onrender.com/api/v1";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN ?? "";
const SEED_ALL_ORGS = String(process.env.SEED_ALL_ORGS ?? "").toLowerCase() === "true";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`${init?.method ?? "GET"} ${path} -> ${res.status} ${t}`);
  }

  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("SUPABASE_URL nije postavljen");
  if (!rawKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY nije postavljen");

  const serviceKey = rawKey.split("\n")[0].trim().split("JWT_SECRET=")[0].trim();
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function seedByToken() {
  if (!ACCESS_TOKEN) throw new Error("ACCESS_TOKEN nije postavljen");

  const existingCrops: any[] = (await api("/crops")) ?? [];
  const cropNames = new Set(existingCrops.map((c) => String(c.name).toLowerCase()));

  for (const name of CROPS) {
    if (cropNames.has(name.toLowerCase())) continue;
    await api("/crops", { method: "POST", body: JSON.stringify({ name }) });
    console.log("CROP +", name);
  }

  const existingOps: any[] = (await api("/operations")) ?? [];
  const opNames = new Set(existingOps.map((o) => String(o.name).toLowerCase()));

  for (const op of OPERATIONS) {
    if (opNames.has(op.name.toLowerCase())) continue;
    await api("/operations", { method: "POST", body: JSON.stringify(op) });
    console.log("OP +", op.name);
  }
}

async function seedOrgWithSupabase(supabase: SupabaseClient, orgId: string) {
  const { data: existingCrops, error: cropsErr } = await supabase
    .from("Crop")
    .select("name")
    .eq("orgId", orgId);

  if (cropsErr) throw new Error(cropsErr.message);
  const cropNames = new Set((existingCrops ?? []).map((c: any) => String(c.name).toLowerCase()));

  for (const name of CROPS) {
    if (cropNames.has(name.toLowerCase())) continue;
    const { error } = await supabase.from("Crop").insert({
      id: randomUUID(),
      name,
      aliases: [],
      orgId,
    });
    if (error) throw new Error(error.message);
    console.log(`[${orgId}] CROP +`, name);
  }

  const { data: existingOps, error: opsErr } = await supabase
    .from("Operation")
    .select("name")
    .eq("orgId", orgId);

  if (opsErr) throw new Error(opsErr.message);
  const opNames = new Set((existingOps ?? []).map((o: any) => String(o.name).toLowerCase()));

  for (const op of OPERATIONS) {
    if (opNames.has(op.name.toLowerCase())) continue;
    const { error } = await supabase.from("Operation").insert({
      id: randomUUID(),
      name: op.name,
      applyTo: op.applyTo,
      canonicalKey: toCanonicalKey(op.name),
      userName: "SISTEM",
      aliases: op.aliases ?? [],
      orgId,
    });
    if (error) throw new Error(error.message);
    console.log(`[${orgId}] OP +`, op.name);
  }
}

async function seedAllOrganizations() {
  const supabase = getSupabaseAdmin();
  const { data: orgs, error } = await supabase.from("Organization").select("id,name");

  if (error) throw new Error(error.message);
  if (!orgs?.length) {
    console.log("Nema organizacija za seed.");
    return;
  }

  for (const org of orgs) {
    const orgId = String((org as any).id ?? "").trim();
    if (!orgId) continue;
    await seedOrgWithSupabase(supabase, orgId);
  }
}

async function main() {
  if (SEED_ALL_ORGS) {
    await seedAllOrganizations();
    console.log("SEED DONE (ALL ORGS)");
    return;
  }

  await seedByToken();
  console.log("SEED DONE (TOKEN ORG)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
