import { v4 as uuidv4 } from "uuid";
declare module "uuid";

/**
 * Generates a new UUID (Universally Unique Identifier).
 * @returns {string} The generated UUID.
 */

export default function genId() {
  return uuidv4();
}
