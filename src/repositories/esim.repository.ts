import { esimDbRepository } from "../db/repositories";

import { esimPlanDetailsParamsEntity, esimPlansParamsEntity } from "../entities";

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

  const getEsimPlansById = async (id: esimPlanDetailsParamsEntity) => {
    try {
      const esimPlans = await esimDbRepository.getEsimsById(id);

      return esimPlans;
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw error;
    }
  };

  return { getEsimPlans, getEsimPlansById };
};

export const esimRepository = esim();
