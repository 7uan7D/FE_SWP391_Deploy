import React, { useEffect, useState } from "react";
import { Container, Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import api from "../../config/axiox";
import {jwtDecode} from "jwt-decode";
import './index.css'; 

const Conversation = () => {
  const [userId, setUserId] = useState(null);
  const [conversations, setConversations] = useState([]);

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
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!userId) {
        console.log("Missing userId", { userId });
        return;
      }

      try {
        const response = await api.get(`/messages/conversations`, {
          params: { userId: userId },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data && response.data.status && response.data.data) {
          const uniqueMessages = Array.from(new Set(response.data.data.map(msg => msg.id)))
            .map(id => response.data.data.find(msg => msg.id === id));
          setConversations(uniqueMessages);
        } else {
          console.log("No conversation data found in API response.");
          setConversations([]);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error.response ? error.response.data : error);
      }
    };

    fetchConversations();
  }, [userId]);

  return (
    <div className="conversation-bg">
    <Container className="container">
      <Box sx={{ my: 4, p: 3, bgcolor: '#f9f9f9', borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h4" className="title" color="#000000">Conversations</Typography>
        {conversations.length === 0 ? (
          <Typography>No conversations found.</Typography>
        ) : (
          <List>
            {conversations.map((msg, index) => (
              <ListItem key={index} className="list-item">
                <ListItemText
                  primary={`${msg.senderFullName || 'Unknown'}: ${msg.content || 'No content'}`}
                  secondary={
                    <Typography variant="body2" className="secondary">
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : "No timestamp"}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
    </div>
  );
};

export default Conversation;
