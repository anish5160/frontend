import { Grid, Typography, Button, Box, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CheckCircle, RocketLaunch, CalendarMonth, Analytics } from "@mui/icons-material";
import { keyframes } from "@emotion/react";

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleGetStarted = () => navigate("/login");

  return (
    <Grid container sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      color: "white",
      position: "relative",
      overflow: "hidden",
      py: 8,
      px: 2
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: 0.1,
        background: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          ${theme.palette.primary.main} 10px,
          ${theme.palette.primary.main} 20px
        )`
      }} />

      <Grid container item xs={12} lg={10} sx={{ mx: "auto", zIndex: 1 }}>
        <Grid item xs={12} md={6} sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pr: isMobile ? 0 : 6,
          textAlign: isMobile ? "center" : "left"
        }}>
          <Typography variant="h1" sx={{
            fontWeight: 800,
            fontSize: isMobile ? "2.5rem" : "4rem",
            lineHeight: 1.2,
            mb: 2
          }}>
            Transform Your Attendance Management
            <Box component="span" sx={{ color: "primary.main" }}>.</Box>
          </Typography>

          <Typography variant="subtitle1" sx={{
            fontSize: "1.2rem",
            mb: 4,
            opacity: 0.9
          }}>
            AI-powered attendance tracking with real-time analytics and seamless organization management
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              endIcon={<RocketLaunch />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: 2,
                background: "linear-gradient(45deg, #4facfe, #00f2fe)",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  background: "linear-gradient(45deg, #43a4fe, #00e2fe)"
                }
              }}
            >
              Get Started Now
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ mt: 6 }}>
            {[
              { icon: <CheckCircle />, text: "Real-time Tracking" },
              { icon: <CalendarMonth />, text: "Smart Scheduling" },
              { icon: <Analytics />, text: "Advanced Analytics" }
            ].map((feature, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  background: "rgba(255,255,255,0.1)",
                  p: 2,
                  borderRadius: 2,
                  backdropFilter: "blur(10px)"
                }}>
                  <Box sx={{ color: "primary.main", fontSize: "2rem" }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="body1">{feature.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {!isMobile && (
          <Grid item xs={12} md={6} sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            <Box sx={{
              width: "100%",
              maxWidth: 600,
              height: 500,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              position: "relative",
              animation: `${float} 6s ease-in-out infinite`
            }}>
              {/* Add your 3D illustration or relevant image here */}
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Floating Particles */}
      {[...Array(20)].map((_, index) => (
        <Box key={index} sx={{
          position: "absolute",
          width: 8,
          height: 8,
          background: "rgba(255,255,255,0.3)",
          borderRadius: "50%",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `${float} ${5 + Math.random() * 10}s infinite`
        }} />
      ))}
    </Grid>
  );
};

export default Home;