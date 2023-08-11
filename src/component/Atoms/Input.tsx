import React, { FC } from "react";

export type InputProps = {
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void; 
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  checked?:boolean;
  name?:string;
}

export const Input:FC<InputProps> = ({ ...props }) => {
  return <input {...props} />;
};
