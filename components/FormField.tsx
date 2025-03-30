import { Controller, FieldValues, Control, Path } from "react-hook-form"
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils" // Utility for combining class names

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  className?: string; // Optional for additional styling
  rules?: any; // Optionally pass validation rules (like required, minLength, etc.)
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  className,
  rules,
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules} 
      render={({ field, fieldState: { error } }) => (
        <FormItem className={cn("form-item", className)}>
          <FormLabel className="form-label">{label}</FormLabel>
          <FormControl>
            <Input
              className={cn("form-input", error ? "border-red-500" : "")} // Add error styling if validation fails
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          {error && <FormMessage>{error.message}</FormMessage>} {/* Display error message */}
        </FormItem>
      )}
    />
  )
}

export default FormField;
