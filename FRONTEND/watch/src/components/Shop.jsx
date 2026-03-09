import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';

/**
 * IMPORTANT:
 * Do NOT use localhost in Docker.
 * Relative path works in both local & Docker.
 */
const API_BASE_URL = '/api';

const Shop = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [addedIdx, setAddedIdx] = useState(null);
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedProductName, setAddedProductName] = useState('');
  const navigate = useNavigate();
  const [loginAlert, setLoginAlert] = useState(false);

  useEffect(() => {
    fetchWatches();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchWatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWatches = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/watches`);
      if (!response.ok) throw new Error('Failed to fetch watches');
      const data = await response.json();

      const mapped = data.map(watch => ({
        ...watch,
        name: watch.brand,
        image: watch.imageUrl,
        category: watch.brand,
      }));

      setWatches(mapped);
    } catch (err) {
      setError(err.message || 'Error fetching watches');
      setWatches([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(watches.map(w => w.category || 'Other'))];

  const filteredWatches = watches.filter(watch =>
    (category === 'All' || watch.category === category) &&
    watch.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = idx => {
    const customerEmail = localStorage.getItem('customerEmail');
    if (!customerEmail) {
      setLoginAlert(true);
      setTimeout(() => navigate('/customer-login'), 1500);
      return;
    }
    setAddedIdx(idx);
    setAddedProductName(watches[idx].name);
    setShowSuccess(true);
    setTimeout(() => setAddedIdx(null), 1200);
  };

  return (
    <Box id="shop" sx={{ minHeight: '100vh', width: '100vw', position: 'relative' }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={3}>
          <Typography variant="h3" color="white">Shop</Typography>
          <IconButton onClick={fetchWatches} disabled={loading} sx={{ color: 'white' }}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Box display="flex" gap={2} justifyContent="center" mb={4}>
          <TextField
            placeholder="Search watches..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            sx={{ background: 'white', borderRadius: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <TextField
            select
            value={category}
            onChange={e => setCategory(e.target.value)}
            size="small"
            sx={{ background: 'white', borderRadius: 2 }}
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredWatches.map((watch, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                <Card>
                  <CardMedia
                    component="img"
                    height="220"
                    image={watch.image || 'https://via.placeholder.com/150'}
                  />
                  <CardContent>
                    <Typography variant="h6">{watch.name}</Typography>
                    <Typography>${watch.price}</Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleAddToCart(idx)}
                    >
                      {addedIdx === idx ? (
                        <>
                          <CheckCircleIcon sx={{ mr: 1 }} /> Added
                        </>
                      ) : (
                        'Add to Cart'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success">
          {addedProductName} added to cart!
        </Alert>
      </Snackbar>

      <Snackbar
        open={loginAlert}
        autoHideDuration={1500}
        onClose={() => setLoginAlert(false)}
      >
        <Alert severity="warning">
          Please log in first
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Shop;

