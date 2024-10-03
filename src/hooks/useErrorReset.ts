import { useEffect } from "react";

export default function useErrorReset(isOpen:boolean , setError: React.Dispatch<React.SetStateAction<{ isOpen: boolean; message: string }>>) {
  useEffect(() => {
    if(!isOpen){
        setError({ isOpen: false, message: "" });
    }
  },[isOpen , setError]);
}
