import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import api from "../../config/axiox";
import { jwtDecode } from "jwt-decode";
import "./index.css"; // Import the CSS file

const Chat = () => {
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [receiverId, setReceiverId] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.sub ? Number(decoded.sub) : null);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/getAllUsers");
        // Filter out the current user based on userId
        const filteredUsers = response.data.filter(user => user.userId !== userId);
        setUsers(filteredUsers); // Set filtered users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    
    fetchUsers();
  }, [userId]); // Add userId to the dependency array to refetch if it changes

  const handleSendMessage = async () => {
    if (!message || !userId || !receiverId) return;

    try {
      const response = await api.post("/messages/send", null, {
        params: {
          senderId: userId,
          receiverId: receiverId,
          content: message,
        },
      });
      console.log("Message sent successfully:", response.data);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error.response ? error.response.data : error);
    }
  };

  return (
    <div className="chat-bg">
      <div className="overlay">
    <Container maxWidth="sm">
      <Box sx={{ my: 4, p: 3, bgcolor: '#f9f9f9', borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Chat
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Receiver</InputLabel>
          <Select
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            required
          >
            {users.map((user) => (
              <MenuItem key={user.userId} value={user.userId}>
                {user.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage} fullWidth>
          Send
        </Button>
      </Box>
    </Container>
      </div>
    </div>
  );
};

export default Chat;
