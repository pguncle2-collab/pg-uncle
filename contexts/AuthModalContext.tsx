'use client';

import { createContext, useContext } from 'react';

const AuthModalContext = createContext<{
  openAuthModal: () => void;
}>({
  openAuthModal: () => {},
});

export const useAuthModal = () => useContext(AuthModalContext);

export default AuthModalContext;
