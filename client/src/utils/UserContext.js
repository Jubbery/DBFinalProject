// import React, { createContext, useState, useContext } from "react";

// const UserContext = createContext();

// export const useUser = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// BELOW IS TESTING CODE WITH HARDCODED USER ABOVE IS THE REAL CODE

import React, { createContext, useState } from 'react';

// Create a context
export const UserContext = createContext();

// Create a function to manage the user state
export function useUser() {
  const [user, setUser] = useState({
    user_id: '12345678', // HARDCODED FOR TESTING
    // add other user properties as needed
  });

  return { user, setUser };
}

// Create a provider component
export const UserProvider = ({ children }) => {
  const { user, setUser } = useUser();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
