import { authSignIn, authSignUp } from "../entities";

const auth = () => {
  const signUp = async ({ email, username, password }: authSignUp): Promise<authSignUp> => {
    return { email, username, password };
  };

  const signIn = async ({ email, password }: authSignIn) => {
    return { email, password };
  };

  return {
    signUp,
    signIn,
  };
};

export const authService = auth();
