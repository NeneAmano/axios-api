import { Grid2, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const backendUrl = process.env.REACT_APP_STAGING_BACKEND_URL;
const token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiaWF0IjoxNzI0ODk4OTE0LCJleHAiOjE3MzI2NzQ5MTR9.ox3tsSLqNErdVsRgw-xVImAEkFSe5dZ_9MdMkLKmu9o";

export const Sample = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/user/allUsers`, {
        headers: { Authorization: token },
      });
      setUsers(response.data.object);
    } catch (error) {
      console.error("API Error:", error);
      setError(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDialogOpen = (type, user = null) => {
    setDialogType(type);
    setSelectedUser(user || { firstName: '', lastName: '', email: '', statusType: '', profileId: '' });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSave = async () => {
    try {
      if (dialogType === 'add') {
        await axios.post(`${backendUrl}/user/add`, selectedUser, {
          headers: { Authorization: token },
        });
      } else {
        await axios.put(`${backendUrl}/user/update/${selectedUser.id}`, selectedUser, {
          headers: { Authorization: token },
        });
      }
      await fetchUsers();
      handleDialogClose();
    } catch (error) {
      console.error(`Error ${dialogType === 'add' ? 'adding' : 'updating'} user:`, error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${backendUrl}/user/delete/${selectedUser.id}`, {
        headers: { Authorization: token },
      });
      await fetchUsers();
      handleDialogClose();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid2 container>
      <Typography variant="h4" gutterBottom>Sample Page</Typography>
      <Button 
        startIcon={<AddIcon />} 
        onClick={() => handleDialogOpen('add')}
        variant="contained"
        style={{ marginBottom: '20px' }}
      >
        Add User
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Firstname</TableCell>
              <TableCell>Lastname</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>ProfileID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName || 'N/A'}</TableCell>
                <TableCell>{user.lastName || 'N/A'}</TableCell>
                <TableCell>{user.email || 'N/A'}</TableCell>
                <TableCell>{user.statusType || 'N/A'}</TableCell>
                <TableCell>{user.profileId || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen('edit', user)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDialogOpen('delete', user)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogType === 'add' ? 'Add User' : dialogType === 'edit' ? 'Edit User' : 'Confirm Delete'}
        </DialogTitle>
        <DialogContent>
          {dialogType !== 'delete' ? (
            <>
              <TextField
                margin="dense"
                label="First Name"
                fullWidth
                value={selectedUser?.firstName || ''}
                onChange={(e) => setSelectedUser({...selectedUser, firstName: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Last Name"
                fullWidth
                value={selectedUser?.lastName || ''}
                onChange={(e) => setSelectedUser({...selectedUser, lastName: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Status"
                fullWidth
                value={selectedUser?.statusType || ''}
                onChange={(e) => setSelectedUser({...selectedUser, statusType: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Profile ID"
                fullWidth
                value={selectedUser?.profileId || ''}
                onChange={(e) => setSelectedUser({...selectedUser, profileId: e.target.value})}
              />
            </>
          ) : (
            <Typography>Are you sure you want to delete this user?</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {dialogType !== 'delete' ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
          )}
        </DialogActions>
      </Dialog>
    </Grid2>
  );
};