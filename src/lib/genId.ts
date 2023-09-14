import { v4 as uuidv4 } from "uuid";
declare module "uuid";

export default function genId() {
  return uuidv4();
}
