import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Avatar,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Lock as PasswordIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Welcome back!');
      const user = JSON.parse(localStorage.getItem('user'));
      navigate(user?.role === 'hr' ? '/admin/dashboard' : '/dashboard');
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100%',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a2e 0%, #1a1a4e 30%, #16213e 60%, #0f3460 100%)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
    }}>
      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={0} sx={{ 
          p: 4, 
          borderRadius: 4,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
        }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar sx={{ 
              m: '0 auto', 
              bgcolor: 'transparent', 
              width: 70, 
              height: 70,
              border: '2px solid rgba(79,195,247,0.3)',
            }}>
              <BusinessIcon sx={{ fontSize: 40, color: '#4fc3f7' }} />
            </Avatar>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 2, color: 'white' }}>
              Dayflow HRMS
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Human Resource Management System
            </Typography>
          </Box>

          <Typography variant="h5" fontWeight={600} sx={{ color: 'white', textAlign: 'center' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', mb: 3 }}>
            Sign in to your account
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'rgba(255,255,255,0.3)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2,
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(79,195,247,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#4fc3f7' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#4fc3f7' },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordIcon sx={{ color: 'rgba(255,255,255,0.3)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 
                        <VisibilityOffIcon sx={{ color: 'rgba(255,255,255,0.3)' }} /> : 
                        <VisibilityIcon sx={{ color: 'rgba(255,255,255,0.3)' }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2,
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(79,195,247,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#4fc3f7' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#4fc3f7' },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                py: 1.5,
                borderRadius: 2,
                bgcolor: '#4fc3f7',
                color: '#0a0a2e',
                fontWeight: 700,
                fontSize: '1rem',
                '&:hover': { bgcolor: '#81d4fa' },
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                  Don't have an account? <strong style={{ color: '#4fc3f7' }}>Sign Up</strong>
                </Typography>
              </Link>
            </Box>
            
            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.05)' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)' }}>
                DEMO
              </Typography>
            </Divider>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(255,255,255,0.03)', 
              borderRadius: 2, 
              textAlign: 'center',
            }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block' }}>
                <strong style={{ color: '#4fc3f7' }}>Admin:</strong> admin@hrms.com / admin123
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block' }}>
                <strong style={{ color: '#4fc3f7' }}>Employee:</strong> employee1@hrms.com / employee123
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignIn;