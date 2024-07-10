import { esimDbRepository } from "../db/repositories";

import { DatabaseError, isPgDatabaseError } from "../errors";

import { countryCodeParamsData } from "../cores/validation";
import { idData } from "../cores/common";

const esim = () => {
  const getEsimPlans = async (countryCode: countryCodeParamsData) => {
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

  const getEsimPlansById = async (id: idData) => {
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
