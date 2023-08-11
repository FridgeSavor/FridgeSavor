import { FC } from "react";
import { Button, ButtonProps } from "../Atoms/Button";
import { InputProps } from "../Atoms/Input";
import { LabelProps } from "../Atoms/Text";
import { LabelWithInput } from "../Molecules/LabelWithForm";

type SearchMenuPros = {
  mainIngredientProps: InputProps & LabelProps;
  newFridgeIngredientProps: InputProps & LabelProps;
  buttonProps: ButtonProps;
};

//ButtonProps & InputProps & LabelProps

export const SearchMenu: FC<SearchMenuPros> = (props) => (
  <>
    <LabelWithInput
      type={props.mainIngredientProps.type}
      value={props.mainIngredientProps.value}
      onChange={props.mainIngredientProps.onChange}
    >
      {props.mainIngredientProps.children}
    </LabelWithInput>
    <LabelWithInput
      type={props.newFridgeIngredientProps.type}
      value={props.newFridgeIngredientProps.value}
      onChange={props.newFridgeIngredientProps.onChange}
      onKeyUp={props.newFridgeIngredientProps.onKeyUp}
    >
      {props.newFridgeIngredientProps.children}
    </LabelWithInput>
    <Button onClick={props.buttonProps.onClick}>
      {props.buttonProps.children}
    </Button>
  </>
);
