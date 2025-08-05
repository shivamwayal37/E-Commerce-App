export type RootState = {
  auth: {
    user: {
      id: string;
      email: string;
      name: string;
    } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
};

export type AppDispatch = any;
