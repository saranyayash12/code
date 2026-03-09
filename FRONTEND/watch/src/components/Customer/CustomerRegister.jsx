import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

// 🔥 IMPORTANT: Change only this if IP changes
const API_BASE_URL = 'http://54.169.46.251:2021/api';

const CustomerRegister = () => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirm: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.email || !form.mobile || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          mobileNumber: form.mobile,
          password: form.password
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Registration failed');
      }

      setLoading(false);
      navigate('/customer-login');

    } catch (err) {
      console.error('Registration error:', err);
      setLoading(false);
      setError('Server not reachable or CORS issue.');
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ minWidth: 350, p: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
            Customer Register
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Mobile Number"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword.password ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((s) => ({ ...s, password: !s.password }))
                      }
                    >
                      {showPassword.password ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Confirm Password"
              name="confirm"
              type={showPassword.confirm ? 'text' : 'password'}
              value={form.confirm}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((s) => ({ ...s, confirm: !s.confirm }))
                      }
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {error && (
              <Typography color="error" fontSize={14}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomerRegister;

