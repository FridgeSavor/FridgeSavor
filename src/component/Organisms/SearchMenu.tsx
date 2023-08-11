import { FC } from "react";
import { Button, ButtonProps } from "../Atoms/Button";
import { InputProps } from "../Atoms/Input";
import { LabelProps } from "../Atoms/Text";
import { LabelWithInput } from "../Molecules/LabelWithForm";

type SearchMenuPros = {
    mainIngredientProps : InputProps & LabelProps
    newFridgeIngredient: InputProps & LabelProps
    buttonProps : ButtonProps
}

//ButtonProps & InputProps & LabelProps

export const SearchMenu:FC<SearchMenuPros> = (props) => (
  <>
    <LabelWithInput
      type={props.mainIngredientProps.type}
      value={props.mainIngredientProps.value}
      onChange={props.mainIngredientProps.onChange}
    >
      {props.mainIngredientProps.children}
    </LabelWithInput>
    <LabelWithInput
      type="text"
      value={newFridgeIngredient}
      onChange={(e) => setNewFridgeIngredient(e.target.value)}
      onKeyUp={(e) => handleKeyUp(e)} // 엔터 키를 눌렀을 때 추가 기능이 작동
    >
      냉장고의 재료:
    </LabelWithInput>
    <Button onClick={props.buttonProps.onClick}>{props.buttonProps.children}</Button>
  </>
);
