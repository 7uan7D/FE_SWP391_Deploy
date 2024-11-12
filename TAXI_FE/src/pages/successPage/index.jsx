import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Container 
                component="main" 
                maxWidth="sm" 
                sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: { xs: 5, md: 10 },
                    p: { xs: 2, md: 4 },
                    textAlign: 'center',
                }}
            >
            <Typography variant="h4" gutterBottom>
                Thanh toán thành công!
            </Typography>
            <Typography variant="body1" gutterBottom>
                Cảm ơn bạn đã hoàn tất giao dịch.
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleReturnHome} 
                style={{ marginTop: '20px' }}
            >
                Quay lại trang chủ
            </Button>
        </Container>
        </Box>
    );
};

export default SuccessPage;
