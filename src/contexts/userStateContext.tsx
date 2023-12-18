import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface User {
  email: string;
  timeLogged: string;
  token: any;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const storedUser = localStorage.getItem("userData");
  const initialUser: User = storedUser
    ? JSON.parse(storedUser)
    : { email: "", timeLogged: "", token: "" };

  const [user, setUser] = useState<User>(initialUser);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(user));
    sessionStorage.setItem("userData", JSON.stringify(user));

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";

      clearUserData();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  const clearUserData = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("jwtToken");
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("profile");
    setUser({
      email: "null",
      timeLogged: "null",
      token: null,
    });
  };

  const value: UserContextType = {
    user,
    setUser,
    clearUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
