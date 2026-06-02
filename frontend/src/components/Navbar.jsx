import { AppBar, Toolbar, Typography, Button, Box, Avatar, Chip,
         useMediaQuery, useTheme, Drawer, IconButton, List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDrawerOpen(false);
  };

  const LogoSection = () => (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 1.2, cursor: "pointer" }}
      onClick={() => { navigate("/"); setDrawerOpen(false); }}
    >
      {/* Logo icon box — light blue on dark navy */}
      <Box sx={{
        width: isMobile ? 30 : 38,
        height: isMobile ? 30 : 38,
        background: "linear-gradient(135deg, #7BBDE8 0%, #BDD8E9 100%)",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 14px rgba(123,189,232,0.4)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.08)",
          boxShadow: "0 6px 20px rgba(123,189,232,0.6)",
        },
      }}>
        <AutoAwesomeIcon sx={{ color: "#021F38", fontSize: isMobile ? 16 : 20 }} />
      </Box>

      <Typography sx={{
        fontWeight: "800",
        fontSize: isMobile ? 15 : 18,
        letterSpacing: "2px",
        color: "#E8F4FD",
        textTransform: "uppercase",
      }}>
        SocialFeed
      </Typography>
    </Box>
  );

  const UserChip = ({ small = false }) => (
    <Chip
      avatar={
        <Avatar sx={{
          background: "linear-gradient(135deg, #7BBDE8 0%, #BDD8E9 100%) !important",
          color: "#021F38 !important",
          fontWeight: "800",
          fontSize: small ? 11 : 12,
        }}>
          {user.username[0].toUpperCase()}
        </Avatar>
      }
      label={small ? user.username.substring(0, 8) : user.username}
      sx={{
        bgcolor: "rgba(123,189,232,0.12)",
        color: "#E8F4FD",
        fontWeight: "600",
        fontSize: small ? 12 : 13,
        border: "1px solid rgba(123,189,232,0.3)",
        borderRadius: "50px",
        "& .MuiChip-label": { px: small ? 1 : 1.5 },
      }}
    />
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #0A2A45 0%, #0D3558 60%, #0F3D66 100%)",
          borderBottom: "1px solid rgba(123,189,232,0.15)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
        }}
      >
        {/* Top accent line — same as CreatePost */}
        <Box sx={{
          height: 3,
          background: "linear-gradient(90deg, #6EA2B3, #7BBDE8, #BDD8E9)",
          opacity: 0.85,
        }} />

        <Toolbar sx={{
          py: 0.8,
          px: { xs: 2, md: 5 },
          justifyContent: "space-between",
          minHeight: { xs: "56px !important", sm: "64px !important" },
        }}>
          <LogoSection />

          {isMobile ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {user && <UserChip small />}
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{
                  bgcolor: "rgba(123,189,232,0.1)",
                  border: "1px solid rgba(123,189,232,0.25)",
                  borderRadius: "10px",
                  p: 0.7,
                  color: "#7BBDE8",
                  "&:hover": {
                    bgcolor: "rgba(123,189,232,0.2)",
                    borderColor: "rgba(123,189,232,0.5)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <MenuIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {user ? (
                <>
                  <UserChip />
                  <Box sx={{ width: "1px", height: 22, bgcolor: "rgba(123,189,232,0.2)" }} />
                  <Button
                    onClick={handleLogout}
                    sx={{
                      color: "#7BBDE8",
                      fontWeight: "600",
                      borderRadius: "12px",
                      px: 2.5,
                      py: 0.9,
                      fontSize: 13,
                      textTransform: "none",
                      border: "1px solid rgba(123,189,232,0.3)",
                      bgcolor: "rgba(123,189,232,0.08)",
                      "&:hover": {
                        bgcolor: "rgba(123,189,232,0.18)",
                        borderColor: "#7BBDE8",
                        color: "#BDD8E9",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.25s ease",
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "#7BBDE8",
                      fontWeight: "600",
                      fontSize: 14,
                      textTransform: "none",
                      px: 2,
                      borderRadius: "12px",
                      "&:hover": {
                        color: "#BDD8E9",
                        bgcolor: "rgba(123,189,232,0.08)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Login
                  </Button>

                  <Button
                    onClick={() => navigate("/signup")}
                    sx={{
                      background: "linear-gradient(135deg, #7BBDE8 0%, #BDD8E9 100%)",
                      color: "#021F38",
                      fontWeight: "700",
                      fontSize: 14,
                      borderRadius: "12px",
                      px: 3,
                      py: 0.9,
                      textTransform: "none",
                      boxShadow: "0 4px 16px rgba(123,189,232,0.35)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #BDD8E9 0%, #fff 100%)",
                        boxShadow: "0 6px 22px rgba(123,189,232,0.5)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.25s ease",
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            background: "linear-gradient(180deg, #0A2A45 0%, #0D3558 100%)",
            borderBottom: "1px solid rgba(123,189,232,0.15)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
          },
        }}
      >
        {/* Accent line at top of drawer too */}
        <Box sx={{
          height: 3,
          background: "linear-gradient(90deg, #6EA2B3, #7BBDE8, #BDD8E9)",
          opacity: 0.85,
        }} />

        <Box sx={{ px: 2.5, pt: 2, pb: 2.5 }}>
          {/* Drawer header */}
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
          }}>
            <LogoSection />
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{
                color: "#7BBDE8",
                bgcolor: "rgba(123,189,232,0.1)",
                border: "1px solid rgba(123,189,232,0.2)",
                borderRadius: "10px",
                p: 0.6,
                "&:hover": { bgcolor: "rgba(123,189,232,0.2)" },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Divider */}
          <Box sx={{ height: "1px", bgcolor: "rgba(123,189,232,0.12)", mb: 2 }} />

          <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {user ? (
              <>
                {/* User info row */}
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 0.5 }}>
                    <Avatar sx={{
                      background: "linear-gradient(135deg, #7BBDE8 0%, #BDD8E9 100%)",
                      color: "#021F38",
                      fontWeight: "800",
                      width: 36,
                      height: 36,
                      fontSize: 15,
                      boxShadow: "0 3px 10px rgba(123,189,232,0.4)",
                    }}>
                      {user.username[0].toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: "#E8F4FD", fontWeight: "700", fontSize: 14 }}>
                        {user.username}
                      </Typography>
                      <Typography sx={{ color: "#6EA2B3", fontSize: 11 }}>
                        Logged in
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>

                <ListItem disablePadding>
                  <Button
                    fullWidth
                    onClick={handleLogout}
                    sx={{
                      color: "#7BBDE8",
                      fontWeight: "600",
                      borderRadius: "12px",
                      py: 1.2,
                      fontSize: 14,
                      textTransform: "none",
                      border: "1px solid rgba(123,189,232,0.3)",
                      bgcolor: "rgba(123,189,232,0.08)",
                      justifyContent: "center",
                      "&:hover": {
                        bgcolor: "rgba(123,189,232,0.18)",
                        borderColor: "#7BBDE8",
                        color: "#BDD8E9",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Logout
                  </Button>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <Button
                    fullWidth
                    onClick={() => { navigate("/login"); setDrawerOpen(false); }}
                    sx={{
                      color: "#7BBDE8",
                      fontWeight: "600",
                      borderRadius: "12px",
                      py: 1.2,
                      fontSize: 14,
                      textTransform: "none",
                      border: "1px solid rgba(123,189,232,0.3)",
                      bgcolor: "rgba(123,189,232,0.08)",
                      "&:hover": {
                        bgcolor: "rgba(123,189,232,0.18)",
                        borderColor: "#7BBDE8",
                        color: "#BDD8E9",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Login
                  </Button>
                </ListItem>

                <ListItem disablePadding>
                  <Button
                    fullWidth
                    onClick={() => { navigate("/signup"); setDrawerOpen(false); }}
                    sx={{
                      background: "linear-gradient(135deg, #7BBDE8 0%, #BDD8E9 100%)",
                      color: "#021F38",
                      fontWeight: "700",
                      borderRadius: "12px",
                      py: 1.2,
                      fontSize: 14,
                      textTransform: "none",
                      boxShadow: "0 4px 16px rgba(123,189,232,0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #BDD8E9 0%, #fff 100%)",
                        boxShadow: "0 6px 22px rgba(123,189,232,0.45)",
                      },
                      transition: "all 0.25s ease",
                    }}
                  >
                    Sign Up
                  </Button>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;