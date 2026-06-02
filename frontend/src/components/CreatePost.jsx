import { useState } from "react";
import {
  Card, CardContent, Typography, TextField, Button,
  Box, Avatar, Alert, Chip, useMediaQuery, useTheme, Collapse, Fade
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const removeImage = () => { setImage(null); setPreview(null); };

const handleSubmit = async () => {
  if (!text.trim() && !image) {
    toast.error("Add some text or an image!");
    return;
  }
  setLoading(true);
  try {
    const formData = new FormData();
    if (text) formData.append("text", text);
    if (image) formData.append("image", image);
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, formData, {
      headers: { Authorization: `Bearer ${user.token}`, "Content-Type": "multipart/form-data" }
    });
    onPostCreated(res.data);
    toast.success("Post shared successfully! 🚀");
    setText(""); setImage(null); setPreview(null);
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong!");
  } finally {
    setLoading(false);
  }
};

  const isActive = focused || text.length > 0 || !!preview;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: { xs: 4, sm: 5 },
        mb: 3,
        // Deep navy-to-blue gradient background — no more washed out white
        background: "linear-gradient(145deg, #0A2A45 0%, #0D3558 50%, #0F3D66 100%)",
        border: isActive
          ? "1.5px solid #7BBDE8"
          : "1px solid rgba(123,189,232,0.25)",
        boxShadow: isActive
          ? "0 20px 55px rgba(0,0,0,0.45), 0 0 0 1px rgba(123,189,232,0.15)"
          : "0 10px 40px rgba(0,0,0,0.35)",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        "&:hover": {
          boxShadow: "0 22px 55px rgba(0,0,0,0.45), 0 0 30px rgba(123,189,232,0.1)",
          borderColor: "rgba(123,189,232,0.5)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>

        {/* Top accent line */}
        <Box sx={{
          height: 3,
          borderRadius: 10,
          background: "linear-gradient(90deg, #6EA2B3, #7BBDE8, #BDD8E9)",
          mb: 2.5,
          opacity: 0.85,
        }} />

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
          <Avatar
            sx={{
              background: "linear-gradient(135deg, #7BBDE8 0%, #BDD8E9 100%)",
              color: "#021F38",
              fontWeight: "800",
              width: isMobile ? 42 : 50,
              height: isMobile ? 42 : 50,
              fontSize: isMobile ? 17 : 21,
              flexShrink: 0,
              boxShadow: "0 4px 14px rgba(123,189,232,0.45)",
              border: "2px solid rgba(123,189,232,0.4)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.08)",
                boxShadow: "0 6px 20px rgba(123,189,232,0.6)",
              },
            }}
          >
            {user?.username ? user.username[0].toUpperCase() : "U"}
          </Avatar>

          <Box>
            <Typography sx={{
              color: "#E8F4FD",
              fontWeight: "700",
              fontSize: isMobile ? 15 : 17,
              letterSpacing: "0.3px",
            }}>
              {user?.username || "You"}
            </Typography>
            <Typography sx={{
              color: "#7BBDE8",
              fontSize: isMobile ? 11 : 12,
              fontWeight: "500",
            }}>
              Share something with the world ✨
            </Typography>
          </Box>
        </Box>

        {/* Error */}
        <Collapse in={!!error}>
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{
              mb: 2,
              borderRadius: 3,
              bgcolor: "rgba(198,40,40,0.15)",
              color: "#ef9a9a",
              fontWeight: "600",
              fontSize: 13,
              border: "1px solid rgba(239,154,154,0.3)",
              "& .MuiAlert-icon": { color: "#ef9a9a" },
            }}
          >
            {error}
          </Alert>
        </Collapse>

        {/* TextField */}
        <TextField
          fullWidth
          multiline
          rows={isMobile ? 2 : 3}
          placeholder="What's on your mind today?..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          sx={{
            mb: 2.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              color: "#E8F4FD",
              fontSize: isMobile ? 14 : 15,
              backgroundColor: "rgba(255,255,255,0.06)",
              transition: "all 0.3s ease",
              "& fieldset": { borderColor: "rgba(123,189,232,0.3)" },
              "&:hover fieldset": { borderColor: "rgba(123,189,232,0.6)" },
              "&.Mui-focused": {
                backgroundColor: "rgba(255,255,255,0.09)",
                boxShadow: "0 0 0 3px rgba(123,189,232,0.15)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#7BBDE8",
                borderWidth: "1.5px",
              },
            },
            "& textarea::placeholder": { color: "#6EA2B3", opacity: 1 },
          }}
        />

        {/* Image preview */}
        <Collapse in={!!preview} timeout={350}>
          {preview && (
            <Box sx={{
              mb: 2.5,
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
              border: "1.5px solid rgba(123,189,232,0.35)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            }}>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "100%",
                  maxHeight: isMobile ? 200 : 280,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <Box sx={{
                position: "absolute", top: 0, left: 0, right: 0, height: 70,
                background: "linear-gradient(180deg, rgba(2,31,56,0.6) 0%, transparent 100%)",
              }} />
              <Chip
                label="Remove"
                icon={<CloseIcon style={{ color: "#fff", fontSize: 14 }} />}
                onClick={removeImage}
                size="small"
                sx={{
                  position: "absolute", top: 10, right: 10,
                  bgcolor: "rgba(2,31,56,0.8)",
                  color: "#BDD8E9",
                  fontWeight: "600",
                  fontSize: 11,
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(123,189,232,0.3)",
                  "&:hover": { bgcolor: "#6EA2B3", color: "#fff" },
                  transition: "all 0.2s ease",
                  "& .MuiChip-icon": { ml: "6px" },
                }}
              />
            </Box>
          )}
        </Collapse>

        {/* Character count */}
        <Fade in={text.length > 0}>
          <Box sx={{ mb: 1.5, display: "flex", justifyContent: "flex-end" }}>
            <Typography sx={{
              fontSize: 11,
              color: text.length > 250 ? "#ef9a9a" : "#6EA2B3",
              fontWeight: "500",
            }}>
              {text.length} / 280
            </Typography>
          </Box>
        </Fade>

        {/* Bottom bar */}
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 1.5,
          borderTop: "1px solid rgba(123,189,232,0.15)",
        }}>
          {/* Add Photo */}
          <Button
            component="label"
            startIcon={<AddPhotoAlternateIcon sx={{ fontSize: isMobile ? 18 : 20 }} />}
            sx={{
              color: "#7BBDE8",
              fontWeight: "600",
              borderRadius: "12px",
              px: { xs: 1.5, sm: 2 },
              py: 0.9,
              fontSize: isMobile ? 12 : 13,
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
            {isMobile ? "Photo" : "Add Photo"}
            <input type="file" hidden accept="image/*" onChange={handleImage} />
          </Button>

          {/* Post Now */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || (!text.trim() && !image)}
            endIcon={!loading && <SendIcon sx={{ fontSize: isMobile ? 16 : 18 }} />}
            sx={{
              borderRadius: "12px",
              px: { xs: 2.5, sm: 3.5 },
              py: { xs: 0.9, sm: 1 },
              fontWeight: "700",
              fontSize: isMobile ? 13 : 14,
              textTransform: "none",
              // Bright gradient — proper contrast against dark card
              background: "linear-gradient(135deg, #7BBDE8 0%, #BDD8E9 100%)",
              color: "#021F38",
              boxShadow: "0 5px 20px rgba(123,189,232,0.4)",
              letterSpacing: "0.3px",
              "&:hover": {
                background: "linear-gradient(135deg, #BDD8E9 0%, #fff 100%)",
                color: "#021F38",
                boxShadow: "0 8px 28px rgba(123,189,232,0.55)",
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
            {loading ? "Posting..." : "Post Now"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;