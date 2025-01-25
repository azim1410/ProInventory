import React, { useEffect, useState } from 'react';
import { fetchInventoryByCategory } from '../features/CategoryServices';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { PRIMARY_CLR } from '../assets/colors';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import PageHeader from '../components/PageHeader';

const CategoryOrders = () => {
  const [data, setData] = useState<{ [key: string]: { product_name: string; total_quantity: number }[] } | null>(null);


  const navigate = useNavigate();
  useEffect(() => {
    const getCategoryWiseData = async () => {
      try {
        const response = await fetchInventoryByCategory();
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getCategoryWiseData();
  }, []);

  const handlePrintPage = () => {
    window.print();
  }

  return (
    <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom:'1rem',padding:'1rem' }} className="hide-print" >
          <Button sx={{ fontSize: '3rem', color: PRIMARY_CLR }} onClick={() => navigate(-1)}>
            <IoMdArrowBack />
          </Button>
          <Button sx={{ fontSize: '3rem', backgroundColor: PRIMARY_CLR, height:'3rem', borderRadius:3 }} variant="contained" onClick={() => handlePrintPage()}>
            <Typography>PRINT</Typography>
          </Button>
        </Box>
      <Box sx={{ width: {xs:'90%', sm:'70%'}, margin: 'auto' }}>
        <TableContainer component={Paper}>
          <Table>
            {/* Table Head */}
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} style={{ textAlign: 'center', backgroundColor: '#f5f5f5'}}>
                  <PageHeader title='Summary'/>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {data ? (
                Object.keys(data).map((categoryName) => (
                  <React.Fragment key={categoryName}>
                    {/* Category Row */}
                    <TableRow style={{ backgroundColor: '#f0f0f0' }}>
                      <TableCell colSpan={2} sx={{paddingLeft:'5px', paddingRight:'5px', paddingTop:'10px', paddingBottom:'10px'}}>
                        <Typography variant="subtitle1"  sx={{color:PRIMARY_CLR, fontWeight: 700}}>
                          {categoryName}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* Product Rows */}
                    {data[categoryName].filter((product) => product.total_quantity > 0).map((product, index) => (
                      <TableRow key={index} style={{ height: '32px' }}>
                        <TableCell sx={{fontSize:'1rem',padding:'5px'}}>{product.product_name}</TableCell>
                        <TableCell sx={{fontSize:'1.2rem', fontWeight: 600, padding:'5px'}}>{product.total_quantity}</TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                    <Typography variant="body1">Loading...</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CategoryOrders;
