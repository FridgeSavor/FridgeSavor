import React, { useState, useEffect } from "react";
import axios from "axios";
import { App } from "electron";
import { SearchBar } from "../../Molecules/SearchBar";
import { FridgeIngredientList } from "../../Organisms/FridgeIngredientList";
import { RecipeSection } from "../../Organisms/RecipeSection";
import { RecipeTemplate } from "../../Templates/RecipeTemplate";

type Recipe = {
  RECIPE_RAW_MATR?: string;
  RECIPE_NM_KO?: string;
  RCP_NM?: string;
};

type ApiResponse = {
  COOKRCP01?: {
    row?: Recipe[];
  };
};

function Main() {
  // const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

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
    const url = `http://openapi.foodsafetykorea.go.kr/api/${cookrcpAPI}/COOKRCP01/json/1/5/RCP_PARTS_DTLS=${mainIngredient}`;
    try {
      const response = await fetch(url);
      const data: ApiResponse = await response.json();
      const recipes = data.COOKRCP01?.row || [];
      console.log({ recipes });

      const recipeMap = new Map<string, Recipe>();
      const sortedRecipes = recipes.sort((a, b) => {
        const ingredientsA =
          a.RECIPE_RAW_MATR?.split("●주재료 : ")[1]
            ?.split("\n")[0]
            ?.split(",")
            ?.flatMap((ingredient) => ingredient.trim().split(" ")[0]) || [];
        const ingredientsB =
          b.RECIPE_RAW_MATR?.split("●주재료 : ")[1]
            ?.split("\n")[0]
            ?.split(",")
            ?.flatMap((ingredient) => ingredient.trim().split(" ")[0]) || [];

        const countA = ingredientsA.filter((ingredient) =>
          fridgeIngredients.includes(ingredient)
        ).length;
        const countB = ingredientsB.filter((ingredient) =>
          fridgeIngredients.includes(ingredient)
        ).length;

        return countB - countA; // 내림차순 정렬
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

    /*
    const prompt = `${mainIngredient}을 반드시 포함하고, 냉장고에 있는 ${fridgeIngredients.join(
      ", "
    )}를 많이 소비하여 만들 수 있는 요리 3개 찾아주세요. 재료들 없이 요리 이름만 한국어로 반환해주세요, 예를 들어 "검색된 요리명1, 검색된 요리명2, 검색된 요리명3"처럼 콤마로 구분하도록 해주세요.`;
  
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/text-davinci-003/completions",
        {
          prompt,
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
  
      const result = response.data.choices[0].text.trim();
      setDishName(result);
      setSearchedDishes(result.split(",").map((name: string) => name.trim()));
      setSelectedDish(""); // 검색 시 선택된 요리명 초기화
      setRecipe([]); // 검색 시 레시피 초기화
    } catch (error) {
      console.error(error);
    }
    */
  };

  /*
  useEffect(() => {
    const fetchRecipe = async () => {
      const prompt = `${selectedDish}에 대한 자세한 레시피를 알려주세요. 필요한 재료를 첫 줄에 표시하고, 그 이후 조리 방법을 순서대로 작성해주세요.`;
  
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/engines/text-davinci-003/completions",
          {
            prompt,
            max_tokens: 1000,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
  
        const result = response.data.choices[0].text.trim().split("\n");
        setRecipe(result);
      } catch (error) {
        console.error(error);
      }
    };
  
    if (selectedDish) {
      fetchRecipe();
    }
  }, [selectedDish, apiKey]);
  
  
  
  const fetchRecipe = async () => {
    const url = `http://openapi.foodsafetykorea.go.kr/api/${cookrcpAPI}/COOKRCP01//xml/1/5/RCP_PARTS_DTLS=${mainIngredient}`;
    console.log('start')
    try {
      const response = await fetch(url);
      const data = await response.json();
      const recipes = data.COOKRCP01.row;
      const selectedRecipe = recipes[0]; // 첫 번째 레시피를 선택
      console.log({selectedRecipe})
      setRecipe([selectedRecipe.RECIPE_ID, selectedRecipe.RECIPE_NM_KO]); // 선택된 레시피 설정
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };
  */
  const handleIngredientDelete = (index) => {
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

  const handleRecipeSearch = (event) => {
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

  const handleFridgeIngredientSubmit = (event) => {
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

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleFridgeIngredientSubmit(event);
    }
  };
  return (
    <RecipeTemplate>
      <SearchBar
        onChange={handleMainIngredientChange}
        onSubmit={fetchDishNames}
        placeholder="우선 소비할 재료 입력"
      />
      <FridgeIngredientList
        ingredients={fridgeIngredients}
        onDelete={handleIngredientDelete}
        onAdd={handleFridgeIngredientSubmit}
      />
      <DishSelector
        dishes={searchedDishes}
        selectedDish={selectedDish}
        onChange={handleDishSelection}
      />
      <RecipeButton onClick={handleRecipeSearch} />
      <SelectedDishInfo name={selectedDish} />
      <RecipeSection ingredients={recipeIngredients} recipe={recipe} />
    </RecipeTemplate>
  );
}

export default App;
