import { useId } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  rows?: number;
};

export function TextField({ label, value, onChange, disabled = false, rows }: TextFieldProps) {
  const id = useId();
  const controlProps = { id, value, disabled, className: "font-mono" };

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {rows ? (
        <Textarea {...controlProps} rows={rows} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <Input {...controlProps} onChange={(event) => onChange(event.target.value)} />
      )}
    </Field>
  );
}
