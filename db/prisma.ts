// Prisma je izbačen iz runtime-a.
// Ovaj stub postoji da legacy importi ne ruše build.
// Ako se pozove u runtime-u, baciće grešku.

export const prisma: any = new Proxy(
  {},
  {
    get() {
      throw new Error('Prisma removed from runtime. Replace with supabaseAdmin.')
    },
  }
)