import React, { FC } from "react";

export type LabelProps = {
  children: React.ReactNode;
};

export const Label: FC<LabelProps> = ({ children }) => {
  return <label>{children}</label>;
};

export const Text: FC<LabelProps> = ({ children }) => {
  return <p>{children}</p>;
};
