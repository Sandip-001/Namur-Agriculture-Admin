import {
  Avatar,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AgricultureIcon from '@mui/icons-material/Agriculture';


export default function FoodProducts({ list = [], onEdit, onDelete }) {
  if (!list.length) {
    return (
      <div className="card mb-4 border-0" style={{
        background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
        borderRadius: '24px',
        border: '3px dashed #FCD34D'
      }}>
        <div className="card-body text-center py-4">
          <AgricultureIcon sx={{ fontSize: 64, color: '#F59E0B', mb: 2 }} />
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#78350F' }}>
            No food products available
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-lg mb-4 border-0" style={{ borderRadius: '24px', overflow: 'hidden' }}>
      <Box sx={{
        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AgricultureIcon sx={{ fontSize: 32, color: 'white' }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
              Food Products
            </Typography>
          </Box>
          <Chip 
            label={list.length} 
            sx={{
              bgcolor: 'white',
              color: '#D97706',
              fontWeight: 800,
              fontSize: '1rem',
              height: 36,
              px: 1
            }}
          />
        </Box>
      </Box>
      
      <div className="card-body p-4">
        <div className="row g-3">
          {list.map(item => (
            <div key={item.id} className="col-12 col-md-6">
              <Box sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                border: '2px solid #FCD34D',
                transition: 'all 0.3s',
                position: 'relative',
                '&:hover': {
                  boxShadow: '0 16px 40px rgba(245, 158, 11, 0.25)',
                  transform: 'translateY(-4px)',
                  '& .action-buttons': {
                    opacity: 1
                  }
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Avatar 
                      variant="rounded" 
                      src={item.product_image_url}
                      sx={{
                        width: 85,
                        height: 85,
                        border: '4px solid white',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1F2937' }}>
                        {item.product_name}
                      </Typography>
                      <Chip 
                        label={`🌾 ${item.acres} Acres`}
                        size="small"
                        sx={{
                          bgcolor: 'white',
                          fontWeight: 700,
                          border: '2px solid #FCD34D',
                          color: '#D97706'
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box className="action-buttons" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    opacity: 0,
                    transition: 'opacity 0.3s'
                  }}>
                    <Tooltip title="Edit Product" arrow>
                      <IconButton 
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        size="small"
                        sx={{
                          bgcolor: '#3B82F6',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          '&:hover': {
                            bgcolor: '#2563EB',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow>
                      <IconButton 
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        size="small"
                        sx={{
                          bgcolor: '#EF4444',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                          '&:hover': {
                            bgcolor: '#DC2626',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}