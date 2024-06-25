import { countryDbRepository } from "../db/repositories";
import { paramsEntity } from "../entities/params.entity";

import { isPgDatabaseError, DatabaseError } from "../errors";

const country = () => {
  const getCountries = async (queries: Pick<paramsEntity, "limit">) => {
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
