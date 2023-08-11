import { RecipePart, Recipe } from "./typeGroup";

export const parseIngredients = (detail: RecipePart | undefined): string[] => {
  if (!detail) return [];

  return (
    detail
      .split(":")[1]
      ?.split(/,| /)
      ?.filter((str) => str)
      .map((str) => str.split("(")[0]) || []
  );
};

export const countMatchingIngredients = (
  ingredients: string[],
  reference: string[]
): number => {
  return ingredients.filter((ingredient) => reference.includes(ingredient))
    .length;
};

export const countMatchesFromRecipe = (
  recipe: Recipe,
  referenceIngredients: string[]
): number => {
  const ingredients = parseIngredients(recipe?.RCP_PARTS_DTLS);
  return countMatchingIngredients(ingredients, referenceIngredients);
};



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
