import { catchAsyncError } from "@api/catchError";
import client from "@api/client";
import { createContext, useContext, useEffect, useReducer } from "react";
import { toast } from "react-hot-toast";

export interface User {
  companyId: number;
  subCompanyId: number;
  selectedSubCompany: number;
  username: string;
  password: string;
  email: string;
  verified?: boolean;
  roleName: string;
  id: number;
  access_token: string;
}

const initialUser: User = {
  companyId: 0,
  subCompanyId: 0,
  selectedSubCompany: 0,
  username: "",
  email: "",
  roleName: "",
  access_token: "",
  password: "",
  id: 0,
};

export interface AuthState {
  user: User;
  isLoading: boolean;
}

export type AuthAction =
  | { type: "REGISTER"; payload: User }
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "LOADING" };

interface AuthContextType extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
  logout(): void;
}

interface AuthContextProvider {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthContextProvider: React.FC<AuthContextProvider> = ({
  children,
}) => {
  const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case "REGISTER":
        return { user: action.payload, isLoading: false };
      case "LOGIN":
        return { user: action.payload, isLoading: false };
      case "LOGOUT":
        return { user: initialUser, isLoading: false };
      case "LOADING":
        return { user: initialUser, isLoading: true };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(authReducer, {
    user: initialUser,
    isLoading: false,
  });

  useEffect(() => {
    const localStorageUser = localStorage.getItem("user");
    const localUser: User | null = localStorageUser
      ? JSON.parse(localStorageUser)
      : null;

    if (localUser) {
      verifyUser(localUser);
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  async function verifyUser(localUser: User) {
    try {
      dispatch({ type: "LOADING" });

      const info = {
        companyId: localUser.companyId,
        subCompanyId: localUser.subCompanyId,
      };

      const { data } = await client.post(
        "/system/auth/verifyUser",
        { ...info },
        {
          headers: {
            Authorization: "Bearer " + localUser.access_token,
          },
        }
      );

      if (!data?.res) {
        dispatch({ type: "LOGOUT" });
      }

      const user: User = data?.res;

      let scId;

      if (localUser.selectedSubCompany) {
        scId = localUser.selectedSubCompany;
      } else {
        scId = user.subCompanyId;
      }

      if (user) {
        dispatch({
          type: "LOGIN",
          payload: {
            ...user,
            selectedSubCompany: scId,
            access_token: localUser.access_token,
          },
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    } catch (err) {
      const message = catchAsyncError(err);
      toast.error(message.message);
    }
  }

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    toast.success("Logout sucessfully");
  };

  return (
    <AuthContext.Provider value={{ ...state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }

  return context;
};
