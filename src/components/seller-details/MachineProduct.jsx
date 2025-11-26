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
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

export default function MachineProducts({ list = [], onEdit, onDelete }) {
  if (!list.length) {
    return (
      <div className="card mb-4 border-0" style={{
        background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
        borderRadius: '24px',
        border: '3px dashed #93C5FD'
      }}>
        <div className="card-body text-center py-4">
          <PrecisionManufacturingIcon sx={{ fontSize: 64, color: '#3B82F6', mb: 2 }} />
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1E40AF' }}>
            No machinery products available
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-lg mb-4 border-0" style={{ borderRadius: '24px', overflow: 'hidden' }}>
      <Box sx={{
        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PrecisionManufacturingIcon sx={{ fontSize: 32, color: 'white' }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
              Machinery
            </Typography>
          </Box>
          <Chip 
            label={list.length} 
            sx={{
              bgcolor: 'white',
              color: '#2563EB',
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
            <div key={item.id} className="col-12 col-lg-6">
              <Box sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
                border: '2px solid #93C5FD',
                transition: 'all 0.3s',
                position: 'relative',
                '&:hover': {
                  boxShadow: '0 16px 40px rgba(59, 130, 246, 0.25)',
                  transform: 'translateY(-4px)',
                  '& .action-buttons': {
                    opacity: 1
                  }
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, flex: 1 }}>
                    <Avatar 
                      variant="rounded" 
                      src={item.product_image_url}
                      sx={{
                        width: 95,
                        height: 95,
                        border: '4px solid white',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1F2937' }}>
                        {item.product_name}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label="MODEL" 
                            size="small"
                            sx={{
                              bgcolor: '#3B82F6',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.65rem',
                              height: 22
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>
                            {item.model_no}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label="REG" 
                            size="small"
                            sx={{
                              bgcolor: '#10B981',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.65rem',
                              height: 22
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>
                            {item.registration_no}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label="CHASSIS" 
                            size="small"
                            sx={{
                              bgcolor: '#8B5CF6',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.65rem',
                              height: 22
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>
                            {item.chassi_no}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label="RC" 
                            size="small"
                            sx={{
                              bgcolor: '#F59E0B',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.65rem',
                              height: 22
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>
                            {item.rc_copy_no}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box className="action-buttons" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    opacity: 0,
                    transition: 'opacity 0.3s'
                  }}>
                    <Tooltip title="Edit Machine" arrow>
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
                    <Tooltip title="Delete Machine" arrow>
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