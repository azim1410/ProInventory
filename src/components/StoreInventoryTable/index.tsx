import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { MdModeEdit } from 'react-icons/md';
import { fetchStoreInventory, updateStoreInventory } from '../../features/StoreServices';
import SearchBar from '../SearchBar';
import '../../App.css';
import { PRIMARY_CLR } from '../../assets/colors';

type InventoryProps = {
  price: number;
  product_name: string;
};

export type StoreProductProps = {
  id: string;
  inventory: InventoryProps;
  product_id: string;
  quantity: number;
  store_id: string;
  category_name: string;
};

type StoreProps = {
  store_id: string | undefined;
};

const StoreInventoryTable = ({ store_id }: StoreProps) => {
  const [data, setData] = useState<{ [category: string]: StoreProductProps[] }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editItem, setEditItem] = useState<StoreProductProps | null>(null);

  const onChangeData = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filteredData = Object.keys(data).reduce((acc, category) => {
        acc[category] = data[category].filter((item) =>
          item.inventory.product_name.toLowerCase().includes(query)
        );
        return acc;
      }, {} as { [category: string]: StoreProductProps[] });

      setData(filteredData);
    } else {
      // Reset to original data if searchQuery is cleared
      setData(data);
    }
  };

  useEffect(() => {
    const getStoreInventoryData = async () => {
      if (!store_id) {
        console.error('store_id is undefined');
        return;
      }
      const response = await fetchStoreInventory(store_id);
      if (response) {
        // @ts-expect-error ddd
        const categorizedData = response.reduce((acc: { [key: string]: StoreProductProps[] }, item: StoreProductProps) => {
          const categoryName = item.category_name || 'Uncategorized';
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(item);
          return acc;
        }, {});
        // @ts-expect-error ddd
        setData(categorizedData);
      }
    };
    getStoreInventoryData();
  }, [store_id]);

  const handleEdit = (item: StoreProductProps): void => {
    setEditItem({ ...item });
    setOpenEditDialog(true);
  };

  const handleUpdateInventory = async (): Promise<void> => {
    if (!editItem || isNaN(editItem.quantity)) {
      alert('Invalid input');
      return;
    }

    try {
      const updatedItem = await updateStoreInventory(editItem.id, editItem.quantity);
      console.log(updatedItem);
      setOpenEditDialog(false);
      // You might want to refresh the data here
    } catch (error) {
      console.error('Failed to update inventory:', error);
    }
  };

  const renderItemRow = (item: StoreProductProps) => (
    <Grid container alignItems="center" sx={{ border: '1px solid #e0e0e0',}} key={item.id}>
      <Grid item xs={8}>
        <Typography variant="body2" sx={{ textAlign: 'start', padding: '5px', borderRight: '1px solid #e0e0e0' }}>{item.inventory.product_name}</Typography>
      </Grid>
      <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
       <Grid item xs={2} >
       <Typography variant="body2" sx={{ textAlign: 'start', padding: '5px', }}>{item.quantity}</Typography>
       </Grid>
        <Grid item xs={2} className="hide-print" >
            <IconButton size="small" sx={{ textAlign: 'start', padding: '5px', color: PRIMARY_CLR, }} onClick={() => handleEdit(item)}>
              <MdModeEdit />
            </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Box className="hide-print">
        <SearchBar value={searchQuery} onChange={onChangeData} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {Object.entries(data).slice(0, Math.ceil(Object.keys(data).length / 2)).map(([categoryName, items]) => (
            <Paper key={categoryName} sx={{ mb: 2, boxShadow: 'none' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, textAlign: 'left', color: PRIMARY_CLR, padding: '5px' }}>
                {categoryName}
              </Typography>
              {items.map(renderItemRow)}
            </Paper>
          ))}
        </Grid>
        <Grid item xs={6}>
          {Object.entries(data).slice(Math.ceil(Object.keys(data).length / 2)).map(([categoryName, items]) => (
            <Paper key={categoryName} sx={{ mb: 2, boxShadow: 'none' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, textAlign: 'left', color: PRIMARY_CLR, padding: '5px' }}>
                {categoryName}
              </Typography>
              {items.map(renderItemRow)}
            </Paper>
          ))}
        </Grid>
      </Grid>

      {editItem && (
        <Modal
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          slotProps={{ backdrop: { style: { backgroundColor: 'rgba(200, 200, 200, 0.25)' } } }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '18rem',
              bgcolor: 'background.paper',
              borderRadius: '8px',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1b2f47' }}>
              Update Quantity
            </Typography>

            <TextField
              label="Quantity"
              fullWidth
              margin="normal"
              value={editItem.quantity}
              type="number"
              onChange={(e) =>
                setEditItem({ ...editItem, quantity: Number(e.target.value) })
              }
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
    </Box>
  );
};

export default StoreInventoryTable;