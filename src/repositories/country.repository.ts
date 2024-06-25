import { countryDbRepository } from "../db/repositories";
import { queriesEntity } from "../entities";

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

  return { getCountries };
};

export const countryRepository = country();
