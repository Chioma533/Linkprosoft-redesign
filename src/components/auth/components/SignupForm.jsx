import { useState } from "react";
import { FiUser, FiMail, FiLock} from "react-icons/fi";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import AuthLayout from "../../../layouts/AuthLayout";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const SignupForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <AuthLayout>
      {/* Right Column: Signup form */}
        {/* Header Icon */}
        <div className="flex flex-col items-center justify-center">
        <h2 className="text-md md:text-2xl font-semibold text-gray-900 mb-6 font-sans">
          Sign up to Linkprosoft
        </h2>
        </div>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full">
          <Input
            label="Full Name"
            name="fullName"
            type="text"
            placeholder="Enter name"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            disabled={isLoading}
            leftIcon={FiUser}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter mail"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isLoading}
            leftIcon={FiMail}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            leftIcon={FiLock}
            required
          />
          {/* password strength checker */}
          <PasswordStrengthMeter password={formData.password} />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full! bg-[#016EA6]! hover:bg-[#016EA6]/95! py-3.5 text-base shadow-sm font-medium tracking-wide mt-2"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center md:text-left text-gray-500 text-sm mt-6">
          Already have an Account?{" "}
          <a href="/login" className="text-[#016EA6] font-medium hover:underline">
            Log in
          </a>
        </p>
    </AuthLayout>
  );
};

export default SignupForm;
