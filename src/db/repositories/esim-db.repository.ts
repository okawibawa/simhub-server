import { sql } from "drizzle-orm";
import { dbInstance } from "..";

import { esimPlanDetailsParamsEntity, esimPlansParamsEntity } from "@/src/entities";

export const esim = () => {
  const getEsims = async (countryCode: esimPlansParamsEntity) =>
    await dbInstance
      .getDbInstance()
      .execute(
        sql`select e.*, c.name from esims e join countries c on e.country_code = c.code where e.country_code = ${countryCode.code}`
      );

  const getEsimsById = async (id: esimPlanDetailsParamsEntity) =>
    await dbInstance
      .getDbInstance()
      .execute(
        sql`select e.*, c.name from esims e join countries c on e.country_code = c.code where e.id = ${id.id}`
      );

  return { getEsims, getEsimsById };
};

export const esimDbRepository = esim();
