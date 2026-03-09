import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  TextField,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = "http://54.169.46.251:2021/api"; // 🔥 CHANGE IF IP CHANGES

const NAV_TABS = [
  { label: 'Home', value: 'home' },
  { label: 'Shop', value: 'shop' },
  { label: 'Cart', value: 'cart' },
];

const CustomerDashboard = () => {

  const [tab, setTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (tab === 'shop') {
      fetchWatches();
    }
  }, [tab]);

  const fetchWatches = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/watches`);
      if (!res.ok) throw new Error("Failed to fetch watches");
      const data = await res.json();
      setWatches(data);
    } catch (err) {
      setError("Cannot connect to backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    setCart([...cart, product]);

    try {
      await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
    } catch (err) {
      console.error("Error sending product:", err);
    }
  };

  const filteredProducts = watches.filter(
    p => p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", background: "#111", color: "white" }}>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Customer Dashboard
          </Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            {NAV_TABS.map(t => (
              <Tab key={t.value} value={t.value} label={t.label} />
            ))}
          </Tabs>
          <IconButton color="inherit" onClick={() => window.location.href = "/"}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>

        {tab === "home" && (
          <Typography variant="h4">
            Welcome {location.state?.name || "Customer"} 👋
          </Typography>
        )}

        {tab === "shop" && (
          <>
            <TextField
              placeholder="Search watches..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              fullWidth
              sx={{ mb: 3, background: "white", borderRadius: 1 }}
              InputProps={{ startAdornment: <SearchIcon /> }}
            />

            {loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <Grid container spacing={3}>
                {filteredProducts.map((product, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.imageUrl || "https://via.placeholder.com/200"}
                      />
                      <CardContent>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography>${product.price}</Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mt: 1 }}
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {tab === "cart" && (
          <>
            <Typography variant="h5" mb={2}>
              Cart Items ({cart.length})
            </Typography>

            {cart.length === 0 ? (
              <Typography>Your cart is empty.</Typography>
            ) : (
              cart.map((item, idx) => (
                <Card key={idx} sx={{ mb: 2, p: 2 }}>
                  <Typography>{item.name}</Typography>
                  <Typography>${item.price}</Typography>
                </Card>
              ))
            )}

            {cart.length > 0 && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setCart([]);
                  setSuccess(true);
                }}
              >
                Pay Now
              </Button>
            )}
          </>
        )}

      </Container>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">
          Payment Successful!
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default CustomerDashboard;

