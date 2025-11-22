export const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
