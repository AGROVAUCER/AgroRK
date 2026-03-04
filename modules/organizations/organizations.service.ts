import { randomUUID } from "crypto";
import { supabaseAdmin } from "../../src/lib/supabaseAdmin";

type OrganizationRow = {
  id: string;
  name: string;
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
  return data;
};
