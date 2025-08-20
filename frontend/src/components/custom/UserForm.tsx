/**
 * User form component - reusable modal form for creating and editing users
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import InputFieldComponent from "./InputFiled";

// User input type definition
export type UserInput = {
  username: string;
  roles: "super-admin" | "admin" | "user";
  native: string;
  password?: string;
};

// Component props interface
type UserFormProps = {
  user?: UserInput; // Optional user data for editing mode
  onSubmit: (data: UserInput) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
};

// Form validation schema
const userSchema = z.object({
  username: z.email("Invalid email format"),
  roles: z.enum(["super-admin", "admin", "user"]),
  native: z.string().min(2, "Native must be at least 2 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(15, "Password must be at most 15 characters")
    .optional()
    .or(z.literal("")), // Allow empty string for optional password
});

type UserFormType = z.infer<typeof userSchema>;

const UserForm = ({
  user,
  onSubmit,
  isLoading,
  isOpen,
  onClose,
}: UserFormProps) => {
  // Form setup with validation and default values
  const form = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username ?? "",
      roles: user?.roles ?? "user",
      native: user?.native ?? "",
      password: user?.password ?? "",
    },
  });

  return (
    <>
      {/* Modal backdrop - click to close */}
      <div
        className="bg-opacity-90 fixed inset-0 bg-gray-100/90 transition-opacity"
        onClick={onClose}
      />

      {/* Modal dialog */}
      <dialog
        className="inset-0 m-auto w-xs max-w-md rounded border p-4 text-black shadow-md"
        open={isOpen}
        onClose={onClose}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Form</h1>
          <Button variant="outline" onClick={onClose}>
            <X />
          </Button>
        </div>

        {/* Form content */}
        <Form {...form}>
          <form
            className="grid grid-cols-2 gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Username field */}
            <InputFieldComponent
              type="email"
              control={form.control}
              name="username"
              label="Username"
              className={{
                itemClass: "col-span-2",
              }}
            />

            {/* Role selection dropdown */}
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel htmlFor="roles" className="">
                    Roles
                  </FormLabel>
                  <Select
                    aria-describedby="roles-error"
                    aria-required="false"
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="w-full border-neutral-700 hover:cursor-pointer"
                        id="roles"
                      >
                        <SelectValue placeholder="Roles" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="z-20 border-neutral-700 bg-white text-black"
                      position="popper"
                    >
                      {["super-admin", "admin", "user"].map((option) => (
                        <SelectItem
                          className="hover:cursor-pointer"
                          key={option}
                          value={option}
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage id="roles-error" />
                </FormItem>
              )}
            />

            {/* Native language field */}
            <InputFieldComponent
              type="text"
              control={form.control}
              name="native"
              label="Native"
              className={{
                itemClass: "col-span-2",
              }}
            />

            {/* Password field (optional for editing) */}
            <InputFieldComponent
              type="text"
              control={form.control}
              name="password"
              label="Password"
              className={{
                itemClass: "col-span-2",
              }}
            />

            {/* Submit button */}
            <Button
              className="col-span-2 cursor-pointer border-black"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </form>
        </Form>
      </dialog>
    </>
  );
};

export default UserForm;
