import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { getToken } from "../services/Localstorage";

const Navbar = () => {
  const { access_token } = getToken();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(to right, #6a11cb, #2575fc)", // Gradient Background
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "white" }}
          >
            AttendX
          </Typography>

          <Button
            component={NavLink}
            to="/"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "",
              borderRadius: "8px",
            })}
            sx={{
              color: "white",
              textTransform: "none",
              mx: 1,
              px: 2,
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            }}
          >
            Home
          </Button>

          <Button
            component={NavLink}
            to="/contact"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "",
              borderRadius: "8px",
            })}
            sx={{
              color: "white",
              textTransform: "none",
              mx: 1,
              px: 2,
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            }}
          >
            Contact
          </Button>

          {access_token ? (
            <Button
              component={NavLink}
              to="/dashboard"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "",
                borderRadius: "8px",
              })}
              sx={{
                color: "white",
                textTransform: "none",
                mx: 1,
                px: 2,
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              component={NavLink}
              to="/login"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "",
                borderRadius: "8px",
              })}
              sx={{
                color: "white",
                textTransform: "none",
                mx: 1,
                px: 2,
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              Login / Register
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
