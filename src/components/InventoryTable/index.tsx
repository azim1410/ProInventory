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
import { fetchAllProducts, InventoryProps } from "../../features/InventoryServices.ts";
import { supabase } from "../../database/supabaseClient.ts";
import "../../App.css";
import { RootState } from "../../store/store.ts";
import { useSelector } from "react-redux";


const InventoryTable = () => {
  const [data, setData] = useState<InventoryProps[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editedData, setEditedData] = useState<{ [category: string]: InventoryProps[] }>({});
  const [editItem, setEditItem] = useState({
    product_id: '',
    product_name: '',
    price: '',
    total_quantity: 0,
    category_id: '',
  });
  const [groupedData, setGroupedData] = useState<{ [category: string]: InventoryProps[] }>({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState<boolean>(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<string>("");

  // Handle Search Query
  const onChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredData = data.filter(
      (item) =>
        item.product_name.toLowerCase().includes(query)
    );
    // @ts-expect-error ddd
    setEditedData(filteredData);
  };

  const handleOpenConfirmationDialog = (productId: string) => {
    setSelectedForDeletion(productId);
    setOpenConfirmationDialog(true);
  };

  const handleDeleteItem = async (productId: string) => {
    try {
      const { error } = await supabase.from('inventory').delete().match({ product_id: productId });

      if (error) throw error;

      // Remove the deleted item from the local state to update UI
      const updatedData = data.filter(item => item.product_id !== productId);
      setData(updatedData);

      // You may update groupedData too if necessary, depending on how your UI should react
      const updatedGroupedData = Object.entries(groupedData).reduce((acc, [category, items]) => {
        const filteredItems = items.filter(item => item.product_id !== productId);
        if (filteredItems.length > 0) {
          // @ts-expect-error ddd
          acc[category] = filteredItems;
        }
        return acc;
      }, {});

      setGroupedData(updatedGroupedData);

    } catch (error) {
      console.error("Error deleting inventory item:", error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const products = await fetchAllProducts();
      setData(products);
      const categorizedData = products.reduce((acc, item) => {
        const categoryName = item.category_name || 'Uncategorized';
        // @ts-expect-error ddd
        acc[categoryName] = acc[categoryName] || [];
        // @ts-expect-error ddd
        acc[categoryName].push(item);
        return acc;
      }, {});
      setGroupedData(categorizedData);
    };
    getData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filteredData = data.filter(item => item.product_name.toLowerCase().includes(searchQuery));
      const categorizedData = filteredData.reduce((acc, item) => {
        const categoryName = item.category_name || 'Uncategorized';
        // @ts-expect-error ddd
        acc[categoryName] = acc[categoryName] || [];
        // @ts-expect-error ddd
        acc[categoryName].push(item);
        return acc;
      }, {});
      setGroupedData(categorizedData);
    } else {
      // Re-categorize all data if search query is cleared
      const categorizedData = data.reduce((acc, item) => {
        const categoryName = item.category_name || 'Uncategorized';
        // @ts-expect-error ddd
        acc[categoryName] = acc[categoryName] || [];
        // @ts-expect-error ddd
        acc[categoryName].push(item);
        return acc;
      }, {});
      setGroupedData(categorizedData);
    }
  }, [searchQuery, data, editedData]);

  const handleEdit = (item: InventoryProps) => {
    // @ts-expect-error ddd
    setEditItem(item);
    setOpenEditDialog(true);
  };

  const handleUpdateInventory = async () => {
    if (!editItem.product_name) {
      console.log('Store name cannot be empty');
      return;
    }

    const { error } = await supabase
      .from("inventory")
      .update({ product_name: editItem.product_name, price: editItem.price })
      .match({ product_id: editItem.product_id });

    if (error) {
      console.error("Error updating category:", error);
    } else {
      // setEditItem({ product_id: '', product_name: '', price: '' });
      setOpenEditDialog(false);
    }
  };




  return (
    <Box>
      <Box className="hide-print" >
        <SearchBar value={searchQuery} onChange={onChangeData} />
      </Box>

      {Object.entries(groupedData).map(([category, items]) => {

        return (

          <Box key={category} sx={{ marginBottom: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5" sx={{ textAlign: "left", fontWeight: 600, color: PRIMARY_CLR, fontSize: '1.3rem' }}>{category}</Typography>
            </Box>
            <TableContainer component={Paper} sx={{ backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: 'none', border: '0.5px solid #c4c0c0' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1rem', padding: '5px', width: '30%' }}>Item</TableCell>
                    <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1rem', padding: '5px' }}>Quantity</TableCell>
                    {isAuth && <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1rem', padding: '5px' }}>Price</TableCell>}
                    {isAuth && <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1rem', padding: '5px' }}>Sales</TableCell>}
                    <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1rem', padding: '5px' }} className="hide-print" >Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.product_id}>
                      <TableCell sx={{ fontSize: '1rem', padding: '5px' }}>{item.product_name}</TableCell>
                      <TableCell sx={{ fontSize: '1rem', padding: '5px' }}>{item.total_quantity}</TableCell>
                      {isAuth && <TableCell sx={{ fontSize: '1rem', padding: '5px', fontWeight: 600 }}>₹{item.price}</TableCell>}
                      {isAuth && <TableCell sx={{ fontSize: '1rem', padding: '5px', fontWeight: 600 }}>₹{item.price * item.total_quantity}</TableCell>}
                      <TableCell className="hide-print" sx={{ padding: '5px' }}>
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
                          sx={{ marginLeft: "0.5rem" }}
                          onClick={() => handleOpenConfirmationDialog(item.product_id)}
                        >
                          <MdDeleteForever />
                        </Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )
      })}


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
              label="Product Name"
              fullWidth
              margin="normal"
              value={editItem.product_name}
              onChange={(e) =>
                setEditItem({ ...editItem, product_name: e.target.value })
              }
            />

            {isAuth && <TextField
              label="Price"
              fullWidth
              margin="normal"
              value={editItem.price}
              onChange={(e) =>
                setEditItem({ ...editItem, price: e.target.value })
              }
            />}



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
                onClick={handleUpdateInventory}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

      )}
      <Dialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm delete item?"}</DialogTitle>

        <DialogActions>
          <Button onClick={() => setOpenConfirmationDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            handleDeleteItem(selectedForDeletion);
            setOpenConfirmationDialog(false);
          }}
            autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryTable;


