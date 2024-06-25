import { queriesEntity } from "../entities";
import { countryRepository } from "../repositories";

const country = () => {
  const getCountries = async (queries: Pick<queriesEntity, "limit">) => {
    try {
      const countries = await countryRepository.getCountries(queries);

      return countries;
    } catch (error) {
      throw error;
    }
  };

  return { getCountries };
};

export const countryService = country();
