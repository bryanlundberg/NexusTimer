import { useState } from "react";

export default function useErrorDialog() {
  const [error, setError] = useState({
    status: false,
    message: "",
  });

  const handleChangeError = ({
    status,
    message,
  }: {
    status: boolean;
    message: string;
  }) => {
    setError((prev) => ({ ...prev, status, message }));
  };

  const handleResetError = () => {
    setError((prev) => ({ ...prev, status: false, message: "" }));
  };

  return {
    error,
    handleChangeError,
    handleResetError,
  };
}
