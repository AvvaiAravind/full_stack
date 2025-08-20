import { zodResolver } from "@hookform/resolvers/zod";
import InputFieldComponent from "@src/components/custom/InputFiled";
import { Button } from "@src/components/ui/button";
import { Form } from "@src/components/ui/form";
import api from "@src/lib/axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  username: z.email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(15, "Password must be at most 15 characters"),
});

type LoginFormType = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: LoginFormType) => {
    try {
      const response = await api.post("/api/auth/login", data);
      console.log(response);
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error: any) {
      // Handle different error types
      if (error.response?.status === 400) {
        // Show the specific backend error message
        toast.error(error.response.data.message);
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Login failed. Please check your connection.");
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 place-content-center gap-4 rounded-md border p-8 shadow-md"
        >
          <InputFieldComponent
            control={form.control}
            type="email"
            name="username"
            label="Username"
            autoFocus={true}
            autoComplete="on"
            placeholder="Enter your username"
            description="username must be a valid email"
            className={{
              itemClass: "col-span-2",
            }}
          />
          <InputFieldComponent
            control={form.control}
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            className={{
              itemClass: "col-span-2",
            }}
          />
          <Button
            className="col-span-1 cursor-pointer border-black hover:bg-gray-100"
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Clear
          </Button>
          <Button
            className="col-span-1 cursor-pointer hover:bg-gray-100 hover:text-gray-800"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
