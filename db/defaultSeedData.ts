export type OpApplyTo = "WORK" | "SERVICE" | "BOTH";

export const CROPS = [
  "Psenica",
  "Kukuruz",
  "Jecam",
  "Tritikale",
  "Suncokret",
  "Soja",
  "Uljana repica",
  "Secerna repa",
  "Lucerka",
  "Detelina",
  "Krompir",
  "Luk",
  "Kupus",
];

export const OPERATIONS: Array<{ name: string; applyTo: OpApplyTo; aliases?: string[] }> = [
  { name: "Oranje", applyTo: "WORK" },
  { name: "Podrivanje", applyTo: "WORK" },
  { name: "Tanjiranje", applyTo: "WORK" },
  { name: "Freziranje", applyTo: "WORK" },
  { name: "Setvospremanje", applyTo: "WORK" },
  { name: "Valjanje", applyTo: "WORK" },
  { name: "Setva", applyTo: "WORK" },
  { name: "Presadivanje", applyTo: "WORK" },
  { name: "Osnovno djubrenje", applyTo: "WORK" },
  { name: "Prihrana", applyTo: "WORK" },
  { name: "Folijarna prihrana", applyTo: "WORK" },
  { name: "Prskanje herbicidom", applyTo: "WORK" },
  { name: "Prskanje fungicidom", applyTo: "WORK" },
  { name: "Prskanje insekticidom", applyTo: "WORK" },
  { name: "Spartanje", applyTo: "WORK" },
  { name: "Okopavanje", applyTo: "WORK" },
  { name: "Zalivanje / navodnjavanje", applyTo: "WORK" },
  { name: "Kosenje", applyTo: "WORK" },
  { name: "Zetva", applyTo: "WORK" },
  { name: "Berba", applyTo: "WORK" },
  { name: "Baliranje", applyTo: "WORK" },
  { name: "Siliranje", applyTo: "WORK" },
  { name: "Utovar", applyTo: "WORK" },
  { name: "Transport", applyTo: "WORK" },
  { name: "Usluga oranja", applyTo: "SERVICE" },
  { name: "Usluga setve", applyTo: "SERVICE" },
  { name: "Usluga prskanja", applyTo: "SERVICE" },
  { name: "Usluga zetve", applyTo: "SERVICE" },
  { name: "Usluga transporta", applyTo: "SERVICE" },
];

export const toCanonicalKey = (name: string) =>
  String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
