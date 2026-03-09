import React, { useEffect, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { gsap } from 'gsap';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
// import Spline from '@splinetool/react-spline'; // Uncomment if Spline is installed
import About from './About';
import Shop from './Shop';
import Contact from './Contact';
import Divider from '@mui/material/Divider';
// Add Google Fonts import for Orbitron at the top of the file
import '@fontsource/orbitron/700.css';

const Navbar = () => (
  <AppBar position="static" color="primary" elevation={2} sx={{ backgroundColor: '#232526' }}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
        WatchShop
      </Typography>
      <Button color="inherit" component={Link} to="/admin-login">Admin Login</Button>
      <Button color="inherit" component={Link} to="/customer-login">Customer Login</Button>
      <Button color="inherit" component={Link} to="/customer-register">Customer Register</Button>
      <Button color="inherit" component={Link} to="/shop">Shop</Button>
      <Button color="inherit" component={Link} to="/about">About</Button>
      <Button color="inherit" component={Link} to="/contact">Contact</Button>
    </Toolbar>
  </AppBar>
);

// const watchImages = [
//   {
//     src: 'https://www.pierrecardinwatches.com/cdn/shop/files/CF.1007.MS.1_Main.jpg?v=1731560876',
//     name: 'Burei Classic',
//     price: '$199',
//   },
//   {
//     src: 'https://assets.ajio.com/medias/sys_master/root/20241227/MFXS/676e7400c148fa1b3063b913/-473Wx593H-700986266-multi-MODEL3.jpg',
//     name: 'Ming 17.06',
//     price: '$1,250',
//   },
//   {
//     src: 'https://citizenwatch.widen.net/content/qbbzx4c509/webp/Rolan.webp?u=41zuoe&width=400&height=400&quality=80&crop=false&keep=c&color=f9f8f6',
//     name: 'Seiko Presage',
//     price: '$450',
//   },
//   {
//     src: 'https://www.berrysjewellers.co.uk/cdn/shop/files/21090422010001.webp?v=1735650829&width=1000',
//     name: 'Omega Speedmaster',
//     price: '$5,200',
//   },
//   {
//     src: 'https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw5b02c601/images/Titan/Catalog/1806NM01_3.jpg?sw=600&sh=600',
//     name: 'Rolex Submariner',
//     price: '$8,900',
//   },
//   {
//     src: 'https://static.helioswatchstore.com/media/catalog/product/3/6/3600898_1.jpg',
//     name: 'Tag Heuer Carrera',
//     price: '$3,100',
//   },
//   // New watches
//   {
//     src: 'https://cdn.thewatchshop.in/media/catalog/product/cache/1/image/600x600/9df78eab33525d08d6e5fb8d27136e95/t/i/timex-tw000u933-1.jpg',
//     name: 'Timex Expedition',
//     price: '$120',
//   },
//   {
//     src: 'https://www.casioindiashop.com/media/catalog/product/cache/1/image/600x600/9df78eab33525d08d6e5fb8d27136e95/g/a/ga-2100-1a1dr_1.jpg',
//     name: 'Casio G-Shock',
//     price: '$180',
//   },
//   {
//     src: 'https://www.swatch.com/on/demandware.static/-/Sites-swatch-master-catalog/default/dw7e2e2c7e/images/hi-res/SO27B100.png',
//     name: 'Swatch Big Bold',
//     price: '$160',
//   },
//   {
//     src: 'https://cdn.thewatchshop.in/media/catalog/product/cache/1/image/600x600/9df78eab33525d08d6e5fb8d27136e95/f/o/fossil-fs5380-1.jpg',
//     name: 'Fossil Grant',
//     price: '$220',
//   },
// ];

function getRandomWatches(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const AboutRealtime = () => {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Typography color="white" mt={2}>
      Current time: {time.toLocaleTimeString()}<br/>
      Fun fact: The world’s most expensive watch ever sold is the Patek Philippe Grandmaster Chime for $31 million!
    </Typography>
  );
};

const ContactRealtime = () => {
  const [status, setStatus] = React.useState('');
  React.useEffect(() => {
    const checkStatus = () => {
      const hour = new Date().getHours();
      setStatus(hour >= 9 && hour < 18 ? 'We are online and ready to help you!' : 'Our support is offline. Please email us.');
    };
    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Typography color="#90caf9" mt={2}>{status}</Typography>
  );
};

// Add smooth scroll to body (global style)
const addSmoothScroll = () => {
  document.body.style.scrollBehavior = 'smooth';
};

const Home = () => {
  const heroRef = useRef(null);
  const imageBoxRef = useRef(null);

  useEffect(() => {
    addSmoothScroll();
    AOS.init({ duration: 1200 });
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
    }
    if (imageBoxRef.current) {
      gsap.fromTo(
        imageBoxRef.current,
        { x: 300, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.5,
          onComplete: () => {
            gsap.to(imageBoxRef.current, {
              scale: 1.04,
              rotate: 3,
              duration: 2.5,
              yoyo: true,
              repeat: -1,
              ease: 'power1.inOut',
              transformOrigin: 'center center',
            });
          }
        }
      );
    }
  }, []);

  return (
    <Box sx={{ background: 'transparent' }}>
      <Navbar />
      <Container id="hero" maxWidth="lg" sx={{ mt: 8, minHeight: '60vh', width: '100vw', display: 'flex', alignItems: 'center', py: 8 }}>
        <Box
          ref={heroRef}
          data-aos="fade-up"
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
              }}
            >
              Ronaldo Timeless Elegance
            </Typography>
            <Typography variant="h5" color="white" gutterBottom >
              Shop the latest collection of luxury watches online.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
              component={Link} to="#shop"
            >
              Shop Now
            </Button>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            {/* Background Image Section */}
            <Box
              ref={imageBoxRef}
              sx={{
                width: 750,
                height: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 6,
                backgroundImage: `linear-gradient(rgba(175, 169, 169, 0.35), rgba(175, 169, 169, 0.35)), url(https://bureiwatches.com/cdn/shop/files/5.jpg?v=1744963204)`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundBlendMode: 'darken',
                borderRadius: 6,
              }}
            >
              {/* Optionally, overlay text or leave empty */}
            </Box>
          </Box>
        </Box>
      </Container>

      <Divider sx={{ my: 6, borderColor: 'rgba(255,255,255,0.15)' }} />
      <Shop />
      <Divider sx={{ my: 6, borderColor: 'rgba(255,255,255,0.15)' }} />
      <About />
      <Divider sx={{ my: 6, borderColor: 'rgba(255,255,255,0.15)' }} />
      <Contact />

      {/* Footer */}
      <Box component="footer" sx={{ py: 3, background: '#232526', color: 'white', textAlign: 'center', mt: 8, width: '100vw', position: 'relative', bottom: 0 }}>
        <Typography variant="body2">&copy; {new Date().getFullYear()} WatchShop. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Home;
