import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Button, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CommentsModal = ({ open, handleClose, comments, handleDeleteComment }) => {
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Comments</DialogTitle>
            <DialogContent dividers>
                {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <Box key={comment._id} display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2} border="1px solid #ddd" borderRadius="8px">
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600}>{comment.userName}</Typography>
                                <Typography variant="body2">{comment.comment}</Typography>
                            </Box>
                            <IconButton color="error" onClick={() => handleDeleteComment(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body1" textAlign="center">No comments available.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommentsModal;