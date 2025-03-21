import { Grid, Card, Tabs, Typography, Tab, Box } from "@mui/material";
import { useState } from "react";
import Registration from "./Registration";
import UserLogin from "./UserLogin";
import { EventAvailable } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ width: "100%" }}>{children}</Box>}
    </div>
  );
};

const LoginReg = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <Grid container sx={{ height: "100vh", overflow: "hidden" }}>
      {/* Left Panel (Text Section) */}
      <Grid
        item
        lg={7}
        sm={5}
        sx={{
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "40px",
          height: "100vh",
          gap: "20px", // Better spacing
        }}
      >
        <EventAvailable sx={{ fontSize: 120, color: "white" }} />
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          Welcome to AttendX
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: "70%", opacity: 0.9 }}>
          Manage and track attendance effortlessly with our smart system.
        </Typography>
      </Grid>

      {/* Right Panel (Login/Register Card) */}
      <Grid item lg={5} sm={7} xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card
          sx={{
            width: "80%",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "500px", // Adjusted for better balance
            maxHeight: "600px",
          }}
        >
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                textColor="secondary"
                indicatorColor="secondary"
                onChange={handleChange}
                sx={{ mb: 2 }}
              >
                <Tab label="Login" sx={{ textTransform: "none", fontWeight: "bold" }} />
                <Tab label="Register" sx={{ textTransform: "none", fontWeight: "bold" }} />
              </Tabs>
            </Box>

            {/* Login and Registration Components */}
            <TabPanel value={value} index={0}>
              <UserLogin onLoginSuccess={handleLoginSuccess} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Registration />
            </TabPanel>
          </Box>

          {/* Branding (Logo & Name at Bottom) */}
          <Box textAlign="center">
            <EventAvailable
              sx={{
                fontSize: 70,
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AttendX
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LoginReg;
