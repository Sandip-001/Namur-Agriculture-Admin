
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
import PetsIcon from '@mui/icons-material/Pets';

export default function AnimalProducts({ list = [], onEdit, onDelete }) {
  if (!list.length) {
    return (
      <div className="card mb-4 border-0" style={{
        background: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)',
        borderRadius: '24px',
        border: '3px dashed #F9A8D4'
      }}>
        <div className="card-body text-center py-4">
          <PetsIcon sx={{ fontSize: 64, color: '#EC4899', mb: 2 }} />
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#831843' }}>
            No animal products available
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-lg mb-4 border-0" style={{ borderRadius: '24px', overflow: 'hidden' }}>
      <Box sx={{
        background: 'linear-gradient(135deg, #EC4899, #DB2777)',
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PetsIcon sx={{ fontSize: 32, color: 'white' }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
              Animals
            </Typography>
          </Box>
          <Chip 
            label={list.length} 
            sx={{
              bgcolor: 'white',
              color: '#DB2777',
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
            <div key={item.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <Box sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)',
                border: '2px solid #F9A8D4',
                transition: 'all 0.3s',
                textAlign: 'center',
                '&:hover': {
                  boxShadow: '0 16px 40px rgba(236, 72, 153, 0.25)',
                  transform: 'translateY(-4px)',
                  '& .action-buttons': {
                    opacity: 1
                  }
                }
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar 
                    variant="rounded" 
                    src={item.product_image_url}
                    sx={{
                      width: 100,
                      height: 100,
                      border: '4px solid white',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      mb: 2
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1F2937' }}>
                    {item.product_name}
                  </Typography>
                  <Chip 
                    label={`Qty: ${item.quantity}`}
                    sx={{
                      bgcolor: 'white',
                      fontWeight: 700,
                      border: '2px solid #F9A8D4',
                      color: '#DB2777',
                      mb: 2,
                      fontSize: '0.85rem'
                    }}
                  />
                  
                  <Box className="action-buttons" sx={{
                    display: 'flex',
                    gap: 1,
                    opacity: 0,
                    transition: 'opacity 0.3s'
                  }}>
                    <Tooltip title="Edit Animal" arrow>
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
                    <Tooltip title="Delete Animal" arrow>
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
