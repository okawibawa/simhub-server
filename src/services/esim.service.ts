import { esimRepository } from "../repositories";

import { esimPlansParamsEntity } from "../entities";

const esim = () => {
  const getEsimPlans = async (countryCode: esimPlansParamsEntity) => {
    try {
      return await esimRepository.getEsimPlans(countryCode);
    } catch (error) {
      throw error;
    }
  };

  return { getEsimPlans };
};

export const esimService = esim();
