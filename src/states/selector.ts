import { selector } from 'recoil';
import { countMatchesFromRecipe } from '../component/common/recipeUtils';
import { ApiResponse, Recipe } from '../component/common/typeGroup';

export const searchedDishesSelector = selector({
  key: 'searchedDishesSelector',
  get: async ({ get }) => {
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

      return recipeMap;
    } catch (error) {
      console.error("에러 발생:", error);
      throw error;
    }
  }
});
