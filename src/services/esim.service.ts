import { countryCodeParamsData } from "../cores/validation";
import { esimRepository } from "../repositories";

const esim = () => {
  const getEsimPlans = async (countryCode: countryCodeParamsData) => {
    try {
      return await esimRepository.getEsimPlans(countryCode);
    } catch (error) {
      throw error;
    }
  };

  const getEsimPlansById = async (id: number) => {
    try {
      return await esimRepository.getEsimPlansById({ id });
    } catch (error) {
      throw error;
    }
  };

  return { getEsimPlans, getEsimPlansById };
};

export const esimService = esim();
