import { sql } from "drizzle-orm";
import { dbInstance } from "..";
import { idData } from "@/src/cores/common";

import { countryCodeParamsData } from "@/src/cores/validation";

export const esim = () => {
  const getEsims = async (countryCode: countryCodeParamsData) =>
    await dbInstance
      .getDbInstance()
      .execute(
        sql`select e.*, c.name from esims e join countries c on e.country_code = c.code where e.country_code = ${countryCode.code}`
      );

  const getEsimsById = async (id: idData) =>
    await dbInstance
      .getDbInstance()
      .execute(
        sql`select e.*, c.name from esims e join countries c on e.country_code = c.code where e.id = ${id.id}`
      );

  return { getEsims, getEsimsById };
};

export const esimDbRepository = esim();
