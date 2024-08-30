import {
  Button,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  FormControl,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import React, { useState } from "react";

export const Home = () => {
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [listOfUsers, setListUsers] = useState([
    { firstName: "Angelo", age: 25, gender: "Male" },
    { firstName: "Jay", age: 22, gender: "Male" },
    { firstName: "Alex", age: 19, gender: "Male" },
    { firstName: "Gerald", age: 20, gender: "Male" },
    { firstName: "Paolo", age: 22, gender: "Male" },
  ]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    age: "",
    gender: "Male",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewUser(user);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedUser(null);
    setNewUser({ firstName: "", age: "", gender: "Male" });
  };

  const handleAddClick = () => {
    setShow(true);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    if (newUser.firstName && newUser.age) {
      setListUsers([
        ...listOfUsers,
        { ...newUser, age: parseInt(newUser.age) },
      ]);
      handleClose();
    }
  };

  const handleEditUser = () => {
    if (newUser.firstName && newUser.age) {
      setListUsers(
        listOfUsers.map((user) =>
          user === selectedUser
            ? { ...newUser, age: parseInt(newUser.age) }
            : user
        )
      );
      handleClose();
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete);
    }
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = (userToDelete) => {
    setListUsers(listOfUsers.filter((user) => user !== userToDelete));
  };

  const filteredUsers = listOfUsers.filter((user) =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Grid2
      container
      justifyContent={"center"}
      alignContent="center"
      alignItems={"center"}
    >
      <TextField
        label="Search by name"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ margin: "20px 0", width: "100%" }}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Firstname</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(user)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(user)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button onClick={handleAddClick} startIcon={<AddIcon />}>
        Add User
      </Button>

      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              margin="dense"
              label="First Name"
              name="firstName"
              value={newUser.firstName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Age"
              name="age"
              type="number"
              value={newUser.age}
              onChange={handleInputChange}
              fullWidth
            />
            <Select
              margin="dense"
              label="Gender"
              name="gender"
              value={newUser.gender}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          {selectedUser ? (
            <Button onClick={handleEditUser}>Save</Button>
          ) : (
            <Button onClick={handleAddUser}>Add</Button>
          )}
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDeleteConfirm}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid2>
  );
};
