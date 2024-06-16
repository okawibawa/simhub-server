import { authDbRepository } from "../db/repositories";

import { authSignIn, authSignUp } from "../entities";

const auth = () => {
  const createUser = ({ email, username, password }: authSignUp) =>
    authDbRepository.createUser({ email, username, password });

  const getUser = ({ email }: authSignIn) => authDbRepository.getUser({ email });

  return { createUser, getUser };
};

export const authRepository = auth();
