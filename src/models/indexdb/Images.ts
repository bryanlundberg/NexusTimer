import { database } from "@/db/indexdb";
import BoxDB, { BoxData } from "bxd";

const STORE_NAME = "nx-images";

const imagesSchema = {
  name: {
    key: true,
    type: BoxDB.Types.STRING,
    index: true,
  },
  background: BoxDB.Types.STRING,
} as const;

const Images = database.create(STORE_NAME, imagesSchema);

export type ImagesType = BoxData<typeof imagesSchema>;
export default Images;
