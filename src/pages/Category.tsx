import React, { useState } from 'react'
import CategoryTable from '../components/CategoryTable'
import { Box, Button, Modal, Typography } from '@mui/material'
import PageHeader from '../components/PageHeader'
import AddProductBtn from '../components/AddProduct'
import TextInp from '../components/InputFeilds'
import { supabase } from '../database/supabaseClient'
import { IoMdArrowBack } from 'react-icons/io'
import { CONTAINER_BG_CLR, PRIMARY_CLR } from '../assets/colors'
import { useNavigate } from 'react-router-dom'

const Category = () => {
    const [openModal, setOpenModal] = useState(false);
    const [newCategory, setNewCategory] = useState({
        category_name: '',
        description: '',
    })
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const navigate = useNavigate();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCategory((prev) => ({
          ...prev,
          [name]:  value,
        }));
      };

     const handleAddCategory = async () => {
         const { error } = await supabase
           .from("category")
           .insert([newCategory]);
     
         if (error) {
           console.error("Error adding product:", error);
         } else {
           handleCloseModal();
         }
       };
  return (
    <Box sx={{padding:'1rem', backgroundColor: CONTAINER_BG_CLR}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <PageHeader title="Category" />
                </Box>
                <Box sx={{display:'flex', justifyContent:'space-between'}}>
                                <Button sx={{fontSize:'3rem', color:PRIMARY_CLR}} onClick={() => navigate(-1)}>
                                    <IoMdArrowBack />
                                </Button>
                    <AddProductBtn title='Add Category' onChange={handleOpenModal} />
                            </Box>
        <CategoryTable />
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
                            Add New Category
                        </Typography>

                        <TextInp label='Category Name' name="category_name" value={newCategory.category_name}
                            onChange={handleChange} />

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
                                onClick={handleAddCategory}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                </Modal>
    </Box>
    
  )
}

export default Category