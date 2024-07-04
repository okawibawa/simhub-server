import { sql } from "drizzle-orm";

import { countriesSearchEntity, queriesEntity } from "@/src/entities";
import { dbInstance } from "..";

import { countriesSchema } from "../schema";

const country = () => {
  const getCountries = async (queries: queriesEntity) =>
    await dbInstance.getDbInstance().select().from(countriesSchema).limit(queries.limit);

  const getCountriesBySearch = async (countryName: countriesSearchEntity) =>
    await dbInstance
      .getDbInstance()
      .execute(sql`select * from countries where name ~* ${countryName.name}`);

  return { getCountries, getCountriesBySearch };
};

export const countryDbRepository = country();
