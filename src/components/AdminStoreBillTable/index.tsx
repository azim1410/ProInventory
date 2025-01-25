import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import SearchBar from '../SearchBar';
// import { MdModeEdit } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchStoreInventory } from '../../features/StoreServices';
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

const StoreInventoryBillTable = ({ store_id }: StoreProps) => {
  const [data, setData] = useState<{ [category: string]: StoreProductProps[] }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

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
      console.log(response);
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


  const calculateTotalSales = (): number => {
    return Object.values(data).flat().reduce((total, item) => {
      return total + item.quantity * item.inventory.price;
    }, 0);
  };

  return (
    <Box>
      <Box className="hide-print">
        <SearchBar value={searchQuery} onChange={onChangeData} />
      </Box>
      {isAuth && (
        <Box sx={{ display: 'flex', alignItems: 'center'
         }}>
          <Typography sx={{ textAlign: 'left', fontWeight: 200, fontSize: '2rem', color: '#14202e' }}>
            Total Sales -
          </Typography>
          <Typography sx={{ textAlign: 'left', paddingLeft: '0.5rem', fontWeight: 600, fontSize: '2rem', color: PRIMARY_CLR }}>₹{calculateTotalSales()}</Typography>
        </Box>
      )}
      {Object.entries(data).map(([categoryName, items]) => {
        const filteredItems = items.filter(item => item.quantity > 0);
        if (isAuth && filteredItems.length === 0) {
          return null;
        }
        const totalSales = filteredItems.reduce((acc, item) => acc + (item.quantity * item.inventory.price), 0);

        return (
          <Box key={categoryName} sx={{
            padding: 1
          }}>
            <Box sx={{
              display: 'flex', justifyContent: 'space-between', borderRadius: '10px', marginBottom: '0.3rem'
            }}>
              <Typography variant="h6" sx={{ textAlign: "left", fontWeight: 600, color: PRIMARY_CLR, fontSize: '1.3rem' }}>{categoryName}</Typography>
              {isAuth && <Typography sx={{ fontWeight: 400, fontSize: '1.3rem', color: PRIMARY_CLR, marginLeft:'0.5rem' }}>Sales - ₹{totalSales}</Typography>}
            </Box>
            <TableContainer component={Paper} sx={{ backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: 'none', border: '0.5px solid #c4c0c0' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1rem', padding: '5px', width:'40%' }}>Product</TableCell>
                    <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1rem', padding: '5px' }}>Quantity</TableCell>
                    {isAuth && <TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1rem', padding: '5px' }}>Price</TableCell>}
                    {isAuth && (<TableCell sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1rem', padding: '5px' }}>Sales</TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(isAuth ? filteredItems : items).map((item) => (
                    <TableRow key={`${item.store_id}-${item.product_id}`}>
                      <TableCell sx={{ fontSize: '1rem', padding: '5px' }}>{item.inventory.product_name}</TableCell>
                      <TableCell sx={{ fontSize: '1rem', padding: '5px' }}>{item.quantity}</TableCell>
                      {isAuth && <TableCell sx={{ fontSize: '1rem', padding: '5px', fontWeight: 600 }}>₹{item.inventory.price}</TableCell>}
                      {isAuth && <TableCell sx={{ fontSize: '1rem', padding: '5px', fontWeight: 600 }}>₹{item.quantity * item.inventory.price}</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}
    </Box>
  );
};

export default StoreInventoryBillTable;