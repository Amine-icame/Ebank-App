// Register.js
import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

// MUI
import {
    Alert,
    Box,
    Button,
    Container,
    createTheme,
    CssBaseline,
    Grid,
    Link,
    Paper,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";

// --- SAME THEME AS LOGIN ---
const defaultTheme = createTheme({
  palette: {
    primary: { main: "#0b72ff" },
    secondary: { main: "#00c2a8" },
    background: { default: "#f6f9fc" },
  },
  typography: {
    fontFamily: ['"Poppins"', "Roboto", "sans-serif"].join(","),
  },
});

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    axios
      .post("http://localhost:8085/auth/register", form)
      .then(() => navigate("/login"))
      .catch(() => setError("Erreur lors de l’inscription."));
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      {/* FLIP ANIMATION */}
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: -90, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ perspective: 1000 }}
      >

        <Box
          sx={{
            minHeight: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          <Container maxWidth="lg" sx={{ p: 2 }}>
            <Paper elevation={3} sx={{ overflow: "hidden", display: "flex", minHeight: 560 }}>

              {/* LEFT PANEL IDENTIQUE AU LOGIN */}
              <Box
                sx={{
                  flex: 1,
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  background:
                    "radial-gradient(circle at 20% 20%, #0b72ff 0%, #003c8f 40%, #001e40 100%)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 260,
                    height: 260,
                    top: -50,
                    left: -50,
                    background: "rgba(0, 194, 168, 0.45)",
                    filter: "blur(80px)",
                    borderRadius: "50%",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    width: 300,
                    height: 300,
                    bottom: -60,
                    right: -60,
                    background: "rgba(11, 114, 255, 0.45)",
                    filter: "blur(90px)",
                    borderRadius: "50%",
                  }}
                />

                <Box
                  sx={{
                    width: "80%",
                    maxWidth: 420,
                    backdropFilter: "blur(15px)",
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.15)",
                    p: 4,
                  }}
                >
                  <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
                    E-Bank
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.85)", mt: 2 }}>
                    Créez votre compte bancaire moderne et sécurisé.
                  </Typography>
                </Box>
              </Box>

              {/* --- RIGHT SIDE FORM --- */}
              <Box
                sx={{
                  width: { xs: "100%", md: 480 },
                  p: { xs: 4, md: 6 },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Créer un compte
                </Typography>

                <Typography variant="subtitle1" sx={{ mb: 3 }}>
                  Rejoignez la nouvelle expérience bancaire.
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    label="Nom d’utilisateur"
                    name="username"
                    fullWidth
                    required
                    margin="normal"
                    value={form.username}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: 2, py: 1.25 } }}
                  />

                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    required
                    margin="normal"
                    value={form.email}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: 2, py: 1.25 } }}
                    type="email"
                  />

                  <TextField
                    label="Mot de passe"
                    name="password"
                    fullWidth
                    required
                    margin="normal"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: 2, py: 1.25 } }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: "none",
                      fontSize: "1rem",
                      background:
                        "linear-gradient(90deg, #0b72ff 0%, #0066d6 50%, #00c2a8 100%)",
                      boxShadow: "0 8px 24px rgba(11,114,255,0.18)",
                    }}
                  >
                    S'inscrire
                  </Button>

                  <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item>
                      <Link component={RouterLink} to="/login" variant="body2">
                        Déjà un compte ? Se connecter
                      </Link>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    © E-Bank Project {new Date().getFullYear()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>
      </motion.div>
    </ThemeProvider>
  );
}
