import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Modal,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import SearchBar from "../SearchBar/index.tsx";
import { PRIMARY_CLR } from "../../assets/colors/index.ts";
import { supabase } from "../../database/supabaseClient.ts";
import { fetchAllStores, StoreProps } from "../../features/StoreServices.ts";

import { FaCartArrowDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StoreTable = () => {
  const [data, setData] = useState<StoreProps[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editedData, setEditedData] = useState<StoreProps[]>([]);
  const [editItem, setEditItem] = useState({
    store_id: '',
    store_name: '',
    store_short_name: '',
    store_route_name: ''
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [storeToDelete, setStoreToDelete] = useState<string>("");

  const onChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = data.filter(
      (item) =>
        item.store_name.toLowerCase().includes(query)
    );

    setEditedData(filteredData);
  };


  useEffect(() => {
    const getData = async () => {
      const response = await fetchAllStores();
      console.log(response);
      setData(response);
      setEditedData(response);

    };
    getData();
  }, []);

  const handleEdit = (item: StoreProps) => {
    setEditItem(item);
    setOpenEditDialog(true);
  };

  const handleUpdateCategory = async () => {
    if (!editItem.store_name) {
      console.log('Store name cannot be empty');
      return;
    }

    const { error } = await supabase
      .from("stores")
      .update({ store_name: editItem.store_name, store_route_name: editItem.store_route_name, store_short_name: editItem.store_short_name })
      .match({ store_id: editItem.store_id });

    if (error) {
      console.error("Error updating category:", error);
    } else {
      setEditItem({ store_id: '', store_name: '', store_route_name: '', store_short_name: '' });
      setOpenEditDialog(false);
    }
  };

  const handleOpenDeleteDialog = (store: string) => {
    setStoreToDelete(store);
    setOpenDeleteDialog(true);
  };

  const handleDeleteStore = async (store_id: string) => {
    try {
      const { error } = await supabase.from('stores').delete().match({ store_id });
      if (error) throw error;

      // Refresh the data or filter out the deleted store from the state
      const updatedData = data.filter(store => store.store_id !== store_id);
      setData(updatedData);
      setEditedData(updatedData); // Also update search results if necessary
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  const navigate = useNavigate();

  const handleOpenStoreInventory = (store_id: string, store_name: string) => {
    navigate(`/store/${store_id}/${store_name}`);
  }

  return (
    <Box>
      <SearchBar value={searchQuery} onChange={onChangeData} />
      <Box sx={{ padding: 2 }}>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: '60vh',
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "none",
            border: '0.5px solid #c4c0c0'
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow >
                <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1.3rem', padding: '5px' }}>Store name</TableCell>
                <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1.3rem', padding: '5px' }}>Shortname</TableCell>
                <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1.3rem', padding: '5px' }}>Route</TableCell>
                <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1.3rem', padding: '5px' }}>Action</TableCell>
                <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1.3rem', padding: '5px' }}>Inventory</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {editedData.map((item) => (
                <TableRow key={item.store_id}>
                  <TableCell sx={{ fontSize: '1rem', padding: '5px' }}>{item.store_name}</TableCell>
                  <TableCell sx={{ fontSize: '1rem', padding: '5px' }}>{item.store_short_name}</TableCell>
                  <TableCell sx={{ fontSize: '1rem', padding: '5px' }}>{item.store_route_name}</TableCell>
                  <TableCell sx={{ padding: '5px' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="medium"
                      onClick={() => handleEdit(item)}
                    >
                      <MdModeEdit />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="medium"
                      onClick={() => handleOpenDeleteDialog(item.store_id)}
                      sx={{ marginLeft: "0.5rem" }}
                    >
                      <MdDeleteForever />
                    </Button>
                  </TableCell>
                  <TableCell sx={{ fontSize: '1rem' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="medium"
                      onClick={() => handleOpenStoreInventory(item.store_id, item.store_name)}
                    >
                      <FaCartArrowDown />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {editedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No matching records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {editItem && (
        <Modal open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: '18rem',
              bgcolor: "background.paper",
              borderRadius: "8px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1b2f47' }}>
              Edit Item
            </Typography>

            <TextField
              label="Store Name"
              fullWidth
              margin="normal"
              value={editItem.store_name}
              onChange={(e) =>
                setEditItem({ ...editItem, store_name: e.target.value })
              }
            />

            <TextField
              label="Store Short name"
              fullWidth
              margin="normal"
              value={editItem.store_short_name}
              onChange={(e) =>
                setEditItem({ ...editItem, store_short_name: e.target.value })
              }
            />

            <TextField
              label="Route"
              fullWidth
              margin="normal"
              value={editItem.store_route_name}
              onChange={(e) =>
                setEditItem({ ...editItem, store_route_name: e.target.value })
              }
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                sx={{ marginRight: 1, backgroundColor: '#1b2f47', boxShadow: 'none' }}
                onClick={() => setOpenEditDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#1b2f47', boxShadow: 'none' }}
                onClick={handleUpdateCategory}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

      )}

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete?"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleDeleteStore(storeToDelete);
              setOpenDeleteDialog(false);
            }}
            color="error"
            autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoreTable;


