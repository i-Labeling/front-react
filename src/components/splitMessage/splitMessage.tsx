import React from "react";

interface SplitMessageProps {
  message?: string;
  className?: string;
}

const SplitMessage: React.FC<SplitMessageProps> = ({ message, className }) => {
  if (!message) return null;

  const messageWithLineBreaks = message.split("\\n").join("<br/>");

  return (
    <h4
      className={className}
      dangerouslySetInnerHTML={{ __html: messageWithLineBreaks }}
    />
  );
};

export default SplitMessage;
