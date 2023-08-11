import React from "react";

export const RecipeSection = ({ recipe }) => {
  return (
    <div>
      <h2>레시피</h2>
      {recipe.map((step, index) => (
        <Text key={index}>{step}</Text>
      ))}
    </div>
  );
};
