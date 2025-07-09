import React, { createContext, useState } from 'react';

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);

  return (
    <AppContext.Provider value={{ user, setUser, room, setRoom }}>
      {children}
    </AppContext.Provider>
  );
};
