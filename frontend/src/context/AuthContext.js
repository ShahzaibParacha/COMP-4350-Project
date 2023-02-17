import { createContext, useReducer } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_ID":
      return { ...state, user_id: action.payload };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "CLEAR":
      return { ...state, user_id: null, token: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user_id: null,
    token: null,
  });

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
