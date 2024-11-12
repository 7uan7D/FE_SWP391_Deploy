import React, { useEffect, useState } from "react";
import api from "../../config/axiox";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import "./index.css";

const ModerateRide = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await api.get("/rides/getAll");
        setRides(response.data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();

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

  const handleStatusChange = async () => {
    if (!selectedRide || !newStatus) {
      alert("Please select a ride and enter a new status.");
      return;
    }

    try {
      if (newStatus === "ACTIVE") {
        await api.put(`/rides/${selectedRide.rideId}/approve`, null, {
          params: {
            staffId: userId !== null ? userId : null,
          },
        });
      } else {
        await api.put(`/rides/${selectedRide.rideId}/status`, null, {
          params: {
            status: newStatus,
            staffId: userId !== null ? userId : null,
          },
        });
      }

      alert("Ride status updated successfully.");
      setNewStatus("");
      setSelectedRide(null);
      const response = await api.get("/rides/getAll");
      setRides(response.data);
    } catch (error) {
      console.error("Error updating ride status:", error);
      alert("Failed to update ride status.");
    }
  };

  const handleCancelRide = async () => {
    if (!selectedRide || !reason) {
      alert("Please select a ride and enter a cancellation reason.");
      return;
    }

    try {
      await api.put(`/rides/${selectedRide.rideId}/cancel`, null, {
        params: {
          staffId: userId !== null ? userId : null,
          reason: reason,
        },
      });
      alert("Ride canceled successfully.");
      setReason("");
      setSelectedRide(null);
      const response = await api.get("/rides/getAll");
      setRides(response.data);
    } catch (error) {
      console.error("Error canceling ride:", error);
      alert("Failed to cancel ride.");
    }
  };

  return (
    <div
      className="creride-bg"
    >
      <Container
        maxWidth="lg"
        style={{ marginTop: "80px", paddingBottom: "50px" }}
      >
        <Box
          padding={2}
          borderRadius={2}
          boxShadow={3}
          bgcolor="#fff"
          width="100%"
        >
          <Typography variant="h4" align="center" gutterBottom>
            Moderate Rides
          </Typography>
          {loading ? (
            <Typography variant="h6" align="center">
              Loading rides...
            </Typography>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">All Rides</Typography>
                {rides.map((ride) => (
                  <Card
                    key={ride.rideId}
                    onClick={() => setSelectedRide(ride)}
                    style={{
                      cursor: "pointer",
                      marginBottom: "10px",
                      boxShadow:
                        selectedRide?.rideId === ride.rideId
                          ? "0 0 10px rgba(0,0,0,0.5)"
                          : "none",
                      backgroundColor:
                        selectedRide?.rideId == ride.rideId
                          ? "#f0f8ff"
                          : ride.status == "COMPLETED"
                          ? "#d4edda"
                          : ride.status == "ACTIVE"
                          ? "#fff9c4"
                          : ride.status == "INACTIVE"
                          ? "#ffe0b2"
                          : ride.status == "RIDING"
                          ? "#c8e6c9"
                          : ride.status == "PROBLEM"
                          ? "#ffcccb"
                          : "#fff",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{ride.rideCode}</Typography>
                      <Typography variant="body2">
                        Status: {ride.status}
                      </Typography>
                      <Typography variant="body2">
                        Start Location: {ride.startLocationName}
                      </Typography>
                      <Typography variant="body2">
                        End Location: {ride.endLocationName}
                      </Typography>
                      <Typography variant="body2">
                        Available Seats: {ride.availableSeats}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>

              {selectedRide && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Ride Details</Typography>
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="body1">
                        <strong>Ride Code:</strong> {selectedRide.rideCode}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Status:</strong> {selectedRide.status}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Start Location:</strong>{" "}
                        {selectedRide.startLocationName}
                      </Typography>
                      <Typography variant="body1">
                        <strong>End Location:</strong>{" "}
                        {selectedRide.endLocationName}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Start Time:</strong>{" "}
                        {new Date(selectedRide.startTime).toLocaleString()}
                      </Typography>
                      <Typography variant="body1">
                        <strong>End Time:</strong>{" "}
                        {new Date(selectedRide.endTime).toLocaleString()}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Capacity:</strong> {selectedRide.capacity}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Price:</strong> ${selectedRide.price.toFixed(2)}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Payment Method:</strong>{" "}
                        {selectedRide.paymentMethod}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Available Seats:</strong>{" "}
                        {selectedRide.availableSeats}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Organizer:</strong>{" "}
                        {selectedRide.organizerUsername}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Participants:</strong>{" "}
                        {selectedRide.participantUsernames.join(", ") ||
                          "No Participants"}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Typography variant="h6">Update Ride Status</Typography>
                  <Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                  >
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                    <MenuItem value="RIDING">Riding</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="PROBLEM">Problem</MenuItem>
                  </Select>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStatusChange}
                    style={{ marginBottom: "20px" }}
                  >
                    Update Status
                  </Button>

                  <Typography variant="h6">Cancel Ride</Typography>
                  <TextField
                    label="Reason for cancellation"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCancelRide}
                  >
                    Cancel Ride
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default ModerateRide;
