import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Globe, Lock, User as UserIcon } from "lucide-react";
import api from "../services/api";
import { motion } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        username,
        password,
      });
      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid username or password. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 0% 0%, #1e1b4b 0%, #0f172a 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          content: '""',
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: "40%",
          height: "40%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Card sx={{ borderRadius: 8, p: { xs: 2, md: 4 } }}>
            <CardContent sx={{ textAlign: "center", pt: 6 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 4,
                  boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                  transform: "rotate(4deg)",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "rotate(8deg)" },
                }}
              >
                <Globe size={40} color="white" />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  color: "white",
                  mb: 1,
                }}
              >
                World
                <Box component="span" sx={{ color: "primary.main" }}>
                  Pop
                </Box>
              </Typography>
              <Typography
                variant="overline"
                sx={{
                  color: "text.secondary",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  mb: 6,
                  display: "block",
                }}
              >
                Global Demographic Intelligence
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  variant="outlined"
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    bgcolor: "rgba(239, 68, 68, 0.05)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "error.main",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    fontSize: "0.625rem",
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Typography
                  variant="caption"
                  align="left"
                  display="block"
                  sx={{
                    ml: 1,
                    mb: 1,
                    fontWeight: 900,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Identity Access
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Operator ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  sx={{ mb: 4 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <UserIcon size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: "rgba(15, 23, 42, 0.5)" },
                  }}
                />

                <Typography
                  variant="caption"
                  align="left"
                  display="block"
                  sx={{
                    ml: 1,
                    mb: 1,
                    fontWeight: 900,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Secure Protocol
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  variant="outlined"
                  placeholder="Access Key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ mb: 6 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: "rgba(15, 23, 42, 0.5)" },
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ height: 56, mb: 4 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "AUTHENTICATE"
                  )}
                </Button>
              </Box>

              <Box
                sx={{
                  mt: 4,
                  pt: 4,
                  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <Box
                  sx={{
                    display: "inline-block",
                    px: 3,
                    py: 1.5,
                    bgcolor: "rgba(15, 23, 42, 0.5)",
                    borderRadius: 3,
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.625rem",
                      fontWeight: 800,
                      color: "text.secondary",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Demo Credentials:{" "}
                    <Box
                      component="span"
                      sx={{ color: "primary.light", ml: 1 }}
                    >
                      admin / admin123
                    </Box>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
