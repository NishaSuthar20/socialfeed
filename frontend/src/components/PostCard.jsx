import { useState, useEffect } from "react";
import {
  Card, CardContent, CardMedia, Typography, Box, IconButton,
  Button, Avatar, Collapse, Divider, useMediaQuery, useTheme,
  Dialog, DialogContent, Tooltip
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import ShareIcon from "@mui/icons-material/Share";

const PostCard = ({ post, onUpdate, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [focusedComment, setFocusedComment] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const isLiked = user && post.likes.includes(user.username);
  const isOwner = user && user.username === post.username;

  const colors = ["#6EA2B3", "#7BBDE8", "#5A8A9D", "#89C2E8", "#4D7A89", "#5D9CB8"];
  const avatarColor = colors[post.username.charCodeAt(0) % colors.length];

  const handleLike = async () => {
    if (!user) return;
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}/like`, {},
        { headers: { Authorization: `Bearer ${user.token}` } });
      onUpdate(post._id, { likes: res.data.likes });
    } catch (err) { console.log(err); }
  };

  // Double click pe like + heart animation
  const handleDoubleClick = () => {
    if (!user) return;
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 1000);
    if (!isLiked) handleLike();
  };

  const handleComment = async () => {
    if (!commentText.trim() || !user) return;
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${user.token}` } });
      onUpdate(post._id, { comments: res.data.comments });
      setCommentText("");
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}`,
      { headers: { Authorization: `Bearer ${user.token}` } });
    onDelete(post._id);
    toast.success("Post deleted successfully!");
  } catch (err) {
    toast.error("Failed to delete post!");
    console.log(err);
  }
};

  return (
    <>
      <style>{`
        @keyframes likePopAnim {
          0% { transform: scale(1); }
          40% { transform: scale(1.45); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heartBounce {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          30% { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
          60% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
          80% { transform: translate(-50%, -50%) scale(1.25); opacity: 0.9; }
          100% { transform: translate(-50%, -60%) scale(0.8); opacity: 0; }
        }
        @keyframes deleteShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .post-card-anim { animation: fadeSlideIn 0.4s ease forwards; }
        .like-pop { animation: likePopAnim 0.4s ease forwards; }
        .heart-bounce {
          position: absolute;
          top: 50%; left: 50%;
          font-size: 90px;
          pointer-events: none;
          z-index: 99;
          animation: heartBounce 0.9s ease forwards;
          filter: drop-shadow(0 0 20px rgba(240,98,146,0.8));
        }
        .comment-input::placeholder { color: #6EA2B3; opacity: 1; }
        .comment-scrollbar::-webkit-scrollbar { width: 4px; }
        .comment-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .comment-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(123,189,232,0.2);
          border-radius: 10px;
        }
        .delete-btn:hover { animation: deleteShake 0.3s ease; }
      `}</style>

      {/* Full Image Dialog */}
      <Dialog
  open={deleteConfirm}
  onClose={() => setDeleteConfirm(false)}
  PaperProps={{
    sx: {
      background: "linear-gradient(145deg, #0A2A45, #0F3D66)",
      border: "1px solid rgba(240,98,146,0.3)",
      borderRadius: "20px",
      p: 1,
      minWidth: { xs: "280px", sm: "340px" },
      boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
    }
  }}
>
  <DialogContent sx={{ p: 3, textAlign: "center" }}>
    {/* Icon */}
    <Box sx={{
      width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
      background: "rgba(240,98,146,0.15)",
      border: "2px solid rgba(240,98,146,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <DeleteIcon sx={{ fontSize: 30, color: "#f06292" }} />
    </Box>

    <Typography color="#E8F4FD" fontWeight="800" fontSize={20} mb={1}>
      Delete Post?
    </Typography>
    <Typography color="#6EA2B3" fontSize={14} mb={3} lineHeight={1.6}>
      This action cannot be undone. Your post will be permanently removed.
    </Typography>

    <Box display="flex" gap={2}>
      <Button fullWidth variant="outlined"
        onClick={() => setDeleteConfirm(false)}
        sx={{
          borderColor: "rgba(123,189,232,0.3)",
          color: "#7BBDE8", borderRadius: "12px",
          py: 1.2, fontWeight: "700", textTransform: "none",
          "&:hover": {
            borderColor: "#7BBDE8",
            bgcolor: "rgba(123,189,232,0.08)"
          }
        }}>
        Cancel
      </Button>
      <Button fullWidth variant="contained"
        onClick={() => { handleDelete(); setDeleteConfirm(false); }}
        sx={{
          background: "linear-gradient(135deg, #e91e63, #c2185b)",
          borderRadius: "12px", py: 1.2,
          fontWeight: "700", textTransform: "none",
          boxShadow: "0 4px 15px rgba(233,30,99,0.4)",
          "&:hover": {
            background: "linear-gradient(135deg, #c2185b, #880e4f)",
            boxShadow: "0 6px 20px rgba(233,30,99,0.5)",
            transform: "translateY(-1px)"
          },
          transition: "all 0.2s ease"
        }}>
        Delete
      </Button>
    </Box>
  </DialogContent>
</Dialog>

      <Card
        elevation={0}
        className="post-card-anim"
        sx={{
          borderRadius: { xs: "16px", sm: "20px" },
          mb: { xs: 2, sm: 3 },
          background: "linear-gradient(145deg, #0A2A45 0%, #0D3558 50%, #0F3D66 100%)",
          border: "1px solid rgba(123,189,232,0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
          overflow: "hidden",
          "&:hover": {
            transform: isMobile ? "none" : "translateY(-3px)",
            boxShadow: "0 16px 45px rgba(0,0,0,0.4)",
            borderColor: "rgba(123,189,232,0.35)",
          },
        }}
      >
        {/* Top accent line */}
        <Box sx={{
          height: "2px",
          background: "linear-gradient(90deg, #6EA2B3, #7BBDE8, #BDD8E9)",
          opacity: 0.7,
        }} />

        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 }, mb: 2 }}>
            <Avatar sx={{
              bgcolor: avatarColor, fontWeight: "700",
              width: { xs: 38, sm: 46 }, height: { xs: 38, sm: 46 },
              fontSize: { xs: 14, sm: 18 },
              border: "2px solid rgba(123,189,232,0.3)",
              boxShadow: "0 3px 10px rgba(0,0,0,0.2)", flexShrink: 0,
            }}>
              {post.username[0].toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{
                fontWeight: "700", fontSize: { xs: 14, sm: 15 },
                color: "#E8F4FD", overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {post.username}
              </Typography>
              <Typography sx={{ fontSize: { xs: 10, sm: 11 }, color: "#6EA2B3", fontWeight: "500" }}>
                {new Date(post.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })}
              </Typography>
            </Box>

            {/* Delete button - sirf owner ko dikhega */}
            {isOwner && (
              <Tooltip title="Delete post" placement="top">
                <IconButton
                  className="delete-btn"
                  onClick={() => setDeleteConfirm(true)}
                  size="small"
                  sx={{
                    color: "rgba(240,98,146,0.5)",
                    "&:hover": {
                      color: "#f06292",
                      bgcolor: "rgba(240,98,146,0.12)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Post text - double click to like */}
          {post.text && (
            <Box onDoubleClick={handleDoubleClick} sx={{ position: "relative", cursor: "pointer" }}>
              {heartAnim && !post.image && <span className="heart-bounce">❤️</span>}
              <Typography sx={{
                lineHeight: 1.75, fontSize: { xs: 13, sm: 15 },
                color: "#C8E0EF", mb: 2, wordBreak: "break-word",
                userSelect: "none",
              }}>
                {post.text}
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Image - click to open, double click to like */}
        {post.image && (
          <Box sx={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
            onClick={() => setImageOpen(true)}
            onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(); }}
          >
            {heartAnim && <span className="heart-bounce">❤️</span>}
            <CardMedia
              component="img"
              image={`${import.meta.env.VITE_API_URL}/uploads/${post.image}`}
              alt="post"
              sx={{
                maxHeight: { xs: 240, sm: 380 },
                objectFit: "cover", width: "100%",
                transition: "transform 0.4s ease",
                "&:hover": { transform: "scale(1.02)" },
              }}
            />
            <Box sx={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
              background: "linear-gradient(0deg, rgba(10,42,69,0.6) 0%, transparent 100%)",
              pointerEvents: "none",
            }} />
            {/* Click to expand hint */}
            <Box sx={{
              position: "absolute", top: 10, right: 10,
              bgcolor: "rgba(0,0,0,0.45)", borderRadius: 2,
              px: 1, py: 0.3,
              opacity: 0, transition: "opacity 0.3s",
              ".MuiCard-root:hover &": { opacity: 1 },
            }}>
              <Typography sx={{ fontSize: 10, color: "white" }}>🔍 Click to expand</Typography>
            </Box>
          </Box>
        )}

        <CardContent sx={{ px: { xs: 2, sm: 3 }, pt: 1.5, pb: "12px !important" }}>
          {(post.likes.length > 0 || post.comments.length > 0) && (
            <Box sx={{ display: "flex", gap: 2, mb: 1.2 }}>
              {post.likes.length > 0 && (
                <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: "#6EA2B3", fontWeight: "500" }}>
                  ❤️ {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
                </Typography>
              )}
              {post.comments.length > 0 && (
                <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: "#6EA2B3", fontWeight: "500" }}>
                  💬 {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
                </Typography>
              )}
            </Box>
          )}

          <Divider sx={{ borderColor: "rgba(123,189,232,0.12)", mb: 1 }} />

          {/* Action buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={handleLike}
              startIcon={
                <Box className={likeAnim ? "like-pop" : ""} sx={{ display: "flex" }}>
                  {isLiked
                    ? <FavoriteIcon sx={{ fontSize: { xs: 17, sm: 19 }, color: "#f06292" }} />
                    : <FavoriteBorderIcon sx={{ fontSize: { xs: 17, sm: 19 }, color: "#6EA2B3" }} />
                  }
                </Box>
                
              }

              

              sx={{
                flex: 1, borderRadius: "10px", py: { xs: 0.7, sm: 1 },
                fontSize: { xs: 12, sm: 13 }, fontWeight: "600", textTransform: "none",
                color: isLiked ? "#f06292" : "#6EA2B3",
                bgcolor: isLiked ? "rgba(240,98,146,0.08)" : "transparent",
                border: "1px solid",
                borderColor: isLiked ? "rgba(240,98,146,0.25)" : "rgba(123,189,232,0.15)",
                transition: "all 0.25s ease",
                "&:hover": {
                  bgcolor: isLiked ? "rgba(240,98,146,0.15)" : "rgba(123,189,232,0.1)",
                  borderColor: isLiked ? "rgba(240,98,146,0.4)" : "rgba(123,189,232,0.35)",
                },
              }}
            >
              {isLiked ? "Liked" : "Like"}
            </Button>

            <Button
  onClick={() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied! 🔗");
  }}
  startIcon={<ShareIcon sx={{ fontSize: { xs: 17, sm: 19 }, color: "#6EA2B3" }} />}
  sx={{
    flex: 1, borderRadius: "10px", py: { xs: 0.7, sm: 1 },
    fontSize: { xs: 12, sm: 13 }, fontWeight: "600", textTransform: "none",
    color: "#6EA2B3",
    bgcolor: "transparent",
    border: "1px solid rgba(123,189,232,0.15)",
    transition: "all 0.25s ease",
    "&:hover": {
      bgcolor: "rgba(123,189,232,0.1)",
      borderColor: "rgba(123,189,232,0.35)",
      color: "#7BBDE8",
    },
  }}
>
  Share
</Button>

            <Button onClick={() => setShowComments(!showComments)}
              startIcon={
                <ChatBubbleOutlinedIcon sx={{
                  fontSize: { xs: 17, sm: 19 },
                  color: showComments ? "#7BBDE8" : "#6EA2B3",
                }} />
              }
              sx={{
                flex: 1, borderRadius: "10px", py: { xs: 0.7, sm: 1 },
                fontSize: { xs: 12, sm: 13 }, fontWeight: "600", textTransform: "none",
                color: showComments ? "#7BBDE8" : "#6EA2B3",
                bgcolor: showComments ? "rgba(123,189,232,0.1)" : "transparent",
                border: "1px solid",
                borderColor: showComments ? "rgba(123,189,232,0.35)" : "rgba(123,189,232,0.15)",
                transition: "all 0.25s ease",
                "&:hover": {
                  bgcolor: "rgba(123,189,232,0.1)",
                  borderColor: "rgba(123,189,232,0.35)",
                  color: "#7BBDE8",
                },
              }}
            >
              Comment
            </Button>
          </Box>

          {/* Comments section */}
          <Collapse in={showComments} timeout={300}>
            <Box sx={{ mt: 2 }}>
              {user && (
                <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}>
                  <Avatar sx={{
                    bgcolor: avatarColor,
                    width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 },
                    fontSize: { xs: 11, sm: 12 }, flexShrink: 0,
                    border: "1.5px solid rgba(123,189,232,0.3)",
                  }}>
                    {user.username[0].toUpperCase()}
                  </Avatar>
                  <Box sx={{
                    flex: 1, display: "flex", alignItems: "center",
                    bgcolor: "rgba(255,255,255,0.06)",
                    border: focusedComment ? "1.5px solid #7BBDE8" : "1px solid rgba(123,189,232,0.2)",
                    borderRadius: "12px", px: 1.5,
                    transition: "all 0.3s ease",
                    boxShadow: focusedComment ? "0 0 0 3px rgba(123,189,232,0.12)" : "none",
                  }}>
                    <input
                      className="comment-input"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onFocus={() => setFocusedComment(true)}
                      onBlur={() => setFocusedComment(false)}
                      onKeyPress={(e) => e.key === "Enter" && handleComment()}
                      placeholder="Write a comment..."
                      style={{
                        flex: 1, border: "none", outline: "none",
                        background: "transparent",
                        WebkitBoxShadow: "0 0 0 1000px #0f3d5e inset",
                        WebkitTextFillColor: "#E8F4FD",
                        caretColor: "#E8F4FD", color: "#E8F4FD",
                        fontSize: isMobile ? 13 : 14,
                        padding: "10px 0", fontFamily: "inherit", width: "100%",
                      }}
                    />
                  </Box>
                  <IconButton onClick={handleComment}
                    disabled={loading || !commentText.trim()}
                    sx={{
                      background: commentText.trim()
                        ? "linear-gradient(135deg, #7BBDE8 0%, #BDD8E9 100%)"
                        : "rgba(123,189,232,0.1)",
                      color: commentText.trim() ? "#021F38" : "#6EA2B3",
                      width: { xs: 34, sm: 38 }, height: { xs: 34, sm: 38 },
                      borderRadius: "10px", flexShrink: 0,
                      border: "1px solid rgba(123,189,232,0.2)",
                      transition: "all 0.25s ease",
                      "&:hover": { background: "linear-gradient(135deg, #BDD8E9, #fff)", transform: "scale(1.05)" },
                      "&:disabled": { background: "rgba(123,189,232,0.08)", color: "rgba(123,189,232,0.3)" },
                    }}
                  >
                    <SendIcon sx={{ fontSize: { xs: 15, sm: 17 } }} />
                  </IconButton>
                </Box>
              )}

              <Box className="comment-scrollbar" sx={{ maxHeight: { xs: 200, sm: 280 }, overflowY: "auto" }}>
                {post.comments.map((c, i) => {
                  const isOwnComment = c.username === user?.username;
                  return (
                    <Box key={i} sx={{
                      display: "flex", gap: 1, mb: 1.5, alignItems: "flex-start",
                      flexDirection: isOwnComment ? "row-reverse" : "row",
                      animation: "fadeSlideIn 0.3s ease forwards",
                    }}>
                      <Avatar sx={{
                        bgcolor: colors[c.username.charCodeAt(0) % colors.length],
                        width: { xs: 24, sm: 28 }, height: { xs: 24, sm: 28 },
                        fontSize: { xs: 10, sm: 11 }, flexShrink: 0,
                        border: "1.5px solid rgba(123,189,232,0.2)",
                      }}>
                        {c.username[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{
                        background: isOwnComment
                          ? "linear-gradient(135deg, #7BBDE8 0%, #BDD8E9 100%)"
                          : "rgba(255,255,255,0.07)",
                        border: isOwnComment ? "none" : "1px solid rgba(123,189,232,0.15)",
                        borderRadius: isOwnComment ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                        px: { xs: 1.5, sm: 2 }, py: { xs: 0.8, sm: 1 }, maxWidth: "78%",
                      }}>
                        <Typography sx={{
                          fontSize: { xs: 10, sm: 11 }, fontWeight: "700",
                          color: isOwnComment ? "#021F38" : "#7BBDE8", mb: 0.3,
                        }}>
                          {c.username}
                        </Typography>
                        <Typography sx={{
                          fontSize: { xs: 12, sm: 13 },
                          color: isOwnComment ? "#021F38" : "#C8E0EF",
                          wordBreak: "break-word", lineHeight: 1.5,
                        }}>
                          {c.text}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </>
  );
};

export default PostCard;