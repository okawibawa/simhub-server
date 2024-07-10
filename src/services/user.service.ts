import { userRepository } from "../repositories";

import { authRepository } from "../repositories";

import { NotFoundError } from "../errors";
import { userSchemaData } from "../cores/validation";
import { hash } from "bcrypt";

const user = () => {
  const updateUser = async (id: number, body: userSchemaData) => {
    try {
      const user = await authRepository.getUserById({ id });

      if (!user) {
        throw NotFoundError("User not found.", 400);
      }

      if (body.password) {
        const hashedPassword = await hash(body.password, 10);

        body.password = hashedPassword;
      }

      const updatedUser = await userRepository.updateUser(id, body);

      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  return { updateUser };
};

export const userService = user();
