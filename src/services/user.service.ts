import { userRepository } from "../repositories";

import { authRepository } from "../repositories";

import { NotFoundError } from "../errors";

const user = () => {
  const updateUser = async (id: number) => {
    try {
      const user = await authRepository.getUserById({ id });

      if (!user) {
        throw NotFoundError("User not found.", 400);
      }

      const updatedUser = await userRepository.updateUser(id);

      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  return { updateUser };
};

export const userService = user();
