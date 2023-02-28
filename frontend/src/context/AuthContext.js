import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  // defines the actions that can be done with the context
  switch (action.type) {
    case "SET_USER_ID":
      return { ...state, userId: action.payload };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "CLEAR":
      return { ...state, userId: null, token: null };
    default:
      return state;
  }
};

export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    userId: null,
    token: null,
  });

  return (
    // might need to change this in the future if performance is degrading
    // eslint-disable-next-line
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  // can keep this since it is up to preference according to the doc
  // eslint-disable-next-line
  children: PropTypes.any,
};
