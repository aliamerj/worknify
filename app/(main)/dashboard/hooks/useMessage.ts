// import { useState, useCallback } from "react";

// export type MessageRes = {
//   isError: boolean;
//   message: string;
// };

// export const useMessage = () => {
//   const [message, setMessage] = useState<MessageRes | null>(null);

//   const setMessageRes = useCallback((res: MessageRes) => {
    
//     setMessage(res);
//   }, []);

//   return { message, setMessageRes };
// };
