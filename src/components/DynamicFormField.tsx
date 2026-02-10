import { UseFormReturn } from "react-hook-form";
import { FieldConfig, UserFormData } from "@/config/userSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DynamicFormFieldProps {
  fieldConfig: FieldConfig;
  form: UseFormReturn<UserFormData>;
}

export const DynamicFormField = ({ fieldConfig, form }: DynamicFormFieldProps) => {
  const { name, label, type, placeholder, required, options } = fieldConfig;

  const renderInput = (field: any) => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            className="resize-none"
            {...field}
          />
        );
      case "select":
        return (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
          />
        );
    }
  };

  return (
    <FormField
      control={form.control}
      name={name as keyof UserFormData}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>{renderInput(field)}</FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
