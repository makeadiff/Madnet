import { useState } from "react";

const useGlobalHandler = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(["", false]);
  const [data, setAllData] = useState([]);

  const showMessage = (message, type) => {
    setMessage([message, type]);
    // window.setTimeout(() => {
    //   setError(null);
    // }, 3000);
  };

  const setData = (key, value) => {
    data[key] = value
  }

  return {
    message,
    showMessage,
    loading,
    setLoading,
    data,
    setData
  };
};

export default useGlobalHandler;
