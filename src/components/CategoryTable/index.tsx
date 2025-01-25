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
import { CategoryProps, fetchAllCategories } from "../../features/CategoryServices.ts";
import { supabase } from "../../database/supabaseClient.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";



const CategoryTable = () => {
  const [data, setData] = useState<CategoryProps[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editedData, setEditedData] = useState<CategoryProps[]>([]);
  const [editItem, setEditItem] = useState({
    category_id: '',
    category_name: ''
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string>('');
  // Handle Search Query
  const onChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = data.filter(
      (item) =>
        item.category_name.toLowerCase().includes(query)
    );

    setEditedData(filteredData);
  };

  const handleOpenDeleteDialog = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteCategory = async () => {
    const { error } = await supabase
      .from('category')
      .delete()
      .match({ category_id: categoryToDelete });

    if (error) {
      console.error("Error deleting category:", error);
    } else {
      const updatedCategories = data.filter(category => category.category_id !== categoryToDelete);
      setData(updatedCategories);
      setEditedData(updatedCategories);
      handleCloseDeleteDialog();
    }
  };


  useEffect(() => {
    const getData = async () => {
      const response = await fetchAllCategories();
      // console.log(response);
      setData(response);
      setEditedData(response);

    };
    getData();
  }, []);

  const handleEdit = (item: CategoryProps) => {
    setEditItem(item);
    setOpenEditDialog(true);
  };

  const handleUpdateCategory = async () => {
    if (!editItem.category_name) {
      console.log('Category name cannot be empty');
      return;
    }

    const { error } = await supabase
      .from("category")
      .update({ category_name: editItem.category_name })
      .match({ category_id: editItem.category_id });

    if (error) {
      console.error("Error updating category:", error);
    } else {
      setEditItem({ category_id: '', category_name: '' });
      setOpenEditDialog(false);
    }
  };


  return (
    <Box>
      <SearchBar value={searchQuery} onChange={onChangeData} />
      <Box sx={{  }}>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "none",
            border: '0.5px solid #c4c0c0'
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow >
                <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1.3rem', padding: '5px' }}>ID</TableCell>
                <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1.3rem', padding: '5px' }}>Category</TableCell>
                <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1.3rem', padding: '5px' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {editedData.map((item) => (
                <TableRow key={item.category_id}>
                  <TableCell sx={{ fontSize: '1rem', padding: '5px' }}>{(item.category_id).slice(0, 3)}</TableCell>
                  <TableCell sx={{ fontSize: '1rem', padding: '5px' }}>{item.category_name}</TableCell>
                  <TableCell sx={{ padding: '5px' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="medium"
                      onClick={() => handleEdit(item)}
                    >
                      <MdModeEdit />
                    </Button>
                    {isAuth && <Button
                      variant="outlined"
                      color="error"
                      size="medium"
                      onClick={() => handleOpenDeleteDialog(item.category_id)}
                      sx={{ marginLeft: "0.5rem" }}
                    >
                      <MdDeleteForever />
                    </Button>}
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
              label="Category"
              fullWidth
              margin="normal"
              value={editItem.category_name}
              onChange={(e) =>
                setEditItem({ ...editItem, category_name: e.target.value })
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
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteCategory} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryTable;


