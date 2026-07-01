import { Meilisearch } from 'meilisearch'

const host = process.env.MEILISEARCH_HOST!
const apiKey = process.env.MEILISEARCH_API_KEY!

const meilisearch = new Meilisearch({ host, apiKey })

export default meilisearch
