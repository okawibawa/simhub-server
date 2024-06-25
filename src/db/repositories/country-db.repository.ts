import { queriesEntity } from "@/src/entities";
import { dbInstance } from "..";

import { countriesSchema } from "../schema";

const country = () => {
  const getCountries = async (queries: Pick<queriesEntity, "limit">) =>
    await dbInstance.getDbInstance().select().from(countriesSchema).limit(queries.limit);

  return { getCountries };
};

export const countryDbRepository = country();
