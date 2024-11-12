import React, { useEffect, useState } from "react";
import api from "../../config/axiox"; // Ensure this points to your axios config
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
  Box,
} from "@mui/material";
import "./index.css";

const ModerateFeedback = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints/getAll");
        setComplaints(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const getStaffIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.sub ? Number(decoded.sub) : null;
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    return null;
  };

  const handleStatusChange = async () => {
    if (!selectedComplaint || !newStatus) {
      alert("Please select a complaint and enter a new status.");
      return;
    }

    const staffId = getStaffIdFromToken();

    try {
      await api.put(
        `/complaints/${selectedComplaint.complaintId}/status`,
        null,
        {
          params: {
            status: newStatus,
            staffId,
          },
        }
      );

      alert("Complaint status updated successfully.");
      setNewStatus("");
      setSelectedComplaint(null);
      const response = await api.get("/complaints/getAll");
      setComplaints(response.data);
    } catch (error) {
      console.error("Error updating complaint status:", error);
      alert("Failed to update complaint status.");
    }
  };

  const handleDeleteComplaint = async () => {
    if (!selectedComplaint) {
      alert("Please select a complaint to delete.");
      return;
    }

    try {
      await api.delete(`/complaints/delete/${selectedComplaint.complaintId}`);
      alert("Complaint deleted successfully.");
      setSelectedComplaint(null);
      const response = await api.get("/complaints/getAll");
      setComplaints(response.data);
    } catch (error) {
      console.error("Error deleting complaint:", error);
      alert("Failed to delete complaint.");
    }
  };

  return (
    <div className="creride-bg">
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
            Moderate Feedback
          </Typography>
          {loading ? (
            <Typography variant="h6" align="center">
              Loading complaints...
            </Typography>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">All Complaints</Typography>
                {complaints.map((complaint) => (
                  <Card
                    key={complaint.complaintId}
                    onClick={() => setSelectedComplaint(complaint)}
                    style={{
                      cursor: "pointer",
                      marginBottom: "10px",
                      boxShadow:
                        selectedComplaint?.complaintId == complaint.complaintId
                          ? "0 0 10px rgba(0,0,0,0.5)"
                          : "none",
                      backgroundColor:
                        selectedComplaint?.complaintId == complaint.complaintId
                          ? "#f0f8ff"
                          : complaint.status == "ACTIVE"
                          ? "#d4edda" 
                          : complaint.status == "INACTIVE"
                          ? "#fff3cd" 
                          : "#fff",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">
                        Description: {complaint.description}
                      </Typography>
                      <Typography variant="body2">
                        Status: {complaint.status}
                      </Typography>
                      <Typography variant="body2">
                        User: {complaint.fullName}
                      </Typography>
                      <Typography variant="body2">
                        Submitted At:{" "}
                        {new Date(complaint.submittedDate).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>

              {selectedComplaint && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Complaint Details</Typography>
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="body1">
                        <strong>Description:</strong>{" "}
                        {selectedComplaint.description}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Status:</strong> {selectedComplaint.status}
                      </Typography>
                      <Typography variant="body1">
                        <strong>User:</strong> {selectedComplaint.fullName}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Submitted At:</strong>{" "}
                        {new Date(
                          selectedComplaint.submittedDate
                        ).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Typography variant="h6">Update Complaint Status</Typography>
                  <Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                  >
                    <MenuItem value="ACTIVE">Resolved</MenuItem>
                    <MenuItem value="INACTIVE">Unresolved</MenuItem>
                  </Select>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStatusChange}
                    style={{ marginBottom: "20px" }}
                  >
                    Update Status
                  </Button>

                  <Typography variant="h6">Delete Complaint</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDeleteComplaint}
                  >
                    Delete Complaint
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

export default ModerateFeedback;
