import { countriesSearchEntity, queriesEntity } from "../entities";
import { countryRepository } from "../repositories";

const country = () => {
  const getCountries = async (queries: queriesEntity) => {
    try {
      const countries = await countryRepository.getCountries(queries);

      return countries;
    } catch (error) {
      throw error;
    }
  };

  const getCountriesBySearch = async (countryName: countriesSearchEntity) => {
    try {
      const countries = await countryRepository.getCountriesBySearch(countryName);

      return countries;
    } catch (error) {
      throw error;
    }
  };

  return { getCountries, getCountriesBySearch };
};

export const countryService = country();
