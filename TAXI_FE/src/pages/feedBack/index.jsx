import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Rating, Box } from "@mui/material";
import api from "../../config/axiox";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../../components/Navbars";

const Feedback = () => {
  const { rideId } = useParams();
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(3);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.sub;

        const response = await api.get(`/complaints/${rideId}/user/${userId}`);
        if (response.data) {
          setExistingFeedback(response.data); 
          setDescription(response.data.description); 
          setRating(response.data.rating);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, [rideId]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.sub;

      const feedbackData = {
        description,
        rating,
        userId,
        rideId
      };

      if (existingFeedback) {
        await api.put(`/complaints/updateByUser/${existingFeedback.complaintId}`, feedbackData);
      } else {
        await api.post("/complaints/add", feedbackData);
      }

      navigate("/my-rides"); 
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <>
      
      <Container maxWidth="sm" style={{ paddingTop: '80px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          {existingFeedback ? "Update Feedback" : "Submit Feedback"}
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Typography component="legend">Rating</Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ mt: 3 }}
          >
            {existingFeedback ? "Update Feedback" : "Submit Feedback"}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Feedback;
