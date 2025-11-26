import {
  Avatar,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TerrainIcon from '@mui/icons-material/Terrain';

export default function LandSelector({ lands, selectedLandId, onChange, onEdit, editAllowed }) {
  return (
    <div className="card shadow-lg mb-4 border-0" style={{
      background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      borderRadius: '24px',
      overflow: 'hidden'
    }}>
      <div className="card-body p-4">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
          }}>
            <TerrainIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937' }}>
            Land Selection
          </Typography>
        </Box>
        
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md">
            <FormControl fullWidth>
              <InputLabel>Choose Land</InputLabel>
              <Select 
                value={selectedLandId || ""} 
                label="Choose Land" 
                onChange={(e) => onChange(e.target.value)}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 3,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#A7F3D0',
                    borderWidth: 2,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#10B981',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#10B981',
                  },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <MenuItem value="">-- Select land --</MenuItem>
                {lands.map(l => (
                  <MenuItem key={l.id} value={l.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 20, color: '#10B981' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{l.land_name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="col-12 col-md-auto">
            <Tooltip title={editAllowed ? "Edit Land" : "Select a land to edit"} arrow>
              <span>
                <IconButton 
                  onClick={() => onEdit(selectedLandId)} 
                  disabled={!editAllowed}
                  sx={{
                    bgcolor: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    width: 56,
                    height: 56,
                    border: '2px solid #E5E7EB',
                    '&:hover': {
                      bgcolor: '#10B981',
                      color: 'white',
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                    },
                    '&:disabled': {
                      bgcolor: '#F3F4F6',
                      color: '#D1D5DB'
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  <EditIcon sx={{ fontSize: 24 }} />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}