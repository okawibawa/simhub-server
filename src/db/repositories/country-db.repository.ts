import { sql } from "drizzle-orm";

import { dbInstance } from "..";

import { countriesSchema } from "../schema";

import { countryNameSearchParamsData } from "@/src/cores/validation";

const country = () => {
  const getCountries = async () =>
    await dbInstance.getDbInstance().select().from(countriesSchema).limit(12);

  const getCountriesBySearch = async (countryName: countryNameSearchParamsData) =>
    await dbInstance
      .getDbInstance()
      .execute(sql`select * from countries where name ~* ${countryName.name}`);

  return { getCountries, getCountriesBySearch };
};

export const countryDbRepository = country();
