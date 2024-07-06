import { countryRepository } from "../repositories";

import { countryNameSearchParamsData } from "../cores/validation/country.schema";

const country = () => {
  const getCountries = async () => {
    try {
      const countries = await countryRepository.getCountries();

      return countries;
    } catch (error) {
      throw error;
    }
  };

  const getCountriesBySearch = async (countryName: countryNameSearchParamsData) => {
    try {
      const countries = await countryRepository.getCountriesBySearch({ name: countryName.name });

      return countries;
    } catch (error) {
      throw error;
    }
  };

  return { getCountries, getCountriesBySearch };
};

export const countryService = country();
