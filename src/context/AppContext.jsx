import React, { createContext, useState } from 'react';

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // текущий залогиненный/выбранный пользователь
  const [room, setRoom] = useState(null);   // выбранная комната

  return (
    <AppContext.Provider value={{ user, setUser, room, setRoom }}>
      {children}
    </AppContext.Provider>
  );
};
