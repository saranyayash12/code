import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const AboutRealtime = () => {
  const [time, setTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Typography component="div" color="white" mt={2}>
      Current time: {time.toLocaleTimeString()}<br/>
      Fun fact: The world's most expensive watch ever sold is the Patek Philippe Grandmaster Chime for $31 million!
    </Typography>
  );
};

const About = () => (
  <Box 
    id="about" 
    sx={{ 
      py: 10, 
      background: 'rgba(35,37,38,0.9)', 
      position: 'relative', 
      overflow: 'hidden', 
      minHeight: '80vh', 
      width: '100%', // Changed from 100vw to 100% to prevent horizontal scroll issues
      display: 'flex', 
      alignItems: 'center' 
    }}
  >
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'url(https://wallpapercave.com/wp/wp12480347.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.20,
      zIndex: 0,
    }} />
    <Container 
      maxWidth="md" 
      sx={{ 
        position: 'relative', 
        zIndex: 1, 
        width: '100%', // Changed from 100vw to match parent
        px: 3 // Added horizontal padding for better mobile responsiveness
      }}
    >
      <Typography variant="h3" fontWeight="bold" color="white" gutterBottom>
        About Us
      </Typography>
      <Typography color="white" paragraph>
        We are passionate about bringing you the finest timepieces from around the world. 
        Our mission is to blend tradition with innovation for every customer.
      </Typography>
      <AboutRealtime />
    </Container>
  </Box>
);

export default About;