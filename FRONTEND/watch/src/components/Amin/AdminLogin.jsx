import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment, IconButton, Link } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.username === 'admin@gmail.com' && form.password === 'admin') {
      setError('');
      navigate('/admin-dashboard');
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor:'linear-gradient(135deg,rgb(112, 135, 241) 0%,rgb(118, 75, 162) 100%)' }}>
      
      <Card sx={{ 
        minWidth: 350, 
        p: 3, 
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        background: '#000000',
        borderRadius: 3,
        border: '2px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          zIndex: 0
        }
      }}>
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center" sx={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Admin Login</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              autoComplete="username"
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.8)' }
                }
              }}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              autoComplete="current-password"
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.8)' }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword(v => !v)} 
                      edge="end"
                      sx={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && <Typography color="#ff6b6b" fontSize={14} sx={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{error}</Typography>}
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              sx={{ 
                mt: 2, 
                background: 'linear-gradient(45deg,rgb(235, 175, 175) 0%,rgb(183, 230, 107) 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(255,107,107,0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg,rgb(240, 149, 116) 0%,rgb(233, 135, 135) 100%)',
                  boxShadow: '0 6px 20px rgba(255,107,107,0.6)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Login
            </Button>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Link 
                href="#" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: 14,
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'white',
                    textDecoration: 'underline'
                  }
                }}
              >
                Forgot password?
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminLogin; 