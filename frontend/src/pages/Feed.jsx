import { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Divider, useMediaQuery, useTheme } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import axios from "axios";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import { useAuth } from "../context/AuthContext";
import { Tabs, Tab } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [search, setSearch] = useState("");
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/posts`)
      .then(res => setPosts(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handlePostCreated = (newPost) => setPosts([newPost, ...posts]);
  const handleUpdate = (postId, updates) =>
    setPosts(posts.map(p => p._id === postId ? { ...p, ...updates } : p));
  const handleDelete = (postId) => setPosts(posts.filter(p => p._id !== postId));


  const filteredPosts = posts
  .filter(p => tab === 0 ? true : p.username === user?.username)
  .filter(p =>
    p.text?.toLowerCase().includes(search.toLowerCase()) ||
    p.username?.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <Box sx={{
      background: "linear-gradient(145deg, #061828 0%, #0A2A45 40%, #0D3558 100%)",
      minHeight: "100vh",
      py: { xs: 3, sm: 5 },
      px: { xs: 1, sm: 0 },
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Glow orbs — same as Login/Signup */}
      <Box sx={{
        position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        width: { xs: 300, sm: 500 }, height: { xs: 300, sm: 500 },
        background: "radial-gradient(circle, rgba(123,189,232,0.06) 0%, transparent 70%)",
        top: "-10%", right: "-10%",
      }} />
      <Box sx={{
        position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        width: { xs: 200, sm: 350 }, height: { xs: 200, sm: 350 },
        background: "radial-gradient(circle, rgba(110,162,179,0.05) 0%, transparent 70%)",
        bottom: "-5%", left: "-5%",
      }} />

      <Container maxWidth="sm" disableGutters={isMobile} sx={{ position: "relative", zIndex: 1 }}>

        {/* CreatePost */}
        <Box sx={{ px: { xs: 2, sm: 0 } }}>
          {user && <CreatePost onPostCreated={handlePostCreated} />}
        </Box>

        {/* Feed header */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 4,
          mt: user ? 2 : 4,
          px: { xs: 2, sm: 0 },
        }}>
          <AutoAwesomeIcon sx={{
            color: "#7BBDE8",
            fontSize: isMobile ? 20 : 26,
          }} />
          <Typography sx={{
            fontWeight: "700",
            color: "#E8F4FD",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontSize: { xs: 13, sm: 15 },
          }}>
            Public Feed
          </Typography>
          <Divider sx={{
            flex: 1, ml: 1,
            borderColor: "rgba(123,189,232,0.15)",
            borderWidth: "1px",
          }} />
        </Box>

        <Box sx={{
  bgcolor: "rgba(255,255,255,0.05)",
  borderRadius: "12px",
  p: 0.5,
  display: "flex",
  mb: 3,
  border: "1px solid rgba(123,189,232,0.15)"
}}>
  <Box onClick={() => setTab(0)} sx={{
    flex: 1, textAlign: "center", py: 1, borderRadius: "10px", cursor: "pointer",
    bgcolor: tab === 0 ? "linear-gradient(135deg, #7BBDE8, #BDD8E9)" : "transparent",
    background: tab === 0 ? "linear-gradient(135deg, #7BBDE8, #BDD8E9)" : "transparent",
    color: tab === 0 ? "#021F38" : "#6EA2B3",
    fontWeight: "700", fontSize: 14, transition: "all 0.3s ease"
  }}>
    All Posts
  </Box>
  <Box onClick={() => setTab(1)} sx={{
    flex: 1, textAlign: "center", py: 1, borderRadius: "10px", cursor: "pointer",
    background: tab === 1 ? "linear-gradient(135deg, #7BBDE8, #BDD8E9)" : "transparent",
    color: tab === 1 ? "#021F38" : "#6EA2B3",
    fontWeight: "700", fontSize: 14, transition: "all 0.3s ease"
  }}>
    My Posts
  </Box>
</Box>

<Box sx={{
  display: "flex", alignItems: "center",
  bgcolor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(123,189,232,0.2)",
  borderRadius: "12px", px: 2, mb: 2,
}}>
  <SearchIcon sx={{ color: "#6EA2B3", mr: 1 }} />
  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search posts or users..."
    style={{
      flex: 1, border: "none", outline: "none",
      background: "transparent",
      color: "#E8F4FD", fontSize: 14,
      padding: "12px 0", fontFamily: "inherit",
      caretColor: "#E8F4FD",
    }}
  />
  {search && (
    <IconButton size="small" onClick={() => setSearch("")}
      sx={{ color: "#6EA2B3" }}>
      <CloseIcon sx={{ fontSize: 16 }} />
    </IconButton>
  )}
</Box>

        {/* Loading */}
        {loading ? (
          <Box sx={{
            display: "flex", justifyContent: "center",
            alignItems: "center", mt: 12,
          }}>
            <CircularProgress
              size={isMobile ? 38 : 48}
              thickness={4}
              sx={{ color: "#7BBDE8" }}
            />
          </Box>

        ) : posts.length === 0 ? (

          /* Empty state */
          <Box sx={{
            textAlign: "center",
            mt: 10, p: 4,
            borderRadius: "20px",
            background: "rgba(123,189,232,0.05)",
            border: "1px dashed rgba(123,189,232,0.3)",
            mx: { xs: 2, sm: 0 },
          }}>
            <Typography sx={{ fontSize: isMobile ? 48 : 58, mb: 1 }}>✨</Typography>
            <Typography sx={{
              fontWeight: "700", fontSize: { xs: 17, sm: 20 },
              color: "#E8F4FD", mb: 0.8,
            }}>
              No posts yet!
            </Typography>
            <Typography sx={{
              color: "#6EA2B3", fontSize: { xs: 13, sm: 14 },
              fontWeight: "500",
            }}>
              Be the first one to share something awesome!
            </Typography>
          </Box>

        ) : (

          /* Posts list */
          <Box sx={{
            display: "flex", flexDirection: "column",
            gap: 3, px: { xs: 2, sm: 0 },
          }}>
{filteredPosts.length === 0 ? (
  <Box textAlign="center" mt={6}>
    <Typography fontSize={50}>🔍</Typography>
    <Typography variant="h6" fontWeight="bold" sx={{ color: "#E8F4FD", mt: 1 }}>
      No posts found!
    </Typography>
    <Typography sx={{ color: "#6EA2B3", mt: 0.5 }}>
      Try searching something else...
    </Typography>
  </Box>
) : (
  filteredPosts.map(post => (
    <PostCard key={post._id} post={post} onUpdate={handleUpdate} onDelete={handleDelete} />
  ))
)}
          </Box>
        )}

      </Container>
    </Box>
  );
};

export default Feed;