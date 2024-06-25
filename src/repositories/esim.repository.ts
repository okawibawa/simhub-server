import { esimDbRepository } from "../db/repositories";

import { esimPlansParamsEntity } from "../entities";

import { DatabaseError, isPgDatabaseError } from "../errors";

const esim = () => {
  const getEsimPlans = async (countryCode: esimPlansParamsEntity) => {
    try {
      const esimPlans = await esimDbRepository.getEsims(countryCode);

      return esimPlans;
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw error;
    }
  };

  return { getEsimPlans };
};

export const esimRepository = esim();
