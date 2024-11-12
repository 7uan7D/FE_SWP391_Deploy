import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent, Button, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import api from "../../config/axiox";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refundReason, setRefundReason] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.sub;
          setUserId(userId);

          const userRidesResponse = await api.get(`/rides/user/${userId}`);
          const userRides = userRidesResponse.data;

          const allRidesResponse = await api.get("/rides/getAll");
          const allRides = allRidesResponse.data;

          const enrichedRides = userRides.map((userRide) => {
            const rideDetails = allRides.find((ride) => ride.rideId === userRide.rideId);
            return {
              ...userRide,
              ...rideDetails,
            };
          });

          const sortedRides = enrichedRides.sort((a, b) => new Date(b.rideDate) - new Date(a.rideDate));
          setRides(sortedRides);
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRides();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFeedbackClick = (rideId, status) => {
    if (status === "COMPLETED" || status === "PROBLEM") {
      const width = 1280;
      const height = 720;
      const left = (window.innerWidth / 2) - (width / 2);
      const top = (window.innerHeight / 2) - (height / 2);
      window.open(`/feedback/${rideId}`, "_blank", `width=${width},height=${height},top=${top},left=${left}`);
    } else {
      toast.warning("You can only provide feedback for COMPLETED rides.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleRefundRequest = async () => {
    if (!refundReason.trim()) {
      toast.error("Please provide a reason for the refund request.");
      return;
    }
    try {
      await api.post(
        `rides/ride/${selectedRide.rideId}/refund-request`,
        refundReason,
        {
          params: {
            studentId: userId,
          },
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );
      toast.success("Refund request sent successfully.");
    } catch (error) {
console.error("Error sending refund request:", error);
      toast.error("Error sending refund request.");
    }
  };

  const filteredRides = rides.filter((ride) => {
    return (
      ride.rideCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.startLocationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.endLocationName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleRideSelect = (ride) => {
    setSelectedRide(ride);
    setRefundReason("");
  };

  return (
    <>
      <div className="my-rides-bg">
        <div className="overlay"></div>
        <ToastContainer />
        <Container maxWidth="lg" className="my-rides-container">
          <Typography variant="h5" align="center" gutterBottom>My Rides</Typography>
          <div className="search-bar">
            <TextField 
              variant="outlined" 
              fullWidth 
              placeholder="Search rides..." 
              value={searchTerm} 
              onChange={handleSearch} 
            />
          </div>
          <div className="main-content">
            <div className="ride-list-section">
              <div className="rides-grid">
                {filteredRides.map((ride) => (
                  <Card key={ride.rideId} className="ride-card" onClick={() => handleRideSelect(ride)}>
                    <CardContent>
                      <Typography variant="h6">{ride.rideCode}</Typography>
                      <Typography variant="body2">Start: {ride.startLocationName}</Typography>
                      <Typography variant="body2">End: {ride.endLocationName}</Typography>
                      <Typography variant="body2">Date: {new Date(ride.rideDate).toLocaleDateString()}</Typography>
                      <Typography variant="body2">Status: {ride.status}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="ride-details-section">
              {selectedRide ? (
                <>
                  <Typography variant="h5" gutterBottom>Ride Details</Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">Ride Code: {selectedRide.rideCode}</Typography>
                      <Typography variant="body2">Start Location: {selectedRide.startLocationName}</Typography>
                      <Typography variant="body2">End Location: {selectedRide.endLocationName}</Typography>
                      <Typography variant="body2">Start Time: {new Date(selectedRide.startTime).toLocaleTimeString()}</Typography>
                      <Typography variant="body2">End Time: {new Date(selectedRide.endTime).toLocaleTimeString()}</Typography>
                      <Typography variant="body2">Date: {new Date(selectedRide.rideDate).toLocaleDateString()}</Typography>
<Typography variant="body2">Capacity: {selectedRide.capacity}</Typography>
                      <Typography variant="body2">Status: {selectedRide.status}</Typography>
                      <Typography variant="body2">Price: ${selectedRide.price.toFixed(2)}</Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleFeedbackClick(selectedRide.rideId, selectedRide.status)}
                      >
                        Provide Feedback
                      </Button>
                      {(selectedRide.status === "COMPLETED" || selectedRide.status === "PROBLEM") && (
  <>
    <TextField
      label="Refund Reason"
      variant="outlined"
      fullWidth
      margin="normal"
      value={refundReason}
      onChange={(e) => setRefundReason(e.target.value)}
    />
    <Button
      variant="contained"
      color="secondary"
      fullWidth
      onClick={handleRefundRequest}
    >
      Request Refund
    </Button>
  </>
)}

                    </CardContent>
                  </Card>
                </>
              ) : (
                <Typography>Select a ride to view details</Typography>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default MyRides;