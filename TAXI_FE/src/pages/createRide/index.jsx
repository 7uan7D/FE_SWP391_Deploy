import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import api from "../../config/axiox";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import "./index.css";

const CreateRide = () => {
  const [rideCode, setRideCode] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [rideDate, setRideDate] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [startLocationId, setStartLocationId] = useState(null);
  const [endLocationId, setEndLocationId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [userId, setUserId] = useState(null);

  const perSeatPrice = 15000;
  const navigate = useNavigate();

  // Filter locations for Start and End dropdowns
  const filteredStartLocations = locations.filter(
    (location) => location.locationId !== endLocationId
  );
  const filteredEndLocations = locations.filter(
    (location) => location.locationId !== startLocationId
  );

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/locations/getAll");
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();

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
    setTotalPrice(perSeatPrice * capacity);
  }, [capacity]);

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);

    const startDate = new Date(newStartTime);
    const localStartDate = new Date(startDate.getTime() + 7 * 60 * 60 * 1000);
    const endDate = new Date(localStartDate);
    endDate.setMinutes(endDate.getMinutes() + 15);

    setEndTime(endDate.toISOString().slice(0, 16));
    setRideDate(localStartDate.toISOString().slice(0, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === "ONLINE") {
      try {
        const response = await api.get(`/user/getUserById/${userId}`);
        if (response.data && response.data.success) {
          const walletBalance = response.data.data.balance;
          if (walletBalance < totalPrice) {
            toast.error("Insufficient balance in wallet. Please add funds.");
            return;
          }
        } else {
          toast.error("Error fetching user details.");
return;
        }
      } catch (error) {
        toast.error("Error fetching user details.");
        console.error("Error fetching user details:", error);
        return;
      }
    }

    const payload = {
      rideCode,
      startTime,
      endTime,
      rideDate,
      capacity,
      price: totalPrice,
      paymentMethod,
      startLocationId,
      endLocationId,
      userId: userId !== null ? userId : null,
    };

    try {
      const response = await api.post("/rides/add", payload);
      toast.success("Ride created successfully!");

      setTimeout(() => {
        navigate("/my-rides");
      }, 3000);

      setRideCode("");
      setStartTime("");
      setEndTime("");
      setRideDate("");
      setCapacity(1);
      setTotalPrice(0);
      setPaymentMethod("CASH");
      setStartLocationId(null);
      setEndLocationId(null);
    } catch (error) {
      toast.error("Failed to create ride.");
      console.error("Error creating ride:", error.response ? error.response.data : error);
    }
  };

  const isFormValid = () => {
    return (
      rideCode &&
      startTime &&
      endTime &&
      rideDate &&
      capacity > 0 &&
      totalPrice > 0 &&
      startLocationId &&
      endLocationId
    );
  };

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
      <Container maxWidth="sm">
        <Box padding={2} borderRadius={2} boxShadow={3} bgcolor="#fff" width="100%">
          <Typography variant="h4" align="center" gutterBottom>
            Create a New Ride
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Ride Code"
                  value={rideCode}
                  onChange={(e) => setRideCode(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Start Time"
                  type="datetime-local"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="End Time"
                  type="datetime-local"
                  value={endTime}
                  disabled
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
label="Ride Date"
                  type="date"
                  value={rideDate}
                  disabled
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Capacity"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Total Price (VND)"
                  type="number"
                  value={totalPrice}
                  disabled
                  fullWidth
                  required
                />
                <Typography variant="caption" sx={{ color: "red" }}>
                  Default price: 15000 VND per seat. <br />
                  Service fee does not include parking fees.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="CASH">Cash on Delivery</MenuItem>
                    <MenuItem value="ONLINE">Online Payment</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={filteredStartLocations}
                  getOptionLabel={(option) => option.locationName}
                  onChange={(event, newValue) =>
                    setStartLocationId(newValue ? newValue.locationId : null)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select Start Location" required />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={filteredEndLocations}
                  getOptionLabel={(option) => option.locationName}
                  onChange={(event, newValue) =>
                    setEndLocationId(newValue ? newValue.locationId : null)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select End Location" required />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!isFormValid()}
                  sx={{ mt: 2 }}
>
                  Create Ride
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default CreateRide;