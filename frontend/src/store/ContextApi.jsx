// import React, { createContext, useContext, useState } from 'react';
// import { useEffect } from 'react';
// import toast from 'react-hot-toast';
// import api from '../services/api';

// const ContextApi = createContext();

// export const ContextProvider = ({ children }) => {
//   // Get token directly from localStorage without extra JSON.stringify
//   const getToken = localStorage.getItem('JWT_TOKEN') || null;

//   // Parse IS_ADMIN as boolean instead of string of a JSON string
//   const isAdminValue = localStorage.getItem('IS_ADMIN') === 'true';

//   // Store the token
//   const [token, setToken] = useState(getToken);

//   // Store the current logged in user
//   const [currentUser, setCurrentUser] = useState(null);

//   // Handle sidebar opening and closing in the admin panel
//   const [openSidebar, setOpenSidebar] = useState(true);

//   // Check if the logged in user is admin or not
//   const [isAdmin, setIsAdmin] = useState(isAdminValue);

//   const fetchUser = async () => {
//     if (token) {
//       try {
//         const { data } = await api.get(`/auth/user`);
//         const roles = data.roles;

//         if (roles && roles.includes('ROLE_ADMIN')) {
//           localStorage.setItem('IS_ADMIN', 'true');
//           setIsAdmin(true);
//         } else {
//           localStorage.removeItem('IS_ADMIN');
//           setIsAdmin(false);
//         }

//         // Save user data in localStorage for persistence
//         localStorage.setItem('USER', JSON.stringify(data));
//         setCurrentUser(data);
//       } catch (error) {
//         console.error('Error fetching current user', error);
//         toast.error('Error fetching current user');
//       }
//     }
//   };

//   // If token exists fetch the current user
//   useEffect(() => {
//     if (token) {
//       fetchUser();
//     } else {
//       // Clear user data when no token is present
//       setCurrentUser(null);
//       setIsAdmin(false);
//     }
//   }, [token]);

//   // Through context provider you are sending all the data so that we can access it anywhere in the application
//   return (
//     <ContextApi.Provider
//       value={{
//         token,
//         setToken,
//         currentUser,
//         setCurrentUser,
//         openSidebar,
//         setOpenSidebar,
//         isAdmin,
//         setIsAdmin,
//       }}
//     >
//       {children}
//     </ContextApi.Provider>
//   );
// };

// export const useMyContext = () => {
//   const context = useContext(ContextApi);
//   if (!context) {
//     throw new Error('useMyContext must be used within a ContextProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
  // Get token directly from localStorage without extra JSON.stringify
  const getToken = localStorage.getItem('JWT_TOKEN') || null;

  // Parse IS_ADMIN as boolean instead of string of a JSON string
  const isAdminValue = localStorage.getItem('IS_ADMIN') === 'true';

  // Store the token
  const [token, setToken] = useState(getToken);

  // Store the current logged in user
  const [currentUser, setCurrentUser] = useState(null);

  // Handle sidebar opening and closing in the admin panel
  const [openSidebar, setOpenSidebar] = useState(true);

  // Check if the logged in user is admin or not
  const [isAdmin, setIsAdmin] = useState(isAdminValue);

  const fetchUser = async () => {
    if (token) {
      try {
        const { data } = await api.get(`/auth/user`);
        const roles = data.roles;

        // 🔁 updated logic to support ROLE_ROLE_ADMIN or any admin role
        const hasAdminRole = roles?.some((role) =>
          role.toLowerCase().includes('admin')
        );

        if (hasAdminRole) {
          localStorage.setItem('IS_ADMIN', 'true');
          setIsAdmin(true);
        } else {
          localStorage.removeItem('IS_ADMIN');
          setIsAdmin(false);
        }

        // Save user data in localStorage for persistence
        localStorage.setItem('USER', JSON.stringify(data));
        setCurrentUser(data);
      } catch (error) {
        console.error('Error fetching current user', error);
        toast.error('Error fetching current user');
      }
    }
  };

  // If token exists fetch the current user
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      // Clear user data when no token is present
      setCurrentUser(null);
      setIsAdmin(false);
    }
  }, [token]);

  return (
    <ContextApi.Provider
      value={{
        token,
        setToken,
        currentUser,
        setCurrentUser,
        openSidebar,
        setOpenSidebar,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(ContextApi);
  if (!context) {
    throw new Error('useMyContext must be used within a ContextProvider');
  }
  return context;
};
