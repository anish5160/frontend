import { 
  Button, CssBaseline, Grid, Typography, TextField, Container, 
  MenuItem, Select, FormControl, InputLabel, Box, Paper, 
  List, ListItem, ListItemText, ListItemSecondaryAction, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Skeleton, Alert
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { 
  Today as TodayIcon,
  Logout as LogoutIcon,
  AddCircle as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  Refresh as ClearIcon
} from "@mui/icons-material";
import { unsetUserToken } from "../features/authSlice";
import { unsetUserInfo, setUserInfo } from "../features/userSlice";
import { removeToken, getToken } from "../services/Localstorage";
import { useGetLoggedUserQuery } from "../services/userAuthApi";
import { useGetAttendanceQuery, useMarkAttendanceMutation, useDeleteAttendanceMutation } from "../services/attendanceApi";
import Navbar from "../components/Navbar";
import ChangePassword from './auth/ChangePassword';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTheme, alpha} from "@mui/material";
const STATUS_COLORS = {
  Present: '#4CAF50',  // Fresh green
  Absent: '#F44336',   // Vibrant red
  Clear: '#607D8B'  }   // Professional blue-grey
const AttendanceCalendar = ({ calendarData }) => {
  const theme = useTheme();

  // Add proper status color mapping with fallback
  const getStatusColor = (status) => {
    if (!status) return theme.palette.grey[400];
    const normalizedStatus = status.toLowerCase();
    return {
      present: '#4CAF50',
      absent: '#F44336',
      clear: '#607D8B'
    }[normalizedStatus] || theme.palette.grey[400]; // Fallback color
  };

  const getTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const dailyData = calendarData[dateStr] || {};
    
console.log(`Data for ${dateStr}:`, dailyData);

  
    return (
      <Box sx={{
        p: 1,
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {Object.entries(dailyData).map(([subject, status]) => {
          const color = getStatusColor(status);
          return (
            <Box
              key={subject}
              sx={{
                width: '100%',
                py: 0.5,
                px: 1,
                bgcolor: color, 
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                transition: 'all 0.2s',
                border: `2px solid ${color}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 0 8px ${color}`
                }
              }}
            >
              <Box sx={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                bgcolor: theme.palette.getContrastText(color)
              }} />
              <Typography variant="caption" sx={{ 
                fontWeight: 600,
                color: theme.palette.getContrastText(color)
              }}>
                {subject}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };
  
  return (
    <Paper sx={{
      p: 3,
      mb: 4,
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`
    }}>
      <Box sx={{ 
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <TodayIcon sx={{ color: 'primary.main', fontSize: '32px' }} />
          Attendance Calendar
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <Box key={status} sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: '4px',
              bgcolor: alpha(color, 0.1)
            }}>
              <Box sx={{ 
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                bgcolor: color 
              }} />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {status}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Calendar
        tileContent={getTileContent}
        className="professional-calendar"
        tileClassName={({ date }) => 
          date.toDateString() === new Date().toDateString() ? 'current-day' : ''
        }
        navigationLabel={({ date }) => (
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Typography>
        )}
      />

      <style>{`
        .professional-calendar {
          border: none;
          width: 100%;
          background: transparent;
        }

        .professional-calendar .react-calendar__tile {
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }

        .professional-calendar .react-calendar__tile:enabled:hover {
          background: ${alpha(theme.palette.primary.main, 0.05)};
          border-color: ${theme.palette.primary.light};
        }

        .professional-calendar .react-calendar__tile--now {
          background: ${alpha(theme.palette.primary.main, 0.1)};
          border: 1px solid ${theme.palette.primary.main};
        }

        .professional-calendar .react-calendar__navigation button {
          background: none;
          color: ${theme.palette.text.primary};
          min-width: 44px;
          padding: 8px 12px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .professional-calendar .react-calendar__navigation button:enabled:hover {
          background: ${alpha(theme.palette.primary.main, 0.1)};
        }

        .professional-calendar .react-calendar__month-view__weekdays {
          font-weight: 500;
          color: ${theme.palette.text.secondary};
          margin-bottom: 8px;
        }
      `}</style>
    </Paper>
  );
};




const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access_token } = getToken() || {};
  const today = new Date().toISOString().split("T")[0];

  // API Hooks
  const { data: userDataFromApi, isSuccess, refetch: refetchUser } = useGetLoggedUserQuery(access_token);
  const { data: attendanceData = {}, isLoading, error, refetch: refetchAttendance } = useGetAttendanceQuery();
  
  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();
  const [deleteAttendance] = useDeleteAttendanceMutation();

  // State Management
  const [userData, setUserData] = useState({ email: "", name: "" });
  const [subjects, setSubjects] = useState({});
  const [newSubject, setNewSubject] = useState("");
  const [attendanceForm, setAttendanceForm] = useState({
    subject: "General",
    date: today,
    status: "Present",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (access_token) {
      refetchUser();
      refetchAttendance();
    }
  }, [access_token, refetchUser, refetchAttendance]);

  useEffect(() => {
    if (userDataFromApi && isSuccess) {
      const userInfo = { 
        email: userDataFromApi.email, 
        name: userDataFromApi.name 
      };
      setUserData(userInfo);
      dispatch(setUserInfo(userInfo));
    }
  }, [userDataFromApi, isSuccess, dispatch]);

  useEffect(() => {
    if (attendanceData?.attendance_percentage_per_subject) {
      const attendancePercentages = Object.values(attendanceData.attendance_percentage_per_subject);
      const totalPercentage = attendancePercentages.reduce((sum, value) => sum + (value || 0), 0);
      console.log("Total Attendance Percentage:", totalPercentage);
  
      // Convert object data into a structured format
      const formattedData = Object.entries(attendanceData.attendance_percentage_per_subject).reduce(
        (acc, [subject, percentage]) => {
          acc[subject] = percentage || 0;
          return acc;
        },
        {}
      );
  
      setSubjects(formattedData);
    }
  }, [attendanceData]);
  
  // Log updated state properly
  useEffect(() => {
    console.log("Updated subjects state:", subjects);
  }, [subjects]);
  

  const handleLogout = () => {
    removeToken();
    dispatch(unsetUserInfo({ name: "", email: "" }));
    dispatch(unsetUserToken({ access_token: "" }));
    navigate("/login", { replace: true });
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
  
    if (!attendanceForm.subject?.trim() || !attendanceForm.date || !attendanceForm.status) {
      alert("❌ Please fill all required fields");
      return;
    }
  
    // Ensure date format is correct (YYYY-MM-DD)
    const formattedDate = new Date(new Date(attendanceForm.date + 'T00:00:00Z').setDate(new Date(attendanceForm.date + 'T00:00:00Z').getDate() - 1))
  .toISOString()
  .split('T')[0];
    const payload = {
      attendance: [{
        subject: attendanceForm.subject.trim(),
        date: formattedDate,
        status: attendanceForm.status.toLowerCase()
      }]
    };
  
    console.log("📤 Sending Payload:", JSON.stringify(payload, null, 2)); // Debugging log
  
    try {
      const response = await markAttendance(payload).unwrap();
      console.log("✅ Response Data:", response); // Debugging log
  
      alert("✅ Attendance submitted successfully!");
      setAttendanceForm({ subject: "General", date: formattedDate, status: "Present" });
      refetchAttendance();
    } catch (err) {
      console.error("❌ Operation failed:", err);
      console.log("🛠️ Full Error Response:", err.data); // Debugging log
  
      const errorMessage = err.data?.errors || err.data?.error || 'Please try again';
      alert(`❌ Error: ${JSON.stringify(errorMessage)}`);
    }
  };
  

  const handleDeleteAttendance = async (subject) => {
    if (!subject) return;
    try {
      await deleteAttendance(subject).unwrap();
      refetchAttendance();
      setDeleteConfirm(null);
      alert("✅ Attendance records deleted successfully!");
    } catch (err) {
      console.error("Deletion error:", err);
      alert("❌ Failed to delete records");
    }
  };

  const handleAddSubject = () => {
    const subjectName = newSubject.trim();
    if (!subjectName) return;
    setSubjects(prev => ({ ...prev, [subjectName]: 0 }));
    setNewSubject("");
  };

  return (
    <>
      <Navbar />
      <CssBaseline />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Profile Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            👤 User Profile
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Email: <Box component="span" color="text.primary">{userData.email}</Box>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Name: <Box component="span" color="text.primary">{userData.name}</Box>
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Calendar Section */}
        {attendanceData?.attendance_calendar && (
          <AttendanceCalendar calendarData={attendanceData.attendance_calendar} />
        )}

        {/* Attendance Dashboard */}
        {/* Attendance Dashboard Section */}
<Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
    📈 Attendance Overview
  </Typography>

  {isLoading ? (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} variant="rectangular" width="100%" height={60} />
      ))}
    </Box>
  ) : error ? (
    <Alert severity="error" sx={{ mb: 2 }}>
      Failed to load attendance data
    </Alert>
  ) : Object.keys(subjects).length > 0 ? (
    <List sx={{ bgcolor: 'background.paper' }}>
      {Object.keys(subjects).map((subject) => (
        <div key={subject}>
          <ListItem>
            <ListItemText
              primary={subject}
              primaryTypographyProps={{ variant: 'h6' }}
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteConfirm(subject)}
              >
                Delete
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="middle" component="li" />
        </div>
      ))}
    </List>
  ) : (
    <Alert severity="info" sx={{ mt: 2 }}>
      No attendance records found
    </Alert>
  )}

  <Box sx={{ mt: 4, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
    <TextField
      fullWidth
      label="New Subject"
      value={newSubject}
      onChange={(e) => setNewSubject(e.target.value)}
      margin="normal"
      variant="outlined"
      InputProps={{
        endAdornment: (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddSubject}
            disabled={!newSubject.trim()}
            sx={{ ml: 2 }}
          >
            Add
          </Button>
        )
      }}
    />
  </Box>
</Paper>

        {/* Mark Attendance Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            🗓️ Daily Attendance
          </Typography>

          <Box component="form" onSubmit={handleMarkAttendance} sx={{ maxWidth: 500, mx: 'auto' }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Subject</InputLabel>
              <Select
                value={attendanceForm.subject}
                onChange={(e) => setAttendanceForm(prev => ({
                  ...prev,
                  subject: e.target.value
                }))}
                required
                variant="outlined"
              >
                {Object.keys(subjects).map((subject) => (
                  <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              label="Date"
              value={attendanceForm.date}
              onChange={(e) => setAttendanceForm(prev => ({
                ...prev,
                date: e.target.value
              }))}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: today }}
              variant="outlined"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={attendanceForm.status}
                onChange={(e) => setAttendanceForm(prev => ({
                  ...prev,
                  status: e.target.value
                }))}
                required
                variant="outlined"
              >
                <MenuItem value="Present">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PresentIcon color="success" /> Present
                  </Box>
                </MenuItem>
                <MenuItem value="Absent">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AbsentIcon color="error" /> Absent
                  </Box>
                </MenuItem>
                <MenuItem value="Clear">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ClearIcon color="action" /> Clear
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isMarking}
              sx={{ mt: 3, py: 1.5 }}
              startIcon={<TodayIcon />}
            >
              {isMarking ? "Processing..." : "Submit Attendance"}
            </Button>
          </Box>
        </Paper>

        {/* Change Password Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <ChangePassword />
        </Paper>

        {/* Logout Section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ px: 6, py: 1.5 }}
          >
            Logout
          </Button>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete all records for {deleteConfirm}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button 
              onClick={() => handleDeleteAttendance(deleteConfirm)}
              color="error"
              variant="contained"
            >
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Dashboard;