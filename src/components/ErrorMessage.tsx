import * as React from "react";

const ErrorMessageContainer: React.FC<{ errorMessage: string | null }> = ({
  errorMessage
}) => {
  return <div className="error-message">{errorMessage}</div>;
};

export default ErrorMessageContainer;
