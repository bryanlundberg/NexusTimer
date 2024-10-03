import { useEffect } from "react";

export default function useErrorReset(isOpen:boolean , setError: React.Dispatch<React.SetStateAction<{ status: boolean; message: string }>>) {
  useEffect(() => {
    if(!isOpen){
        setError({ status: false, message: "" });
    }
  },[isOpen , setError]);
}
