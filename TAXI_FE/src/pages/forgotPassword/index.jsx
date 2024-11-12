import React, { useState } from "react";
import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input } from "antd";
import { getAuth, signInWithPopup } from "firebase/auth";
import { googleProvider } from "../../config/firebase";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axiox";
import { toast } from "react-toastify";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await api.post("auth/forgotPassword", { email });
      setMessage(response.data);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <AuthenTemplate>
      <Form
        labelCol={{
          span: 24,
        }}
        onFinish={handleSubmit}
      >
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-24 mx-auto" />
        </div>

        <Form.Item
          label="Username or Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email",
            },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Please enter a valid email address",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <div className="auth-links">
          <Link to="/register" className="register-link">
            Register new account
          </Link>
          <Link to="/login" className="login-link">
            Login
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
            Submit
          </Button>
        </div>
      </Form>
    </AuthenTemplate>
  );
}

export default ForgotPasswordPage;
