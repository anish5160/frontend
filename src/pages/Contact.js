import { Grid, TextField, Button, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const Contact = () => {
  const supportEmail = "aneshdwibedi115@gmail.com"; // Your support email
  const formActionURL = "https://formspree.io/f/xrbpgeve"; // Replace with your FormFree endpoint

  return (
    <Grid container justifyContent="center">
      <Grid item sm={10} style={{ textAlign: "center", marginTop: 50 }}>
        <Typography variant="h4">Contact Us</Typography>
        <hr />
        <Typography variant="body1">
          Have any questions or complaints? **Fill out the form below for a quicker response**, or reach us via email.
        </Typography>

        {/* Contact Form */}
        <form action={formActionURL} method="POST" style={{ marginTop: 20 }}>
          <TextField fullWidth label="Your Name" name="name" margin="normal" variant="outlined" required />
          <TextField fullWidth label="Your Email" name="email" margin="normal" variant="outlined" required />
          <TextField fullWidth label="Message" name="message" margin="normal" variant="outlined" multiline rows={4} required />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            style={{ marginTop: 10 }}
          >
            Send Message
          </Button>
        </form>

        {/* Email Contact */}
        <Typography variant="h6" style={{ marginTop: 30 }}>
          Prefer email? Reach us at:{" "}
          <a href={`mailto:${supportEmail}`} style={{ color: "#6d1b7b", textDecoration: "none", fontWeight: "bold" }}>
            {supportEmail}
          </a>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Contact;
