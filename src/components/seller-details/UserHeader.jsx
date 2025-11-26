import {
  Avatar,
  IconButton,
  Chip,
  Badge,
  Tooltip,
  Switch,
  Box,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// 1. Modern UserHeader Component
export default function UserHeader({ user, isBlocked, onToggleBlock, onOpenEdit }) {
  return (
    <div className="card shadow-lg mb-4 border-0 overflow-hidden" style={{
      background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 50%, #F3E8FF 100%)',
      borderRadius: '24px',
      position: 'relative'
    }}>
      {/* Animated decorative background */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(147, 197, 253, 0.3) 0%, rgba(196, 181, 253, 0.2) 100%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'pulse 4s ease-in-out infinite'
      }}></div>

      <div className="card-body p-4" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row align-items-center g-4">
          {/* Avatar Section */}
          <div className="col-12 col-lg-auto text-center text-lg-start">
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <div style={{
                position: 'absolute',
                inset: '-6px',
                background: isBlocked 
                  ? 'linear-gradient(135deg, #EF4444, #DC2626)' 
                  : 'linear-gradient(135deg, #10B981, #059669)',
                borderRadius: '50%',
                filter: 'blur(16px)',
                opacity: 0.7,
                animation: 'pulse 3s ease-in-out infinite'
              }}></div>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: '4px solid white',
                    bgcolor: isBlocked ? '#EF4444' : '#10B981',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isBlocked ? <BlockIcon sx={{ fontSize: 14, color: 'white' }} /> : <CheckCircleIcon sx={{ fontSize: 14, color: 'white' }} />}
                  </Box>
                }
              >
                <Avatar
                  src={user.profile_image_url}
                  alt={user.username}
                  sx={{
                    width: 130,
                    height: 130,
                    border: '6px solid white',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                    position: 'relative'
                  }}
                />
              </Badge>
            </Box>
          </div>

          {/* User Info Section */}
          <div className="col-12 col-lg">
            <Box sx={{ mb: 2 }}>
              <div className="d-flex align-items-center gap-3 mb-2 flex-wrap justify-content-center justify-content-lg-start">
                <Typography variant="h4" sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #1F2937, #4B5563)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0
                }}>
                  {user.username || 'No name'}
                </Typography>
                <Chip 
                  label={isBlocked ? 'Blocked' : 'Active'} 
                  size="medium"
                  icon={isBlocked ? <BlockIcon /> : <CheckCircleIcon />}
                  sx={{
                    bgcolor: isBlocked ? '#FEE2E2' : '#D1FAE5',
                    color: isBlocked ? '#991B1B' : '#065F46',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: `2px solid ${isBlocked ? '#FECACA' : '#A7F3D0'}`,
                    px: 1,
                    '& .MuiChip-icon': { color: isBlocked ? '#991B1B' : '#065F46' }
                  }}
                />
              </div>
            </Box>
            
            <div className="row g-3">
              <div className="col-12 col-md-6 col-xl-4">
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 3,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <Avatar sx={{
                    width: 44,
                    height: 44,
                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                  }}>
                    <EmailIcon sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }} className="text-truncate">
                    {user.email}
                  </Typography>
                </Box>
              </div>
              
              <div className="col-12 col-md-6 col-xl-4">
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 3,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <Avatar sx={{
                    width: 44,
                    height: 44,
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                  }}>
                    <PhoneIcon sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                    {user.mobile}
                  </Typography>
                </Box>
              </div>
              
              <div className="col-12 col-md-6 col-xl-4">
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 3,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <Avatar sx={{
                    width: 44,
                    height: 44,
                    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
                  }}>
                    <CalendarTodayIcon sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="col-12 col-lg-auto">
            <div className="d-flex flex-column gap-2 align-items-stretch">
              <Tooltip title={isBlocked ? "Unblock User" : "Block User"} arrow placement="left">
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'white',
                  borderRadius: 3,
                  p: 1.5,
                  border: '2px solid #E5E7EB',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <BlockIcon sx={{ color: isBlocked ? '#EF4444' : '#9CA3AF', fontSize: 24 }} />
                  <Switch 
                    checked={isBlocked} 
                    onChange={onToggleBlock}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#EF4444',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#EF4444',
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: isBlocked ? '#EF4444' : '#9CA3AF' }}>
                    {isBlocked ? 'Blocked' : 'Active'}
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title="Edit User" arrow placement="left">
                <IconButton 
                  onClick={onOpenEdit}
                  sx={{
                    bgcolor: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '2px solid #E5E7EB',
                    borderRadius: 3,
                    p: 1.5,
                    '&:hover': {
                      bgcolor: '#3B82F6',
                      color: 'white',
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  <EditIcon sx={{ fontSize: 24 }} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
