import { createContext, useContext, useState, ReactNode } from "react";

interface SetupInf {
  customer: string;
  serviceOrder: string;
  amauntMemory: string;
  typeMemory: string;
  inspectionMode: number;
  gridList: any[];
}

interface GlobalStateContextProps {
  setupInf: SetupInf;
  setSetupInf: React.Dispatch<React.SetStateAction<SetupInf>>;
}

const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(
  undefined
);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [setupInf, setSetupInf] = useState<SetupInf>({
    customer: "1",
    serviceOrder: "null",
    amauntMemory: "null",
    typeMemory: "udimm",
    inspectionMode: 1,
    gridList: [],
  });

  const value: GlobalStateContextProps = {
    setupInf,
    setSetupInf,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextProps => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
