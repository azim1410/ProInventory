
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import StoreInventoryTable from '../components/StoreInventoryTable';
import { IoMdArrowBack } from 'react-icons/io';
import { CONTAINER_BG_CLR, PRIMARY_CLR } from '../assets/colors';

const StoreInventory = () => {
    const { store_id, store_name } = useParams();
    console.log(store_name);
    const navigate = useNavigate();
    const handlePrintPage = () => {
        window.print();
    }
    return (
        <Box sx={{ padding: '1rem', backgroundColor: CONTAINER_BG_CLR }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <PageHeader title={store_name} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} className="hide-print" >
                <Button sx={{ fontSize: '3rem', color: PRIMARY_CLR }} onClick={() => navigate(-1)}>
                    <IoMdArrowBack />
                </Button>
                <Button sx={{ fontSize: '3rem', backgroundColor: PRIMARY_CLR, height: '3rem', borderRadius: 3 }} variant="contained" onClick={() => handlePrintPage()} >
                    <Typography>PRINT</Typography>
                </Button>
            </Box>
            <StoreInventoryTable store_id={store_id} />
        </Box>
    )
}

export default StoreInventory