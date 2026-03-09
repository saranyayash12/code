import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

const Contact = () => (
  <Box id="contact" sx={{ py: 10, background: 'rgba(255, 255, 255, 0)', position: 'relative', overflow: 'hidden', minHeight: '80vh', width: '100vw', display: 'flex', alignItems: 'center' }}>
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'url(https://zimsonwatches.com/cdn/shop/articles/Rado_2.png?v=1715152502&width=1100?)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.60,
      zIndex: 0,
    }} />
    <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, width: '100vw' }}>
      <Typography variant="h3" fontWeight="bold" color="white" gutterBottom>Contact</Typography>
      <Typography color="white" mb={2}>For inquiries, please use the form below or contact us directly.</Typography>
      {/* Contact Form */}
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, background: 'rgba(35,37,38,0.7)', p: 4, borderRadius: 2 }}>
        <input type="text" placeholder="Your Name" style={{ padding: 12, borderRadius: 4, border: 'none', fontSize: 16 }} required />
        <input type="email" placeholder="Your Email" style={{ padding: 12, borderRadius: 4, border: 'none', fontSize: 16 }} required />
        <textarea placeholder="Your Message" rows={4} style={{ padding: 12, borderRadius: 4, border: 'none', fontSize: 16, resize: 'vertical' }} required />
        <Button variant="contained" color="primary" type="submit">Send Message</Button>
      </Box>
      {/* Contact Details */}
      <Box sx={{ background: 'rgba(35,37,38,0.7)', p: 3, borderRadius: 2 }}>
        <Typography color="#90caf9" fontWeight="bold">Email:</Typography>
        <Typography color="white" mb={1}>info@watchshop.com</Typography>
        <Typography color="#90caf9" fontWeight="bold">Phone:</Typography>
        <Typography color="white" mb={1}>+1 234 567 8901</Typography>
        <Typography color="#90caf9" fontWeight="bold">Address:</Typography>
        <Typography color="white">123 Luxury Ave, Time City, 56789</Typography>
      </Box>
    </Container>
  </Box>
);

export default Contact;
