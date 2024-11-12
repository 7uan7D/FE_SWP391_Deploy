import React, { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Container,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../../config/axiox";

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.sub ? Number(decoded.sub) : null;

        if (userId) {
          const response = await api.get(`/user/getUserById/${userId}`);
          setUser(response.data.data);
          setFormData(response.data.data);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTopUp = () => {
    navigate("/topup", { state: { userId: user.userId } });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Create the payload in the expected format
      const payload = {
        userDTO: {
          fullName: formData.fullName || user.fullName,
          email: formData.email || user.email,
          password: formData.password || user.password,
          role: formData.role || user.role,
          status: formData.status || user.status,
        },
      };

      // Update user API call
      const response = await api.put(
        `/user/updateUser/${user.userId}`,
        payload
      );

      // Handle success
      toast.success("Profile updated successfully");
      setUser(response.data.data);
      setEditMode(false);
      fetchUserProfile();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (editMode) {
      handleSave(); // Save the data when clicking "Save"
    } else {
      setEditMode(true); // Enable edit mode
    }
  };

  const formatBalance = (balance) => {
    return balance % 1 === 0 ? balance : balance.toFixed(2);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div
    className="creride-bg"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh", 
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
    >
      <Container maxWidth="md" style={{ marginTop: "50px" }}>
        <Box
          padding={2}
          borderRadius={2}
          boxShadow={3}
          bgcolor="#fff"
          width="100%"
        >
        <Box display="flex" alignItems="center" marginBottom="20px">
          <Avatar
            alt={user.fullName || "User Avatar"}
            src="/static/images/avatar/1.jpg"
            sx={{ width: 100, height: 100, marginRight: "20px" }}
          />
          <Box>
            <Typography variant="h5">{user.fullName || "N/A"}</Typography>
            <Typography color="textSecondary">{user.email || "N/A"}</Typography>
          </Box>
          <Box flexGrow={1} />
          <Button variant="contained" color="primary" onClick={handleEditClick}>
            {editMode ? "Save" : "Edit"}
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleInputChange}
              variant="outlined"
              disabled={!editMode}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              variant="outlined"
              disabled={!editMode}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password || ""}
              onChange={handleInputChange}
              variant="outlined"
              disabled={!editMode} // Keep disabled unless allowing password editing
            />
          </Grid>
        </Grid>

        <Box marginTop="40px">
          <Typography variant="h6">My Email Address</Typography>
          <Box display="flex" alignItems="center" marginTop="10px">
            <Avatar
              alt={user.fullName || "User Avatar"}
              src="/static/images/avatar/1.jpg"
              sx={{ width: 40, height: 40, marginRight: "10px" }}
            />
            <Box>
              <Typography>{user.email || "N/A"}</Typography>
            </Box>
          </Box>
          <Box marginTop="20px">
            <Typography variant="h6">Balance</Typography>
            <Typography variant="body1">
              {user.balance ? formatBalance(user.balance) : "0"} VND
              <Button
                variant="contained"
                color="primary"
                onClick={handleTopUp}
                style={{ marginLeft: "20px" }}
              >
                Top Up
              </Button>
            </Typography>
          </Box>
        </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Profile;
