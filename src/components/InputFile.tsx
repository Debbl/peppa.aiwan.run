import type { ButtonProps } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import type { ChangeEventHandler, MouseEventHandler } from "react";
import { useRef } from "react";

export interface InputFileProps
  extends Omit<ButtonProps, "onChange" | "onClick"> {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function InputFile({ onChange, ...props }: InputFileProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <Button {...props} onClick={handleClick} />
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".xlsx"
        onChange={onChange}
      />
    </>
  );
}
