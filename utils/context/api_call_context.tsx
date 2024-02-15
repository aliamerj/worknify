"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
export type MessageRes = {
  isError: boolean;
  message: string;
};
interface UIContextType {
  isLoading: boolean;
  message: MessageRes | null;
  setIsLoading: (isLoading: boolean) => void;
  setMessageRes: (res: MessageRes) => void;
}

const ApiCallContext = createContext<UIContextType | undefined>(undefined);

export const useApiCallContext = (): UIContextType => {
  const context = useContext(ApiCallContext);
  if (!context) {
    throw new Error("useUIContext must be used within a UIProvider");
  }
  return context;
};

export const ApiCallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageRes | null>(null);

  const setMessageRes = useCallback((res: MessageRes) => {
    setMessage(res);
    const timer = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timer);
  }, []);

  const contextValue = useMemo(
    () => ({
      isLoading,
      setIsLoading,
      message,
      setMessageRes,
    }),
    [isLoading, message],
  );

  return (
    <ApiCallContext.Provider value={contextValue}>
      {children}
    </ApiCallContext.Provider>
  );
};
