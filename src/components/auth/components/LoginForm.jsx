import { useState } from "react";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import AuthLayout from "../../../layouts/AuthLayout";

const LoginForm = ({ onSubmit, onForgotPassword, isLoading, error }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!credentials.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!credentials.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(credentials);
    }
  };

  return (
    <AuthLayout icon={FiUser}>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-md md:text-2xl font-semibold text-gray-900 mb-6 font-sans">
          Sign in to Linkprosoft
        </h2>
      </div>

      <form onSubmit={handleSignIn} className="flex flex-col gap-4 w-full">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter mail"
          value={credentials.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
          leftIcon={FiMail}
          required
        />

        <div className="w-full flex flex-col">
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter Password"
            value={credentials.password}
            onChange={handleChange}
            error={errors.password || error}
            disabled={isLoading}
            leftIcon={FiLock}
            required
          />
          <button
            type="button"
            onClick={onForgotPassword}
            disabled={isLoading}
            className="text-gray-400 hover:text-[#016EA6] text-sm mt-2 text-left block w-fit select-none cursor-pointer hover:bg-transparent outline-none border-none p-0"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full! bg-[#016EA6]! hover:bg-[#016EA6]/95! py-3.5 text-base shadow-sm font-medium tracking-wide mt-4"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-center md:text-left text-gray-500 text-sm mt-6">
        Don&apos;t have an Account?{" "}
        <a href="/signup" className="text-[#016EA6] font-medium hover:underline">
          Sign up
        </a>
      </p>
    </AuthLayout>
  );
};

export default LoginForm;