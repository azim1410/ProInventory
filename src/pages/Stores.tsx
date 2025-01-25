import React, { useState } from 'react'
import { supabase } from '../database/supabaseClient';
import { Box, Button, Modal, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import AddProductBtn from '../components/AddProduct';
import TextInp from '../components/InputFeilds';
import StoreTable from '../components/StoreTable';
import { IoMdArrowBack } from "react-icons/io";
import { CONTAINER_BG_CLR, PRIMARY_CLR } from '../assets/colors';
import { useNavigate } from 'react-router-dom';
const Stores = () => {
    const [openModal, setOpenModal] = useState(false);
    const [newStore, setNewStore] = useState({
        store_name: '',
        store_short_name: '',
        store_route_name: ''
    })
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewStore((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddStore = async () => {
        const { error } = await supabase
            .from("stores")
            .insert([newStore]);

        if (error) {
            console.error("Error adding Store:", error);
        } else {
            handleCloseModal();
        }
    };

    const navigate = useNavigate();
    return (
        <Box sx={{padding:'1rem', backgroundColor: CONTAINER_BG_CLR}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <PageHeader title="Stores" />
            </Box>
            <Box sx={{display:'flex', justifyContent:'space-between'}}>
                <Button sx={{fontSize:'3rem', color:PRIMARY_CLR}} onClick={() => navigate(-1)}>
                    <IoMdArrowBack />
                </Button>
                <AddProductBtn title='Add Store' onChange={handleOpenModal} />
            </Box>
            <StoreTable />
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
                        Add New Store
                    </Typography>

                    <TextInp label='Store Name' name="store_name" value={newStore.store_name}
                        onChange={handleChange} />

                    <TextInp label='Shortname' name="store_short_name" value={newStore.store_short_name}
                        onChange={handleChange} />

                    <TextInp label='Route' name="store_route_name" value={newStore.store_route_name}
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
                            onClick={handleAddStore}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

export default Stores