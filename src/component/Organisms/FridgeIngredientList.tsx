import React from "react";
import { IngredientItem } from "../Molecules/IngredientItem";
export const FridgeIngredientList = ({ ingredients, onDelete }) => {
  return (
    <ul>
      {ingredients.map((ingredient, index) => (
        <IngredientItem
          key={index}
          name={ingredient}
          onDelete={() => onDelete(index)}
        />
      ))}
    </ul>
  );
};
