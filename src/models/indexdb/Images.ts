import { database } from "@/db/indexdb";

const STORE_NAME = "nx-images";

const Images = database.create(STORE_NAME);

export default Images;
