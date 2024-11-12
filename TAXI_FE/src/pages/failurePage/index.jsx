import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FailurePage = () => {
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
                <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1.8rem', md: '2.125rem' } }}
                >
                    Thanh toán thất bại!
                </Typography>
                <Typography 
                    variant="body1" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                    Giao dịch của bạn không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleReturnHome}
                    sx={{
                        mt: 3,
                        p: { xs: 1, md: 1.5 },
                        width: { xs: '100%', sm: 'auto' },
                    }}
                >
                    Quay lại trang chủ
                </Button>
            </Container>
            
        </Box>
    );
};

export default FailurePage;
