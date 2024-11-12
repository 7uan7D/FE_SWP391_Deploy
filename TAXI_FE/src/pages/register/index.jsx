import React from "react";
import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axiox"; // Ensure this path is correct
import { toast } from "react-toastify";

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      values.role = "STUDENT"; 
      const response = await api.post("user/registerNewUser", values);
      toast.success("Successfully registered new account");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Email already exists") {
          toast.error("This email is already registered. Please use a different email.");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <AuthenTemplate>
      <Form
        labelCol={{
          span: 24,
        }}
        onFinish={handleRegister}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
            {
              validator: async (_, value) => {
                if (value) {
                  try {
                    const response = await api.get(`user/check-email/${value}`);
                    if (response.data.exists) {
                      return Promise.reject("This email is already registered.");
                    }
                  } catch (error) {
                    return Promise.reject("Error checking email.");
                  }
                }
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 8, message: "Password must be at least 8 characters long!" },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              message: "Password must contain both letters and numbers!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[
            { required: true, message: "Please input your full name!" },
            {
              pattern: /^[a-zA-Z\s]+$/,
              message: "Full name can only contain letters and spaces!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <div
          className="flex gap-4 mt-4"
          style={{ justifyContent: "space-between" }}
        >
          <Link to="/login" style={{ marginRight: "16px" }}>
            Already have an account? Go to Login Page
          </Link>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </div>
      </Form>
    </AuthenTemplate>
  );
}

export default RegisterPage;
