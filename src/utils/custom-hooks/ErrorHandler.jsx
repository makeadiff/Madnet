import * as React from "react";

const useErrorHandler = (initialState) => {
  const [error, setError] = React.useState(initialState);
  const showError = (errorMessage) => {
    setError(errorMessage);
    // window.setTimeout(() => {
    //   setError(null);
    // }, 3000);
  };
  return { error, showError };
};

export default useErrorHandler;
