import { useEffect, useImperativeHandle, useRef } from "react";
import Button from "./Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError, type AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .regex(/^\S*$/, "Username must not have whitespaces"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number"),
});

type FormFields = z.infer<typeof formSchema>;
interface Prop {
  handleAuthSubmit: (username: string, pwd: string) => Promise<AxiosResponse>;
  buttonLabel: string;
  isLoginForm: boolean;
}

function AuthForm({ handleAuthSubmit, buttonLabel, isLoginForm }: Prop) {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      username: "",
      password: "",
    },
    reValidateMode: isLoginForm ? "onSubmit" : "onChange",
    resolver: zodResolver(formSchema),
  });

  const usernameRef = useRef<HTMLInputElement | null>(null);

  const { ref: rhfUsernameRef, ...rhfUsernameRest } = register("username");
  useImperativeHandle(rhfUsernameRef, () => usernameRef.current);

  // to focus on input of username when first rendering the component
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const LOGIN_WRONG_CREDENTIALS = "Incorrect username or password";
  useEffect(() => {
    if (errors.username) {
      setError("root", {
        message: isLoginForm
          ? LOGIN_WRONG_CREDENTIALS
          : errors.username.message,
      });
    } else if (errors.password) {
      setError("root", {
        message: isLoginForm
          ? LOGIN_WRONG_CREDENTIALS
          : errors.password.message,
      });
    } else {
      clearErrors("root");
    }
  }, [errors.username, errors.password, setError, isLoginForm, clearErrors]);

  const onSubmit: SubmitHandler<FormFields> = async ({
    username,
    password,
  }: FormFields) => {
    try {
      const res = await handleAuthSubmit(username, password);
      clearErrors("root");
      console.log("Submitted successfully: ", res);
      localStorage.setItem("auth", JSON.stringify(res.data));
      setAuth(res.data);
      // redirect
      navigate("/dashboard");
    } catch (error: unknown) {
      console.log("Error: ", error);
      if (!isAxiosError(error)) {
        console.log("Not an axios error");
        return;
      }
      const status = error?.response?.status;
      const data = error?.response?.data;
      // Internal server error
      if (status === 500) {
        setError("root", {
          message: "Internal server error. Please try again later.",
        });
        return;
      }

      // User already exists (sign up)
      if (!isLoginForm && status === 409) {
        setError("root", { message: "User already exists." });
        return;
      }

      // Incorrect username or password (sign in)
      if (isLoginForm && status === 401) {
        setError("root", { message: LOGIN_WRONG_CREDENTIALS });
        return;
      }

      // Any other error from backend
      setError("root", {
        message: data?.message || "An error occurred. Please try again.",
      });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-amber-800 mb-1"
        >
          Username
        </label>
        <input
          {...rhfUsernameRest}
          type="text"
          id="username"
          required
          className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
          ref={usernameRef}
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-amber-800 mb-1"
        >
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Loading..." : buttonLabel}
      </Button>

      {errors.root && (
        <p className="text-sm text-red-600 mt-1">{errors.root.message}</p>
      )}
    </form>
  );
}

export default AuthForm;
