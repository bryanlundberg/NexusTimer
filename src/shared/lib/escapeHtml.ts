const HTML_ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] ?? char)
