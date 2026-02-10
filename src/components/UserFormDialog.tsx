import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DynamicFormField } from "./DynamicFormField";
import {
  userFieldsConfig,
  userSchema,
  UserFormData,
  User,
  getDefaultFormValues,
} from "@/config/userSchema";
import { Loader2 } from "lucide-react";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormData) => void;
  user?: User | null;
  isLoading?: boolean;
}

export const UserFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  user,
  isLoading = false,
}: UserFormDialogProps) => {
  const isEditing = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: getDefaultFormValues(),
  });

  // Reset form when dialog opens/closes or user changes
  useEffect(() => {
    if (open) {
      if (user) {
        // Populate form with user data for editing
        const userData: Record<string, string> = {};
        userFieldsConfig.forEach((field) => {
          userData[field.name] = (user as any)[field.name] || "";
        });
        form.reset(userData);
      } else {
        form.reset(getDefaultFormValues());
      }
    }
  }, [open, user, form]);

  const handleSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  // Group fields by grid column for layout
  const renderFormFields = () => {
    const fields: JSX.Element[] = [];
    let i = 0;

    while (i < userFieldsConfig.length) {
      const currentField = userFieldsConfig[i];
      const nextField = userFieldsConfig[i + 1];

      if (currentField.gridColumn === "half" && nextField?.gridColumn === "half") {
        // Render two fields side by side
        fields.push(
          <div key={`row-${i}`} className="grid grid-cols-2 gap-4">
            <DynamicFormField fieldConfig={currentField} form={form} />
            <DynamicFormField fieldConfig={nextField} form={form} />
          </div>
        );
        i += 2;
      } else {
        // Render single field full width
        fields.push(
          <div key={`field-${i}`}>
            <DynamicFormField fieldConfig={currentField} form={form} />
          </div>
        );
        i += 1;
      }
    }

    return fields;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] card-shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the user information below."
              : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {renderFormFields()}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
