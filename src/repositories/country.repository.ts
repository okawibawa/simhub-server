import { countryDbRepository } from "../db/repositories";
import { countriesSearchEntity, queriesEntity } from "../entities";

import { isPgDatabaseError, DatabaseError } from "../errors";

const country = () => {
  const getCountries = async (queries: Pick<queriesEntity, "limit">) => {
    try {
      const countries = await countryDbRepository.getCountries(queries);

      return countries;
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw error;
    }
  };

  const getCountriesBySearch = async (countryName: countriesSearchEntity) => {
    try {
      const countries = await countryDbRepository.getCountriesBySearch(countryName);

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
