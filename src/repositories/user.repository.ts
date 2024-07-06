import { userDbRepository } from "../db/repositories";

const user = () => {
  const updateUser = async (id: number, username: string) => {
    try {
      const user = await userDbRepository.updateUser(id, username);

      return user;
    } catch (error) {
      throw error;
    }
  };

  return { updateUser };
};

export const userRepository = user();
