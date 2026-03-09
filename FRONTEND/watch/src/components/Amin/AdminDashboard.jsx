import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Alert, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import adminImage from '../../assets/image/businessman-holding-smart-watch-watching-clock-speed-generated-by-ai.jpg';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const NAV_TABS = [
  { label: 'Index', value: 'index' },
  { label: 'Customer Details', value: 'customers' },
  { label: 'Watch Details', value: 'products' },
  { label: 'Cart Details', value: 'cart' }, // New tab
];

const API_BASE_URL = '/api';

const bgStyles = {
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
  animation: 'fadeIn 1s ease-in-out',
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  }
};

const beforeStyles = {
  content: '""',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  background:
    "url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80') center center/cover no-repeat",
  filter: 'blur(2.5px) brightness(0.7)',
  pointerEvents: 'none',
  animation: 'backgroundFloat 20s ease-in-out infinite',
  '@keyframes backgroundFloat': {
    '0%, 100%': { transform: 'scale(1) translate(0, 0)' },
    '50%': { transform: 'scale(1.05) translate(-10px, -10px)' }
  }
};

// Add global styles for the zoomInOut animation
const globalStyles = `
  @keyframes zoomInOut {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const AdminDashboard = () => {
  const [tab, setTab] = useState('index');
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', description: '', brand: '', imageUrl: '' });
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [customerError, setCustomerError] = useState('');
  const [productError, setProductError] = useState('');
  const [productSuccess, setProductSuccess] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartError, setCartError] = useState('');
  const [cartItems, setCartItems] = useState([]);

  // Fetch customer details
  useEffect(() => {
    if (tab === 'customers') {
      setLoadingCustomers(true);
      setCustomerError('');
      fetch(`${API_BASE_URL}/customers`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch customers');
          return res.json();
        })
        .then(data => {
          setCustomers(data);
          setLoadingCustomers(false);
        })
        .catch(err => {
          setCustomerError(err.message || 'Error fetching customers');
          setCustomers([]);
          setLoadingCustomers(false);
        });
    }
  }, [tab]);

  // Fetch watch products
  useEffect(() => {
    if (tab === 'products') {
      fetchProducts();
    }
  }, [tab]);

  useEffect(() => {
    if (tab === 'cart') {
      setLoadingCart(true);
      setCartError('');
      fetch(`${API_BASE_URL}/products`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch cart items');
          return res.json();
        })
        .then(data => {
          setCartItems(Array.isArray(data) ? data : [data]);
          setLoadingCart(false);
        })
        .catch(err => {
          setCartError(err.message || 'Error fetching cart items');
          setCartItems([]);
          setLoadingCart(false);
        });
    }
  }, [tab]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setProductError('');
    try {
      const response = await fetch(`${API_BASE_URL}/watches`);
      if (!response.ok) throw new Error('Failed to fetch watches');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setProductError(err.message || 'Error fetching watches');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Product CRUD handlers
  const handleProductChange = e => setProductForm({ ...productForm, [e.target.name]: e.target.value });
  
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    try {
      let response;
      const productData = {
        name: productForm.name,
        price: productForm.price,
        description: productForm.description,
        brand: productForm.brand,
        imageUrl: productForm.imageUrl
      };

      if (editProduct) {
        response = await fetch(`${API_BASE_URL}/watches/${editProduct._id || editProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/watches`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      }
      if (!response.ok) throw new Error(`Failed to ${editProduct ? 'update' : 'create'} watch`);
      setProductSuccess(`Watch ${editProduct ? 'updated' : 'created'} successfully!`);
      setEditProduct(null);
      setProductForm({ name: '', price: '', description: '', brand: '', imageUrl: '' });
      fetchProducts(); // Refresh the list
      setTimeout(() => setProductSuccess(''), 3000);
    } catch (err) {
      setProductError(err.message || `Error ${editProduct ? 'updating' : 'creating'} watch`);
    }
  };

  const handleEdit = product => {
    setEditProduct(product);
    setProductForm({ 
      name: product.name || '', 
      price: product.price || '', 
      description: product.description || '', 
      brand: product.brand || '', 
      imageUrl: product.imageUrl || '' 
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this watch?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/watches/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete watch');
      
      setProductSuccess('Watch deleted successfully!');
      fetchProducts(); // Refresh the list
      
      // Clear success message after 3 seconds
      setTimeout(() => setProductSuccess(''), 3000);
    } catch (err) {
      setProductError(err.message || 'Error deleting watch');
    }
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
    setProductForm({ name: '', price: '', description: '', brand: '', imageUrl: '' });
  };

  const handleOpenCart = async () => {
    setCartOpen(true);
    setLoadingCart(true);
    setCartError('');
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch cart products');
      const data = await response.json();
      setCartProducts(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setCartError(err.message || 'Error fetching cart products');
      setCartProducts([]);
    } finally {
      setLoadingCart(false);
    }
  };
  const handleCloseCart = () => setCartOpen(false);
console.log(products);
  return (
    <Box sx={bgStyles}>
      {/* Inject global styles */}
      <style>{globalStyles}</style>
      {/* Blurred background image */}
      <Box sx={beforeStyles} />
      <AppBar position="static" color="primary" sx={{ 
        animation: 'slideDown 0.8s ease-out',
        '@keyframes slideDown': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' }
        }
      }}>
        <Toolbar>
          <Typography variant="h6" sx={{ 
            flexGrow: 1,
            animation: 'glow 2s ease-in-out infinite alternate',
            '@keyframes glow': {
              from: { textShadow: '0 0 5px rgba(255,255,255,0.5)' },
              to: { textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6)' }
            }
          }}>
            Admin Dashboard
          </Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="inherit" indicatorColor="secondary">
            {NAV_TABS.map((t, index) => (
              <Tab 
                key={t.value} 
                label={t.label} 
                value={t.value} 
                sx={{ 
                  animation: `slideInRight 0.6s ease-out ${index * 0.1}s both`,
                  '@keyframes slideInRight': {
                    from: { transform: 'translateX(50px)', opacity: 0 },
                    to: { transform: 'translateX(0)', opacity: 1 }
                  }
                }}
              />
            ))}
          </Tabs>
          <Button 
            color="inherit" 
            sx={{ 
              ml: 2,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' }
              },
              '&:hover': {
                animation: 'none',
                transform: 'scale(1.1)',
                transition: 'transform 0.3s ease'
              }
            }} 
            onClick={() => window.location.href = '/'}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {/* Cart Dialog */}
      <Dialog open={cartOpen} onClose={handleCloseCart} maxWidth="md" fullWidth>
        <DialogTitle>Cart Details</DialogTitle>
        <DialogContent>
          {loadingCart ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="20vh">
              <CircularProgress />
            </Box>
          ) : cartError ? (
            <Alert severity="error">{cartError}</Alert>
          ) : cartProducts.length === 0 ? (
            <Typography>No products in cart.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Customer Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartProducts.map((prod, idx) => (
                    <TableRow key={prod.id || idx}>
                      <TableCell>
                        {prod.imageUrl ? (
                          <img src={prod.imageUrl} alt={prod.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                        ) : 'No Image'}
                      </TableCell>
                      <TableCell>{prod.name}</TableCell>
                      <TableCell>{prod.brand}</TableCell>
                      <TableCell>${prod.price}</TableCell>
                      <TableCell>{prod.customerEmail}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCart}>Close</Button>
        </DialogActions>
      </Dialog>
      <Container sx={{ py: 6 }}>
        {tab === 'index' && (
          <Container maxWidth="lg" sx={{ mt: 8, minHeight: '60vh', width: '100vw', display: 'flex', alignItems: 'center', py: 8 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '60vh',
                gap: 6,
                width: '100vw',
                background: 'rgba(35,37,38,0.85)',
                borderRadius: 6,
                boxShadow: 6,
                px: { xs: 2, md: 8 },
                py: { xs: 4, md: 8 },
                animation: 'fadeInUp 1s ease-out',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(50px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  gutterBottom
                  color='transparent'
                  sx={{
                    fontFamily: 'Orbitron, Roboto, Arial, sans-serif',
                    letterSpacing: 2,
                    background: 'linear-gradient(90deg,rgba(0, 200, 255, 0.83) 0%,rgba(0, 115, 255, 0.69) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '2px 2px 8px rgba(0,114,255,0.15)',
                    fontSize: { xs: '2.2rem', md: '3.5rem' },
                    animation: 'glow 2s ease-in-out infinite alternate',
                    '@keyframes glow': {
                      from: { filter: 'brightness(1)' },
                      to: { filter: 'brightness(1.2)' }
                    }
                  }}
                >
                  Admin Dashboard
                </Typography>
                <Typography 
                  variant="h5" 
                  color="white" 
                  gutterBottom
                  sx={{
                    animation: 'fadeIn 2s ease-out 0.5s both',
                    '@keyframes fadeIn': {
                      from: { opacity: 0 },
                      to: { opacity: 1 }
                    }
                  }}
                >
                  Professional watch management system
                </Typography>
                <Typography 
                  variant="body1" 
                  color="#b0bec5"
                  sx={{
                    animation: 'fadeIn 2s ease-out 1s both',
                    '@keyframes fadeIn': {
                      from: { opacity: 0 },
                      to: { opacity: 1 }
                    },
                    mb: 3
                  }}
                >
                  Manage customers, products, and inventory with ease.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ 
                    mt: 3,
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #764ba2 0%, #667eea 100%)',
                      boxShadow: '0 6px 20px rgba(102,126,234,0.6)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' }
                    }
                  }}
                  onClick={() => setTab('products')}
                >
                  Manage Products
                </Button>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                {/* Background Image Section */}
                <Box
                  sx={{
                    width: { xs: '100%', sm: 600, md: 750 },
                    height: { xs: 300, sm: 400, md: 500 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    backgroundImage: `linear-gradient(rgba(175, 169, 169, 0.35), rgba(175, 169, 169, 0.35)), url(${adminImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'darken',
                    borderRadius: 6,
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'float 8s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
                      '25%': { transform: 'translateY(-10px) rotate(1deg) scale(1.02)' },
                      '50%': { transform: 'translateY(-5px) rotate(-1deg) scale(1.01)' },
                      '75%': { transform: 'translateY(-15px) rotate(0.5deg) scale(1.03)' }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(102,126,234,0.3) 0%, rgba(118,75,162,0.3) 100%)',
                      zIndex: 1,
                      animation: 'colorShift 5s ease-in-out infinite',
                      '@keyframes colorShift': {
                        '0%, 100%': { opacity: 0.3 },
                        '50%': { opacity: 0.6 }
                      }
                    }
                  }}
                >
                  {/* Overlay Text */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 30,
                      left: 30,
                      right: 30,
                      zIndex: 2,
                      textAlign: 'left'
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="white"
                      sx={{
                        fontWeight: 'bold',
                        textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 20px rgba(102,126,234,0.5)',
                        animation: 'slideInLeft 1s ease-out 2s both',
                        '@keyframes slideInLeft': {
                          from: { opacity: 0, transform: 'translateX(-50px)' },
                          to: { opacity: 1, transform: 'translateX(0)' }
                        },
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                      }}
                    >
                      Smart Watch Management
                    </Typography>
                    <Typography
                      variant="h6"
                      color="rgba(255,255,255,0.95)"
                      sx={{
                        textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(255,255,255,0.3)',
                        animation: 'slideInLeft 1s ease-out 2.5s both',
                        '@keyframes slideInLeft': {
                          from: { opacity: 0, transform: 'translateX(-50px)' },
                          to: { opacity: 1, transform: 'translateX(0)' }
                        },
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                        mt: 1
                      }}
                    >
                      Professional timepiece administration
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        )}
        {tab === 'customers' && (
          <Box sx={{
            animation: 'slideInLeft 0.8s ease-out',
            '@keyframes slideInLeft': {
              from: { opacity: 0, transform: 'translateX(-50px)' },
              to: { opacity: 1, transform: 'translateX(0)' }
            }
          }}>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              mb={3} 
              color="white"
              sx={{
                animation: 'glow 2s ease-in-out infinite alternate',
                '@keyframes glow': {
                  from: { textShadow: '0 0 10px rgba(255,255,255,0.3)' },
                  to: { textShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)' }
                }
              }}
            >
              Customer Details
            </Typography>
            {loadingCustomers ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            ) : customerError ? (
              <Alert severity="error" sx={{ mb: 2 }}>{customerError}</Alert>
            ) : (
              <TableContainer component={Paper} sx={{ 
                background: 'rgba(44,62,80,0.95)',
                animation: 'fadeInUp 0.8s ease-out',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(30px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {customers.length > 0 && Object.keys(customers[0]).map((key, index) => (
                        <TableCell 
                          key={key} 
                          sx={{ 
                            color: 'white', 
                            textTransform: 'capitalize',
                            animation: `slideInDown 0.6s ease-out ${index * 0.1}s both`,
                            '@keyframes slideInDown': {
                              from: { opacity: 0, transform: 'translateY(-20px)' },
                              to: { opacity: 1, transform: 'translateY(0)' }
                            }
                          }}
                        >
                          {key}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ 
                          color: 'white',
                          animation: 'pulse 2s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 0.7 },
                            '50%': { opacity: 1 }
                          }
                        }}>
                          No customers found.
                        </TableCell>
                      </TableRow>
                    )}
                    {customers.map((c, i) => (
                      <TableRow 
                        key={i}
                        sx={{
                          animation: `fadeInLeft 0.6s ease-out ${i * 0.1}s both`,
                          '@keyframes fadeInLeft': {
                            from: { opacity: 0, transform: 'translateX(-30px)' },
                            to: { opacity: 1, transform: 'translateX(0)' }
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            transition: 'background-color 0.3s ease'
                          }
                        }}
                      >
                        {Object.keys(customers[0]).map((key) => (
                          <TableCell key={key} sx={{ color: 'white' }}>{c[key]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
        {tab === 'products' && (
          <Box sx={{
            animation: 'slideInRight 0.8s ease-out',
            '@keyframes slideInRight': {
              from: { opacity: 0, transform: 'translateX(50px)' },
              to: { opacity: 1, transform: 'translateX(0)' }
            }
          }}>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              mb={3} 
              color="white"
              sx={{
                animation: 'glow 2s ease-in-out infinite alternate',
                '@keyframes glow': {
                  from: { textShadow: '0 0 10px rgba(255,255,255,0.3)' },
                  to: { textShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)' }
                }
              }}
            >
              Watch Management
            </Typography>
            
            {/* Success/Error Messages */}
            {productSuccess && <Alert severity="success" sx={{ mb: 2 }}>{productSuccess}</Alert>}
            {productError && <Alert severity="error" sx={{ mb: 2 }}>{productError}</Alert>}
            
            {/* Add/Edit Form */}
            <Paper sx={{ 
              p: 3, 
              mb: 3, 
              background: 'rgba(44,62,80,0.95)',
              animation: 'fadeInUp 0.8s ease-out',
              '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(30px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}>
              <Typography 
                variant="h6" 
                color="white" 
                mb={2}
                sx={{
                  animation: 'glow 2s ease-in-out infinite alternate',
                  '@keyframes glow': {
                    from: { textShadow: '0 0 5px rgba(255,255,255,0.3)' },
                    to: { textShadow: '0 0 15px rgba(255,255,255,0.6)' }
                  }
                }}
              >
                {editProduct ? 'Edit Watch' : 'Add New Watch'}
              </Typography>
              <Box component="form" onSubmit={handleProductSubmit} sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <TextField 
                  label="Watch Name" 
                  name="name" 
                  value={productForm.name} 
                  onChange={handleProductChange} 
                  required 
                  sx={{ '& .MuiInputLabel-root': { color: 'white' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
                />
                <TextField 
                  label="Price" 
                  name="price" 
                  type="number" 
                  value={productForm.price} 
                  onChange={handleProductChange} 
                  required 
                  sx={{ '& .MuiInputLabel-root': { color: 'white' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
                />
                <TextField 
                  label="Brand" 
                  name="brand" 
                  value={productForm.brand} 
                  onChange={handleProductChange} 
                  sx={{ '& .MuiInputLabel-root': { color: 'white' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
                />
                <TextField 
                  label="Image URL" 
                  name="imageUrl" 
                  value={productForm.imageUrl} 
                  onChange={handleProductChange} 
                  placeholder="https://example.com/image.jpg"
                  sx={{ '& .MuiInputLabel-root': { color: 'white' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
                />
                <TextField 
                  label="Description" 
                  name="description" 
                  value={productForm.description} 
                  onChange={handleProductChange} 
                  multiline 
                  rows={2}
                  sx={{ gridColumn: '1 / -1', '& .MuiInputLabel-root': { color: 'white' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
                />
                <Box sx={{ display: 'flex', gap: 2, gridColumn: '1 / -1' }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    sx={{
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.02)' }
                      },
                      '&:hover': {
                        animation: 'none',
                        transform: 'scale(1.05)',
                        transition: 'transform 0.3s ease'
                      }
                    }}
                  >
                    {editProduct ? 'Update Watch' : 'Add Watch'}
                  </Button>
                  {editProduct && (
                    <Button 
                      onClick={handleCancelEdit} 
                      variant="outlined" 
                      color="secondary"
                      sx={{
                        '&:hover': {
                          transform: 'scale(1.05)',
                          transition: 'transform 0.3s ease'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* Products Table */}
            {loadingProducts ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' }
                  }
                }} />
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ 
                background: 'rgba(44,62,80,0.95)',
                animation: 'fadeInUp 0.8s ease-out',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(30px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Image</TableCell>
                      <TableCell sx={{ color: 'white' }}>Name</TableCell>
                      <TableCell sx={{ color: 'white' }}>Brand</TableCell>
                      <TableCell sx={{ color: 'white' }}>Price</TableCell>
                      <TableCell sx={{ color: 'white' }}>Description</TableCell>
                      <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ color: 'white' }}>
                          No watches found.
                        </TableCell>
                      </TableRow>
                    )}
                    {products.map((p, index) => (
                      <TableRow 
                        key={p._id || p.id}
                        sx={{
                          animation: `fadeInRight 0.6s ease-out ${index * 0.1}s both`,
                          '@keyframes fadeInRight': {
                            from: { opacity: 0, transform: 'translateX(30px)' },
                            to: { opacity: 1, transform: 'translateX(0)' }
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            transition: 'background-color 0.3s ease'
                          }
                        }}
                      >
                        <TableCell sx={{ color: 'white' }}>
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              style={{ 
                                width: 48, 
                                height: 48, 
                                objectFit: 'cover', 
                                borderRadius: 6, 
                                border: '1px solid #eee', 
                                background: '#fff',
                                transition: 'transform 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            />
                          ) : (
                            <Box sx={{ 
                              width: 48, 
                              height: 48, 
                              bgcolor: '#eee', 
                              borderRadius: 1, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              color: '#888', 
                              fontSize: 12 
                            }}>
                              No Image
                            </Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>{p.name}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{p.brand || '-'}</TableCell>
                        <TableCell sx={{ color: 'white' }}>${p.price}</TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          {p.description ? (p.description.length > 50 ? `${p.description.substring(0, 50)}...` : p.description) : '-'}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            onClick={() => handleEdit(p)}
                            sx={{
                              '&:hover': {
                                transform: 'scale(1.2) rotate(15deg)',
                                transition: 'transform 0.3s ease'
                              }
                            }}
                          >
                            <EditIcon sx={{ color: 'white' }} />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(p._id || p.id)} 
                            color="error"
                            sx={{
                              '&:hover': {
                                transform: 'scale(1.2) rotate(-15deg)',
                                transition: 'transform 0.3s ease'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
        {tab === 'cart' && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3} color="white">Cart Details</Typography>
            {loadingCart ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            ) : cartError ? (
              <Alert severity="error" sx={{ mb: 2 }}>{cartError}</Alert>
            ) : (
              <TableContainer component={Paper} sx={{ background: 'rgba(44,62,80,0.95)' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Image</TableCell>
                      <TableCell sx={{ color: 'white' }}>Name</TableCell>
                      <TableCell sx={{ color: 'white' }}>Brand</TableCell>
                      <TableCell sx={{ color: 'white' }}>Category</TableCell>
                      <TableCell sx={{ color: 'white' }}>Description</TableCell>
                      <TableCell sx={{ color: 'white' }}>Price</TableCell>
                      <TableCell sx={{ color: 'white' }}>Customer Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ color: 'white' }}>
                          No cart items found.
                        </TableCell>
                      </TableRow>
                    )}
                    {cartItems.map((item, idx) => (
                      <TableRow key={item._id || item.id || idx}>
                        <TableCell>
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                          ) : 'No Image'}
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>{item.name}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{item.brand}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{item.category}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{item.description}</TableCell>
                        <TableCell sx={{ color: 'white' }}>${item.price}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{item.customerEmail}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
