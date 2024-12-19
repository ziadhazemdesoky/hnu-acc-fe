import React from "react";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../utils/api";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { login } = useAuth();

  const handleLogin = async (username, password) => {
    try {
      const data = await loginUser({ username, password });
      if (data.token) {
        login(data.token);
        toast.success("تم تسجيل الدخول بنجاح!");
      } else {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيح.");
      }
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول.");
      console.error(error);
    }
  };

  return <LoginForm onLogin={handleLogin} />;
};

export default LoginPage;
