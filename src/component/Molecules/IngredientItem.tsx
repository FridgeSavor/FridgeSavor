import React, { FC } from "react";
import { Button, ButtonProps } from "../Atoms/Button";

type IngredientItemProps = ButtonProps & {
  name?:string
}

export const IngredientItem:FC<IngredientItemProps> = ({ name, onClick, children }) => {
    return (
      <li>
        {name}
        <Button onClick={onClick}>{children}</Button>
      </li>
    );
  }