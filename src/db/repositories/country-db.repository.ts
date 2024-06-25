import { paramsEntity } from "@/src/entities/params.entity";
import { dbInstance } from "..";

import { countriesSchema } from "../schema";

const country = () => {
  const getCountries = async (queries: paramsEntity) =>
    await dbInstance.getDbInstance().select().from(countriesSchema).limit(queries.limit);

  return { getCountries };
};

export const countryDbRepository = country();
