// db/seed.ts
// Run (PowerShell):
//   $env:API_URL="https://agrork.onrender.com/api/v1"
//   $env:ACCESS_TOKEN="PASTE_ACCESS_TOKEN"
//   npx ts-node --transpile-only .\db\seed.ts

const BASE_URL = process.env.API_URL ?? 'https://agrork.onrender.com/api/v1'
const ACCESS_TOKEN = process.env.ACCESS_TOKEN ?? ''

type OpApplyTo = 'WORK' | 'SERVICE' | 'BOTH'

const CROPS = [
  'Pšenica', 'Kukuruz', 'Ječam', 'Ovas', 'Raž', 'Tritikale', 'Sirak',
  'Suncokret', 'Soja', 'Uljana repica', 'Šećerna repa', 'Duvan',
  'Lucerka', 'Detelina (crvena)', 'Detelina (bela)',
  'Krompir', 'Crni luk', 'Beli luk', 'Šargarepa', 'Cvekla', 'Kupus',
  'Karfiol', 'Brokoli', 'Paprika', 'Paradajz', 'Krastavac', 'Tikvica',
  'Boranija', 'Grašak', 'Pasulj', 'Spanać', 'Zelena salata', 'Patlidžan',
  'Lubenica', 'Dinja',
  'Šljiva', 'Jabuka', 'Kruška', 'Trešnja', 'Višnja', 'Breskva', 'Nektarina',
  'Kajsija', 'Vinova loza', 'Malina', 'Kupina', 'Jagoda', 'Borovnica',
  'Orah', 'Lešnik',
]

const OPERATIONS: Array<{ name: string; applyTo: OpApplyTo; aliases?: string[] }> = [
  { name: 'Oranje', applyTo: 'WORK' },
  { name: 'Podrivanje', applyTo: 'WORK' },
  { name: 'Tanjiranje', applyTo: 'WORK' },
  { name: 'Freziranje', applyTo: 'WORK' },
  { name: 'Predsetvena priprema', applyTo: 'WORK' },
  { name: 'Valjanje', applyTo: 'WORK' },

  { name: 'Setva', applyTo: 'WORK' },
  { name: 'Sadnja', applyTo: 'WORK' },
  { name: 'Presađivanje', applyTo: 'WORK' },

  { name: 'Osnovno đubrenje', applyTo: 'WORK' },
  { name: 'Prihrana', applyTo: 'WORK' },
  { name: 'Folijarna prihrana', applyTo: 'WORK' },

  { name: 'Prskanje herbicidom', applyTo: 'WORK' },
  { name: 'Prskanje fungicidom', applyTo: 'WORK' },
  { name: 'Prskanje insekticidom', applyTo: 'WORK' },

  { name: 'Međuredna kultivacija', applyTo: 'WORK' },
  { name: 'Okopavanje', applyTo: 'WORK' },
  { name: 'Malčiranje', applyTo: 'WORK' },
  { name: 'Zalivanje / navodnjavanje', applyTo: 'WORK' },

  { name: 'Rezidba', applyTo: 'WORK' },
  { name: 'Košenje', applyTo: 'WORK' },

  { name: 'Žetva', applyTo: 'WORK' },
  { name: 'Berba', applyTo: 'WORK' },
  { name: 'Balenje', applyTo: 'WORK' },
  { name: 'Siliranje', applyTo: 'WORK' },

  { name: 'Utovar', applyTo: 'WORK' },
  { name: 'Transport', applyTo: 'WORK' },
  { name: 'Sušenje', applyTo: 'WORK' },
  { name: 'Skladištenje', applyTo: 'WORK' },

  { name: 'Usluga oranja', applyTo: 'SERVICE' },
  { name: 'Usluga setve', applyTo: 'SERVICE' },
  { name: 'Usluga prskanja', applyTo: 'SERVICE' },
  { name: 'Usluga žetve', applyTo: 'SERVICE' },
  { name: 'Usluga transporta', applyTo: 'SERVICE' },
]

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`${init?.method ?? 'GET'} ${path} -> ${res.status} ${t}`)
  }

  if (res.status === 204) return null
  return res.json().catch(() => null)
}

async function main() {
  if (!ACCESS_TOKEN) throw new Error('ACCESS_TOKEN nije postavljen')

  // CROPS
  const existingCrops: any[] = (await api('/crops')) ?? []
  const cropNames = new Set(existingCrops.map((c) => String(c.name).toLowerCase()))

  for (const name of CROPS) {
    if (cropNames.has(name.toLowerCase())) continue
    await api('/crops', { method: 'POST', body: JSON.stringify({ name }) })
    console.log('CROP +', name)
  }

  // OPERATIONS
  const existingOps: any[] = (await api('/operations')) ?? []
  const opNames = new Set(existingOps.map((o) => String(o.name).toLowerCase()))

  for (const op of OPERATIONS) {
    if (opNames.has(op.name.toLowerCase())) continue
    await api('/operations', { method: 'POST', body: JSON.stringify(op) })
    console.log('OP +', op.name)
  }

  console.log('SEED DONE')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})