import { countryDbRepository } from "../db/repositories";

import { isPgDatabaseError, DatabaseError } from "../errors";

import { countryNameSearchParamsData } from "../cores/validation";

const country = () => {
  const getCountries = async () => {
    try {
      const countries = await countryDbRepository.getCountries();

      return countries;
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw error;
    }
  };

  const getCountriesBySearch = async (countryName: countryNameSearchParamsData) => {
    try {
      const countries = await countryDbRepository.getCountriesBySearch({ name: countryName.name });

      return countries;
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw error;
    }
  };

  return { getCountries, getCountriesBySearch };
};

export const countryRepository = country();
