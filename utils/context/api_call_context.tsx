"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { toast } from "react-toastify";
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
    if(res?.isError){
      return toast.error(res.message)
    }
    return toast.success(res.message)
 
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
