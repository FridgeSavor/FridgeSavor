import React, { FC } from "react";

export type ButtonProps ={
  onClick?: (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void;
  children?: React.ReactNode
}

export const Button:FC<ButtonProps> = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};
