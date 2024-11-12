import React, { useState, useEffect } from "react";
import api from "../../config/axiox";
import { jwtDecode } from "jwt-decode";
import { Container, Typography, Button, TextField, Box } from "@mui/material";

const TopUp = () => {
  const [amount, setAmount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [walletId, setWalletId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.sub) {
          const id = Number(decoded.sub);
          setUserId(id);
          fetchWalletId(id);
        } else {
          console.error("Token does not contain user ID.");
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const fetchWalletId = async (userId) => {
    try {
      const response = await api.get(`/wallet/${userId}/id`);
      if (response.data && response.data.walletId) {
        setWalletId(response.data.walletId);
      } else {
        console.error("Failed to retrieve wallet ID.");
      }
    } catch (error) {
      console.error("Error fetching wallet ID:", error);
    }
  };

  const handleTopUp = async () => {
    if (userId && walletId && amount > 0) {
      try {
        const transactionPayload = {
          userId: userId,
          walletId: walletId,
          amount: amount,
        };

        const response = await api.post(
          "/wallet/topup/vnpay",
          transactionPayload
        );
        console.log(response.data);

        if (response.data && response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          alert("Failed to retrieve payment URL. Please try again later.");
        }
      } catch (error) {
        console.error("Error during top-up:", error);
        alert("Failed to initiate top-up. Please try again later.");
      }
    } else {
      alert(
        "User ID, Wallet ID, or amount is invalid. Please log in and enter a valid amount."
      );
    }
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
    <Container maxWidth="sm" style={{ marginTop: "80px" }}>
      <Box
        padding={2}
        borderRadius={2}
        boxShadow={3}
        bgcolor="#fff"
        width="100%"
      >
        <Typography variant="h4" align="center" gutterBottom>
          Top Up Wallet
        </Typography>
        <TextField
          label="Amount (VND)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          required
          inputProps={{ min: 1 }}
        />
        <Button
          onClick={handleTopUp}
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "20px" }}
        >
          Proceed to Payment
        </Button>
      </Box>
    </Container>
    </div>
  );
};

export default TopUp;
