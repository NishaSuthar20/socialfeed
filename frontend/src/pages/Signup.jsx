import { useState } from "react";
import {
  Box, Button, Typography, Paper, Alert,
  IconButton, useMediaQuery, useTheme, Collapse
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, form);
      login(res.data.token, res.data.username);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    WebkitBoxShadow: "0 0 0 1000px #0f3d5e inset",
    WebkitTextFillColor: "#E8F4FD",
    caretColor: "#E8F4FD",
    color: "#E8F4FD",
    fontSize: isMobile ? 14 : 15,
    padding: "14px 0",
    fontFamily: "inherit",
    width: "100%",
  };

  const fieldBox = (name) => ({
    display: "flex",
    alignItems: "center",
    bgcolor: "rgba(255,255,255,0.06)",
    border: focusedField === name
      ? "1.5px solid #7BBDE8"
      : "1px solid rgba(123,189,232,0.25)",
    borderRadius: "12px",
    px: 1.5,
    transition: "all 0.3s ease",
    boxShadow: focusedField === name
      ? "0 0 0 3px rgba(123,189,232,0.15)"
      : "none",
    "&:hover": { borderColor: "rgba(123,189,232,0.5)" },
  });

  const labelStyle = {
    fontSize: 12,
    fontWeight: "600",
    color: "#7BBDE8",
    mb: 0.8,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    textAlign: "left",
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(145deg, #061828 0%, #0A2A45 40%, #0D3558 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: { xs: 2, sm: 4 },
      py: { xs: 3, sm: 4 },
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Glow orbs */}
      <Box sx={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        width: { xs: 220, sm: 380 }, height: { xs: 220, sm: 380 },
        background: "radial-gradient(circle, rgba(123,189,232,0.07) 0%, transparent 70%)",
        top: "-8%", right: "-8%",
      }} />
      <Box sx={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        width: { xs: 180, sm: 280 }, height: { xs: 180, sm: 280 },
        background: "radial-gradient(circle, rgba(110,162,179,0.06) 0%, transparent 70%)",
        bottom: "-5%", left: "-5%",
      }} />

      <Box sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: "420px" },
        position: "relative", zIndex: 1,
      }}>
        <Paper elevation={0} sx={{
          width: "100%",
          p: { xs: 3, sm: 4.5 },
          borderRadius: { xs: "20px", sm: "24px" },
          background: "linear-gradient(145deg, #0A2A45 0%, #0D3558 50%, #0F3D66 100%)",
          border: "1px solid rgba(123,189,232,0.2)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          textAlign: "center",
          overflow: "hidden",
          position: "relative",
          boxSizing: "border-box",
        }}>

          {/* Accent bar */}
          <Box sx={{
            position: "absolute", top: 0, left: 0, right: 0, height: "3px",
            background: "linear-gradient(90deg, #6EA2B3, #7BBDE8, #BDD8E9)",
          }} />

          {/* Logo */}
          <Box sx={{ mb: { xs: 3, sm: 4 }, mt: 1 }}>
            <Box sx={{
              width: { xs: 50, sm: 60 }, height: { xs: 50, sm: 60 },
              background: "linear-gradient(135deg, #7BBDE8 0%, #BDD8E9 100%)",
              borderRadius: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              mx: "auto", mb: 2,
              boxShadow: "0 6px 22px rgba(123,189,232,0.4)",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.07) rotate(3deg)" },
            }}>
              <AutoAwesomeIcon sx={{ color: "#021F38", fontSize: { xs: 24, sm: 30 } }} />
            </Box>
            <Typography sx={{
              fontWeight: "800", fontSize: { xs: 24, sm: 30 },
              color: "#E8F4FD", letterSpacing: "2px",
              textTransform: "uppercase", lineHeight: 1, mb: 0.8,
            }}>
              Join Us
            </Typography>
            <Typography sx={{
              color: "#6EA2B3", fontSize: { xs: 10, sm: 12 },
              fontWeight: "500", letterSpacing: "2.5px", textTransform: "uppercase",
            }}>
              Start your journey today ✨
            </Typography>
          </Box>

          {/* Error */}
          <Collapse in={!!error}>
            <Alert severity="error" onClose={() => setError("")} sx={{
              mb: 2, borderRadius: "12px",
              bgcolor: "rgba(198,40,40,0.15)", color: "#ef9a9a",
              fontWeight: "600", fontSize: 13,
              border: "1px solid rgba(239,154,154,0.3)", textAlign: "left",
              "& .MuiAlert-icon": { color: "#ef9a9a" },
            }}>
              {error}
            </Alert>
          </Collapse>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>

            {/* Username */}
            <Box sx={{ mb: 2, textAlign: "left" }}>
              <Typography sx={labelStyle}>Username</Typography>
              <Box sx={fieldBox("username")}>
                <PersonIcon sx={{
                  color: focusedField === "username" ? "#7BBDE8" : "#6EA2B3",
                  fontSize: 20, mr: 1, flexShrink: 0,
                  transition: "color 0.3s ease",
                }} />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField("")}
                  placeholder="yourname"
                  required
                  style={inputStyle}
                />
              </Box>
            </Box>

            {/* Email */}
            <Box sx={{ mb: 2, textAlign: "left" }}>
              <Typography sx={labelStyle}>Email Address</Typography>
              <Box sx={fieldBox("email")}>
                <EmailIcon sx={{
                  color: focusedField === "email" ? "#7BBDE8" : "#6EA2B3",
                  fontSize: 20, mr: 1, flexShrink: 0,
                  transition: "color 0.3s ease",
                }} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                />
              </Box>
            </Box>

            {/* Password */}
            <Box sx={{ mb: 3, textAlign: "left" }}>
              <Typography sx={labelStyle}>Password</Typography>
              <Box sx={fieldBox("password")}>
                <LockIcon sx={{
                  color: focusedField === "password" ? "#7BBDE8" : "#6EA2B3",
                  fontSize: 20, mr: 1, flexShrink: 0,
                  transition: "color 0.3s ease",
                }} />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  placeholder="••••••••"
                  required
                  style={inputStyle}
                />
                <IconButton
                  onClick={() => setShowPass(!showPass)}
                  size="small"
                  sx={{
                    color: "#6EA2B3", ml: 0.5,
                    "&:hover": { color: "#7BBDE8", bgcolor: "rgba(123,189,232,0.1)" },
                    transition: "all 0.2s ease",
                  }}
                >
                  {showPass
                    ? <VisibilityOff sx={{ fontSize: 18 }} />
                    : <Visibility sx={{ fontSize: 18 }} />
                  }
                </IconButton>
              </Box>
            </Box>

            {/* Submit */}
            <Button
              fullWidth
              type="submit"
              disabled={loading}
              sx={{
                py: { xs: 1.4, sm: 1.7 },
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: { xs: 14, sm: 15 },
                textTransform: "none",
                letterSpacing: "0.5px",
                background: "linear-gradient(135deg, #7BBDE8 0%, #BDD8E9 100%)",
                color: "#021F38",
                boxShadow: "0 6px 22px rgba(123,189,232,0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #BDD8E9 0%, #ffffff 100%)",
                  boxShadow: "0 10px 30px rgba(123,189,232,0.55)",
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  background: "rgba(123,189,232,0.2)",
                  color: "rgba(255,255,255,0.3)",
                  boxShadow: "none",
                },
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {loading ? "Joining..." : "Create Account 🎉"}
            </Button>

            {/* OR divider */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(123,189,232,0.15)" }} />
              <Typography sx={{ color: "#6EA2B3", fontSize: 12, fontWeight: "500" }}>OR</Typography>
              <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(123,189,232,0.15)" }} />
            </Box>

            {/* Login link */}
            <Typography sx={{ color: "#6EA2B3", fontSize: { xs: 13, sm: 14 }, fontWeight: "500" }}>
              Already on the feed?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Box component="span" sx={{
                  color: "#7BBDE8", fontWeight: "700",
                  borderBottom: "1.5px solid rgba(123,189,232,0.4)", pb: "1px",
                  "&:hover": { color: "#BDD8E9", borderBottomColor: "#BDD8E9" },
                  transition: "all 0.2s ease",
                }}>
                  Sign In
                </Box>
              </Link>
            </Typography>

          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Signup;