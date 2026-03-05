import { randomUUID } from "crypto";
import { supabaseAdmin } from "../../src/lib/supabaseAdmin";
import { CROPS, OPERATIONS, toCanonicalKey } from "../../db/defaultSeedData";

type OrganizationRow = {
  id: string;
  name: string;
};

export const seedOrganizationDefaults = async (orgId: string): Promise<void> => {
  const { data: existingCrops, error: cropsErr } = await supabaseAdmin
    .from("Crop")
    .select("name")
    .eq("orgId", orgId);

  if (cropsErr) throw new Error(cropsErr.message);

  const cropNames = new Set(
    (existingCrops ?? []).map((c: any) => String(c.name ?? "").toLowerCase())
  );

  for (const name of CROPS) {
    if (cropNames.has(name.toLowerCase())) continue;

    const { error } = await supabaseAdmin.from("Crop").insert({
      id: randomUUID(),
      name,
      aliases: [],
      orgId,
    });

    if (error) throw new Error(error.message);
  }

  const { data: existingOps, error: opsErr } = await supabaseAdmin
    .from("Operation")
    .select("name")
    .eq("orgId", orgId);

  if (opsErr) throw new Error(opsErr.message);

  const opNames = new Set(
    (existingOps ?? []).map((o: any) => String(o.name ?? "").toLowerCase())
  );

  for (const op of OPERATIONS) {
    if (opNames.has(op.name.toLowerCase())) continue;

    const { error } = await supabaseAdmin.from("Operation").insert({
      id: randomUUID(),
      name: op.name,
      applyTo: op.applyTo,
      canonicalKey: toCanonicalKey(op.name),
      userName: "SISTEM",
      aliases: op.aliases ?? [],
      orgId,
    });

    if (error) throw new Error(error.message);
  }
};

export const createOrganization = async (
  tenantName: string
): Promise<OrganizationRow> => {
  const now = new Date().toISOString();
  const id = randomUUID();
  const name = String(tenantName ?? "").trim() || "Nova organizacija";

  const { data, error } = await supabaseAdmin
    .from("Organization")
    .insert({
      id,
      name,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    })
    .select("id,name")
    .single<OrganizationRow>();

  if (error) throw new Error(error.message);

  // New tenant gets initial master data (crops + operations) immediately.
  await seedOrganizationDefaults(data.id);

  return data;
};
