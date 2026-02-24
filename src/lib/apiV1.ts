// src/lib/apiV1.ts  (BACKEND: bez import.meta)
export const API_V1_URL: string = (() => {
  const v =
    process.env.API_V1_URL ||
    process.env.API_URL ||
    process.env.VITE_API_V1_URL ||
    process.env.VITE_API_URL

  if (!v) throw new Error('API base url missing. Set API_V1_URL or API_URL.')
  return v
})()
