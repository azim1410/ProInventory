import React, { useState, useEffect } from 'react';
import { supabase } from '../database/supabaseClient';
import { Box, Button, Modal, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import PageHeader from '../components/PageHeader';
import AddProductBtn from '../components/AddProduct';
import TextInp from '../components/InputFeilds';
import { CategoryProps } from '../features/CategoryServices';
import { IoMdArrowBack } from 'react-icons/io';
import { CONTAINER_BG_CLR, PRIMARY_CLR } from '../assets/colors';
import { useNavigate } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material';
import InventorySalesTable from '../components/InventorySalesTable';
import "../App.css";

const InventorySales = () => {
    const [openModal, setOpenModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        product_name: '',
        price: '',
        total_quantity: 0,
        category_id: '', // This will store the selected category ID
    });

    const [categories, setCategories] = useState<CategoryProps[]>([]); // This will store the fetched categories

    useEffect(() => {
        // Fetch categories from the 'Category' table when the component mounts
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('category').select('*');
            if (error) {
                console.error('Error fetching categories:', error);
            } else {
                setCategories(data);
            }
        };

        fetchCategories();
    }, []);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({
            ...prev,
            [name as string]: value,
        }));
    };

    const handleAddProduct = async () => {
        const { error } = await supabase.from("inventory").insert([newProduct]);

        if (error) {
            console.error("Error adding Inventory:", error);
        } else {
            handleCloseModal();
        }
    };
    const navigate = useNavigate();

    const handlePrint = () => {
        window.print();
    }

      

    return (
        <Box sx={{backgroundColor:CONTAINER_BG_CLR, padding:'1rem'}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <PageHeader title="Inventory Sales" />
            </Box>
                <Box sx={{display:'flex', justifyContent:'end'}} className="hide-print">
                <AddProductBtn title='Add Product' onChange={handleOpenModal} />
                </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop:'1rem' }} className="hide-print" >
                      <Button sx={{ fontSize: '3rem', color: PRIMARY_CLR }} onClick={() => navigate(-1)}>
                        <IoMdArrowBack />
                      </Button>
                      <Button sx={{ fontSize: '3rem', }} variant="outlined" onClick={() => handlePrint()}>
                        <Typography>PRINT</Typography>
                      </Button>
                    </Box>
            <InventorySalesTable />
            <Modal open={openModal} onClose={handleCloseModal}>
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
                        Add New Product
                    </Typography>

                    <TextInp 
                        label='Product name' 
                        name="product_name" 
                        value={newProduct.product_name} 
                        onChange={handleChange} 
                    />

                    <TextInp 
                        label='Price' 
                        name="price" 
                        value={newProduct.price} 
                        onChange={handleChange} 
                    />

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category_id"
                            value={newProduct.category_id}
                            onChange={handleChange}
                            label="Category"
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                            variant="contained"
                            sx={{ marginRight: 1, backgroundColor: '#1b2f47', boxShadow: 'none' }}
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#1b2f47', boxShadow: 'none' }}
                            onClick={handleAddProduct}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default InventorySales;
