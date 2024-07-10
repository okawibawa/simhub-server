import { userSchemaData } from "../cores/validation";
import { userDbRepository } from "../db/repositories";

const user = () => {
  const updateUser = async (id: number, body: userSchemaData) => {
    try {
      const user = await userDbRepository.updateUser(id, body);

      return user;
    } catch (error) {
      throw error;
    }
  };

  return { updateUser };
};

export const userRepository = user();
