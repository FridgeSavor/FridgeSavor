import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./component/Atoms/Button";
import { Input } from "./component/Atoms/Input";
import { Label, Text } from "./component/Atoms/Text";
import { LabelWithInput } from "./component/Molecules/LabelWithForm";
import { IngredientItem } from "./component/Molecules/IngredientItem";
import { countMatchesFromRecipe } from "./component/common/recipeUtils";
import { Recipe, ApiResponse } from "./component/common/typeGroup";

function App() {
  //const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const cookrcpAPI = import.meta.env.VITE_COOKRCP_API_KEY;

  const [mainIngredient, setMainIngredient] = useState<string>("");
  const [fridgeIngredients, setFridgeIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<string[]>([]);
  const [newFridgeIngredient, setNewFridgeIngredient] = useState<string>("");
  const [selectedDish, setSelectedDish] = useState<string>("");
  const [searchedDishes, setSearchedDishes] = useState<Map<string, Recipe>>(
    new Map()
  );
  const [recipeIngredients, setRecipeIngredients] = useState<string>("");


  const fetchDishNames = async () => {
    const url = `http://openapi.foodsafetykorea.go.kr/api/${cookrcpAPI}/COOKRCP01/json/1/50/RCP_PARTS_DTLS=${mainIngredient}`;
    try {
      const response = await fetch(url);
      const data: ApiResponse = await response.json();
      const recipes = data.COOKRCP01?.row || [];

      const recipeMap = new Map<string, Recipe>();
      const sortedRecipes = recipes.sort((a, b) => {
        const countA = countMatchesFromRecipe(a, fridgeIngredients);
        const countB = countMatchesFromRecipe(b, fridgeIngredients);

        return (countB || 0) - (countA || 0); // 내림차순 정렬
      });

      sortedRecipes.forEach((recipe) => {
        if (recipe.RCP_NM) {
          recipeMap.set(recipe.RCP_NM, recipe);
        }
      });

      setSearchedDishes(recipeMap);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  const handleIngredientDelete = (index: number) => {
    setFridgeIngredients((prevIngredients) =>
      prevIngredients.filter((_, i) => i !== index)
    );
  };

  const extractManuals = (recipe: any): string[] => {
    let manuals: string[] = [];
    let index = 1;
    let manual = recipe[`MANUAL${String(index).padStart(2, "0")}`];

    while (manual) {
      manuals.push(manual);
      index++;
      manual = recipe[`MANUAL${String(index).padStart(2, "0")}`];
    }
    return manuals;
  };

  const extractIngredients = (recipe: any): string => {
    const rawIngredients = recipe.RCP_PARTS_DTLS;
    return rawIngredients;
  };

  const handleRecipeSearch = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Search recipe based on the selected dish
    if (selectedDish) {
      const selectedRecipe = searchedDishes.get(selectedDish);
      if (selectedRecipe) {
        const manuals = extractManuals(selectedRecipe);
        const ingredients = extractIngredients(selectedRecipe);
        setRecipe(manuals);
        setRecipeIngredients(ingredients); // 재료 저장
      }
    }
  };

  const handleFridgeIngredientSubmit = (event: {
    key?: string;
    preventDefault: any;
  }) => {
    event.preventDefault();
    const ingredient = newFridgeIngredient.trim();
    if (ingredient && !fridgeIngredients.includes(ingredient)) {
      setFridgeIngredients((prevIngredients) => [
        ...prevIngredients,
        ingredient,
      ]);
      setNewFridgeIngredient(""); // 냉장고 재료를 추가한 후에 입력 필드를 비워줍니다.
    }
  };

  const handleKeyUp = (event: { key: string; preventDefault: () => void }) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleFridgeIngredientSubmit(event);
    }
  };

  return (
    <div>
      <form onSubmit={handleRecipeSearch}>
        <LabelWithInput
          type="text"
          value={mainIngredient}
          onChange={(e) => setMainIngredient(e.target.value)}
        >
          우선 소비할 재료:
        </LabelWithInput>
        <LabelWithInput
          type="text"
          value={newFridgeIngredient}
          onChange={(e) => setNewFridgeIngredient(e.target.value)}
          onKeyUp={(e) => handleKeyUp(e)} // 엔터 키를 눌렀을 때 추가 기능이 작동
        >
          냉장고의 재료:
        </LabelWithInput>
        <Button onClick={(e) => handleFridgeIngredientSubmit(e)}>추가</Button>

        <ul>
          {fridgeIngredients.map((ingredient, index) => (
            // TODO: key는 추후 변경필요
            <IngredientItem
              key={index}
              name={ingredient}
              onClick={() => handleIngredientDelete(index)}
            >
              삭제
            </IngredientItem>
          ))}
        </ul>
        <Button onClick={() => fetchDishNames()}> 요리 검색 </Button>
        <div>
          {searchedDishes.size > 0 && (
            <div>
              <Label>요리명 선택:</Label>
              {Array.from(searchedDishes.keys()).map((name, index) => (
                <Label key={index}>
                  <Input
                    type="radio"
                    name="selectedDish"
                    value={name}
                    checked={selectedDish === name}
                    onChange={(e) => setSelectedDish(e.target.value)}
                  />
                  {name}
                </Label>
              ))}
            </div>
          )}
        </div>
        {selectedDish && (
          <Input
            type="submit"
            value="레시피 검색하기"
            onClick={() => handleRecipeSearch}
          />
        )}
      </form>
      {selectedDish && <h2>선택된 요리명: {selectedDish}</h2>}
      {recipe.length > 0 && (
        <div>
          {recipeIngredients.length > 0 && (
            <div>
              <Label>요리 재료:</Label>
              <Text>{recipeIngredients}</Text>
            </div>
          )}
          <Label>레시피:</Label>
          {recipe.map((step, index) => (
            <Label key={index}>{step}</Label>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
