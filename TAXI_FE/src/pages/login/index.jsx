import React from "react";
import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input } from "antd";
import { getAuth, signInWithPopup } from "firebase/auth";
import { googleProvider } from "../../config/firebase";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axiox";
import { toast } from "react-toastify";
import "./index.css";

function LoginPage() {
  const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng

  const handleLoginGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  const handleLogin = async (values) => {
    try {
      const response = await api.post("/auth/signIn", values);
      console.log(response);
      const { role, accessToken, username } = response.data;
      localStorage.setItem("token", accessToken); // Lưu JWT token vào localStorage
      localStorage.setItem("role", role); // Lưu role vào localStorage
      localStorage.setItem("username", username); // Lưu username vào localStorage

      // Điều hướng về trang HomePage sau khi đăng nhập thành công
      if (role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Login failed");
    }
  };

  return (
    <AuthenTemplate>
      <Form
        labelCol={{
          span: 24,
        }}
        onFinish={handleLogin}
      >
        <div className="text-center mb-6">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="w-24 mx-auto" />
          </Link>
        </div>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input user's email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input password",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <div className="auth-links">
          <Link to="/register" className="register-link">
            Register new account
          </Link>
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password
          </Link>
        </div>

        <div
          className="flex gap-4 mt-4"
          style={{ justifyContent: "space-between" }}
        >
          <Button
            type="primary"
            htmlType="submit"
            className="login-button"
            style={{ marginRight: "16px" }}
          >
            Login
          </Button>
          <Button onClick={handleLoginGoogle} className="login-google-button">
            Login by Google
          </Button>
        </div>
      </Form>
    </AuthenTemplate>
  );
}

export default LoginPage;
