// Login.js
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// --- IMPORTS MATERIAL UI ---
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom theme (typography + brand colors)
const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#0b72ff', // strong brand blue
      contrastText: '#fff',
    },
    secondary: {
      main: '#00c2a8', // accent mint
    },
    background: {
      default: '#f6f9fc',
    },
  },
  typography: {
    fontFamily: ['"Poppins"', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h4: { fontWeight: 600 },
    subtitle1: { color: '#6b7280' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    axios.post("http://localhost:8085/auth/login", null, {
        params: { username, password }
    })
    .then((response) => {
        const jwtToken = response.data["accessToken"];
        localStorage.setItem("jwtToken", jwtToken);
        const decodedToken = jwtDecode(jwtToken);
        
        if(decodedToken.roles.includes("ROLE_ADMIN")) {
            navigate("/customers"); 
        } else {
            navigate("/client-dashboard");
        }
    })
    .catch((err) => {
        if (err.response && err.response.data && err.response.data.error === "Disabled") {
            setError("Compte en attente de validation.");
        } else {
             setError("Email ou mot de passe incorrect.");
        }
    });
  };

  const isSmall = useMediaQuery(defaultTheme.breakpoints.down('md'));

  // Illustration SVG (inline, subtle) — tu peux remplacer par une image via backgroundImage CSS si tu veux
  const illustrationSvg = (
    <svg viewBox="0 0 600 400" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="grad1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0052ff" />
          <stop offset="50%" stopColor="#1a73ff" />
          <stop offset="100%" stopColor="#4aa8ff" />
        </linearGradient>
  
        <radialGradient id="glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
  
      {/* Fond bleu style 1 */}
      <rect width="100%" height="100%" fill="url(#grad1)" rx="24" />
  
      {/* Halo lumineux */}
      <circle cx="300" cy="150" r="160" fill="url(#glow)" />
  
      {/* Formes ondulées */}
      <path
        d="M0 260 C150 220 450 300 600 250 L600 400 L0 400 Z"
        fill="rgba(255,255,255,0.12)"
      />
  
      <path
        d="M0 120 C200 180 400 80 600 150"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
  

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #f6f9fc 0%, #ffffff 100%)',
          p: 2,
        }}
      >
        <Container maxWidth="lg" sx={{ p: 2 }}>
          <Paper elevation={3} sx={{ overflow: 'hidden', display: 'flex', minHeight: 560 }}>
            {/* Left: Illustration / Branding */}
            <Box
            sx={{
                flex: 1,
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: 'radial-gradient(circle at 20% 20%, #0b72ff 0%, #003c8f 40%, #001e40 100%)',
                overflow: 'hidden',
            }}
            >
            {/* Glow top-left */}
            <Box
                sx={{
                position: 'absolute',
                width: 280,
                height: 280,
                top: -60,
                left: -60,
                background: 'rgba(0, 194, 168, 0.40)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                }}
            />

            {/* Glow bottom-right */}
            <Box
                sx={{
                position: 'absolute',
                width: 300,
                height: 300,
                bottom: -80,
                right: -80,
                background: 'rgba(11, 114, 255, 0.40)',
                filter: 'blur(90px)',
                borderRadius: '50%',
                }}
            />

            {/* Glass Card */}
            <Box
                sx={{
                width: '80%',
                maxWidth: 420,
                backdropFilter: 'blur(18px)',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.15)',
                p: 4,
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                position: 'relative',
                }}
            >
                <Typography
                variant="h4"
                sx={{
                    color: '#fff',
                    fontWeight: 700,
                    mb: 2,
                    letterSpacing: 0.5,
                }}
                >
                E-Bank
                </Typography>

                <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 4 }}>
                Votre espace bancaire nouvelle génération : simple, sécurisé et intelligent.
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', mr: 1 }}>
                    <LockOutlinedIcon sx={{ color: '#fff' }} />
                </Avatar>
                <Typography sx={{ color: 'rgba(255,255,255,0.75)' }}>
                    Sécurité avancée — chiffrement AES-256 — authentification intelligente
                </Typography>
                </Box>
            </Box>
            </Box>


            {/* Right: Form */}
            <Box
              sx={{
                width: { xs: '100%', md: 480 },
                p: { xs: 4, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: '#fff',
              }}
            >
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
                    Se connecter
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                    Accédez à votre espace bancaire — simple et sécurisé.
                  </Typography>
                </Box>
                <IconButton component={RouterLink} to="/" aria-label="home" sx={{ color: 'text.secondary' }}>
                  {/* minimal home icon made from text for subtlety; replace as needed */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 11L12 3l9 8" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 11v8a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1v-8" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </IconButton>
              </Box>

              <Box sx={{ width: '100%', mt: 1 }}>
                <Paper elevation={0} sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 6px 30px rgba(12, 24, 48, 0.08)',
                  border: '1px solid rgba(15, 23, 42, 0.04)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                      <LockOutlinedIcon />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Entrez vos identifiants pour continuer
                    </Typography>
                  </Box>

                  {/* Error */}
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Adresse Email"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                          py: 1.25,
                        }
                      }}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Mot de passe"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                          py: 1.25,
                        }
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disableElevation
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        textTransform: 'none',
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #0b72ff 0%, #0066d6 50%, #00c2a8 100%)',
                        boxShadow: '0 8px 24px rgba(11,114,255,0.18)',
                        '&:hover': {
                          boxShadow: '0 10px 30px rgba(11,114,255,0.22)',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      Se connecter
                    </Button>

                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                          Mot de passe oublié ?
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link component={RouterLink} to="/register" variant="body2" sx={{ textDecoration: 'none' }}>
                          Pas de compte ? S'inscrire
                        </Link>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>

                {/* subtle footer inside card */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    En vous connectant, vous acceptez les conditions d'utilisation.
                  </Typography>
                </Box>
              </Box>

              {/* global footer */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {'Copyright © E-Bank Project '}
                  {new Date().getFullYear()}
                  {'.'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
