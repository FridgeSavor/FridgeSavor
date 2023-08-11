import React, { FC } from "react";
import { Input, InputProps } from "../Atoms/Input";
import { Label,LabelProps } from "../Atoms/Text";

type Props = InputProps & LabelProps

export const LabelWithInput: FC<Props> = (props) => (
  <>
    <Label>
      {props.children}
      <Input
        type={props.type}
        value={props.value}
        onChange={props.onChange}
      />
    </Label>
  </>
);
