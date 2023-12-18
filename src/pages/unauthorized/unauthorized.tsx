import React from "react";

const UnauthorizedErrorPage: React.FC = () => {
  return (
    <div>
      <h1>Error: You are not authorized to access this page!</h1>
      <p>Please contact support for assistance.</p>
    </div>
  );
};

export default UnauthorizedErrorPage;
