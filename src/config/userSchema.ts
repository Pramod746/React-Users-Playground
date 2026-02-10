import { z } from "zod";

// Field types supported by the dynamic form system
export type FieldType = "text" | "email" | "tel" | "date" | "textarea" | "select";

// Field configuration interface - add new fields by extending this config
export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  validation?: z.ZodTypeAny;
  options?: { value: string; label: string }[]; // For select fields
  gridColumn?: "full" | "half"; // Layout control
}

// ============================================
// USER SCHEMA CONFIGURATION
// To add a new field, simply add it to this array
// ============================================
export const userFieldsConfig: FieldConfig[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter first name",
    required: true,
    validation: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
    gridColumn: "half",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter last name",
    required: true,
    validation: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
    gridColumn: "half",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter email address",
    required: true,
    validation: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    gridColumn: "half",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter phone number",
    required: true,
    validation: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[\d\s\-+()]+$/, "Please enter a valid phone number"),
    gridColumn: "half",
  },
];

// Generate Zod schema dynamically from field config
export const generateUserSchema = () => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  
  userFieldsConfig.forEach((field) => {
    if (field.validation) {
      schemaShape[field.name] = field.validation;
    } else if (field.required) {
      schemaShape[field.name] = z.string().min(1, `${field.label} is required`);
    } else {
      schemaShape[field.name] = z.string().optional();
    }
  });
  
  return z.object(schemaShape);
};

export const userSchema = generateUserSchema();
export type UserFormData = z.infer<typeof userSchema>;

// User type with ID for database operations
export interface User extends UserFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Generate default values for form
export const getDefaultFormValues = (): Partial<UserFormData> => {
  const defaults: Record<string, string> = {};
  userFieldsConfig.forEach((field) => {
    defaults[field.name] = "";
  });
  return defaults;
};
