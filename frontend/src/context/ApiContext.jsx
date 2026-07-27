import { createContext, useContext } from "react";

const ApiContext = createContext();

export function ApiProvider({ children }) {
  return (
    <ApiContext.Provider value={{}}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiContext() {
  return useContext(ApiContext);
}