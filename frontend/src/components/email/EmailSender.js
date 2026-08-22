import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Send as SendIcon,
  Email as EmailIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const EmailSender = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
    type: 'announcement',
  });

  const emailTemplates = {
    announcement: {
      subject: 'Company Announcement',
      message: 'Dear Team,\n\nWe have an important announcement to share...\n\nBest regards,\nHR Team',
    },
    leaveApproval: {
      subject: 'Leave Request Approved',
      message: 'Dear Employee,\n\nYour leave request has been approved.\n\nBest regards,\nHR Team',
    },
    payroll: {
      subject: 'Payroll Processed',
      message: 'Dear Employee,\n\nYour salary for this month has been processed.\n\nBest regards,\nHR Team',
    },
    attendance: {
      subject: 'Attendance Reminder',
      message: 'Dear Employee,\n\nPlease remember to mark your attendance daily.\n\nBest regards,\nHR Team',
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess(false);
  };

  const handleTemplateChange = (e) => {
    const template = emailTemplates[e.target.value];
    if (template) {
      setFormData({
        ...formData,
        type: e.target.value,
        subject: template.subject,
        message: template.message,
      });
    }
  };

  const handleSendEmail = async () => {
    if (!formData.to || !formData.subject || !formData.message) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/email/send`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      toast.success('✅ Email sent successfully!');
      setFormData({ ...formData, to: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send email. Please try again.');
      toast.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight={700}>
            Email Center
          </Typography>
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Send professional emails to employees with just a few clicks
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ Email sent successfully! All recipients will receive it shortly.
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Email Template</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleTemplateChange}
                label="Email Template"
              >
                <MenuItem value="announcement">📢 Company Announcement</MenuItem>
                <MenuItem value="leaveApproval">✅ Leave Approval</MenuItem>
                <MenuItem value="payroll">💰 Payroll Processed</MenuItem>
                <MenuItem value="attendance">📅 Attendance Reminder</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Recipient Email(s)"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="email1@company.com, email2@company.com"
              helperText="Separate multiple emails with commas"
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              multiline
              rows={6}
              disabled={loading}
              placeholder="Type your email message here..."
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSendEmail}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            {loading ? 'Sending...' : 'Send Email'}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setFormData({ to: '', subject: '', message: '', type: 'announcement' })}
            disabled={loading}
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            Clear All
          </Button>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip icon={<PeopleIcon />} label="5 Employees" color="primary" variant="outlined" />
          <Chip label="Secure TLS" color="success" variant="outlined" />
          <Chip label="Tracked" color="info" variant="outlined" />
        </Box>
      </Paper>
    </Container>
  );
};

export default EmailSender;