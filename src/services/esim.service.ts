import { esimRepository } from "../repositories";

import { esimPlanDetailsParamsEntity, esimPlansParamsEntity } from "../entities";

const esim = () => {
  const getEsimPlans = async (countryCode: esimPlansParamsEntity) => {
    try {
      return await esimRepository.getEsimPlans(countryCode);
    } catch (error) {
      throw error;
    }
  };

  const getEsimPlansById = async (id: esimPlanDetailsParamsEntity) => {
    try {
      return await esimRepository.getEsimPlansById(id);
    } catch (error) {
      throw error;
    }
  };

  return { getEsimPlans, getEsimPlansById };
};

export const esimService = esim();
