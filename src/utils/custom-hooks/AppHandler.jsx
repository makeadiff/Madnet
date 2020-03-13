import { useState } from "react";

const useGlobalHandler = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(["", false]);
  const [custom, setCustom] = useState([]);

  const showMessage = (message, type) => {
    setMessage([message, type]);
    // window.setTimeout(() => {
    //   setError(null);
    // }, 3000);
  };

  return {
    message,
    showMessage,
    loading,
    setLoading,
    custom,
    setCustom
  };
};

export default useGlobalHandler;
