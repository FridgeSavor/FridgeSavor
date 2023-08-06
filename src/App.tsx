import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const cookrcpAPI = import.meta.env.VITE_COOKRCP_API_KEY;

  const [mainIngredient, setMainIngredient] = useState("");
  const [fridgeIngredients, setFridgeIngredients] = useState([]);
  const [dishName, setDishName] = useState("");
  const [recipe, setRecipe] = useState([]);
  const [newFridgeIngredient, setNewFridgeIngredient] = useState("");
  const [selectedDish, setSelectedDish] = useState("");
  const [searchedDishes, setSearchedDishes] = useState(['양베추볶음','부추김치','탕수육']);

  const fetchDishNames = async () => {
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

  */
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

  const handleIngredientDelete = (index) => {
    setFridgeIngredients((prevIngredients) =>
      prevIngredients.filter((_, i) => i !== index)
    );
  };

  const handleRecipeSearch = (event) => {
    event.preventDefault();
    // Search recipe based on the selected dish
    if (selectedDish) {
      fetchRecipe(selectedDish);
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
    <div>
      <form onSubmit={handleRecipeSearch}>
        <label>
          우선 소비할 재료:
          <input
            type="text"
            value={mainIngredient}
            onChange={(e) => setMainIngredient(e.target.value)}
          />
        </label>
        <label>
          냉장고의 재료:
          <input
            type="text"
            value={newFridgeIngredient}
            onChange={(e) => setNewFridgeIngredient(e.target.value)}
            onKeyUp={handleKeyUp} // 엔터 키를 눌렀을 때 추가 기능이 작동하도록 수정
          />
          <button onClick={handleFridgeIngredientSubmit}>추가</button>
        </label>
        <ul>
          {fridgeIngredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient}
              <button onClick={() => handleIngredientDelete(index)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
        <button onClick={fetchDishNames}> 요리 검색 </button>
        <div>
          {searchedDishes.length > 0 && (
            <div>
              <h2>요리명 선택:</h2>
              {searchedDishes.map((name, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name="selectedDish"
                    value={name}
                    checked={selectedDish === name}
                    onChange={(e) => setSelectedDish(e.target.value)}
                  />
                  {name}
                </label>
              ))}
            </div>
          )}
        </div>
        <input type="submit" value="레시피 검색하기" onClick={fetchRecipe}/>
      </form>
      {selectedDish && <h2>선택된 요리명: {selectedDish}</h2>}
      {recipe.length > 0 && (
        <div>
          <h3>레시피:</h3>
          {recipe.map((step, index) => (
            <p key={index}>{step}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
