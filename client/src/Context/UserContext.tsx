import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { api } from "@/api"; // Import API instance

interface User {
  _id: string;
  displayName: string;
  email: string;
  accessToken: string;
  playlists: string[];
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Function to fetch playlists for the user
  const fetchUserPlaylists = async (userId: string) => {
    console.log(userId);
    
    try {
      const response = await api.get(`/api/playlists?owner=${userId}`);
      return response.data.map((playlist: {_id: string}) => playlist._id); // Store playlist IDs
    } catch (error) {
      console.error("Error fetching user playlists:", error);
      return [];
    }
  };

  // Function to set user and ensure playlists are included
  const setUserWithPlaylists = async (newUser: User | null) => {
    if (newUser) {
      const playlists = await fetchUserPlaylists(newUser._id);
      const updatedUser = { ...newUser, playlists };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserWithPlaylists, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
