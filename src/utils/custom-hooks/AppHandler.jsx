import { useState } from "react";

const useGlobalHandler = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(["", false]);
  const [data] = useState([]);

  const showMessage = (message, type) => {
    setMessage([message, type]);
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
