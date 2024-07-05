import { userDbRepository } from "../db/repositories";

const user = () => {
  const updateUser = async (id: number) => {
    try {
      const user = await userDbRepository.getUser(id);

      return user;
    } catch (error) {
      throw error;
    }
  };

  return { updateUser };
};

export const userRepository = user();
