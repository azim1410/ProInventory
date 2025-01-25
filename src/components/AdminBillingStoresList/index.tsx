import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { Box } from '@mui/material';
import NavLogo from '../Navbar/NavLogo';
import NavBtn from '../Navbar/NavBtn';
import { CiShop } from "react-icons/ci";

const AdminBillingStoreList = () => {
    const allStores = useSelector((state: RootState) => state.store.stores);
    console.log(allStores);
    
  
  return (
    <Box sx={{
         borderRadius: 4, height: 'max-content',
        marginTop: '2rem', margin: { xs: 'auto', sm: 0 },
      }}>
        
        <Box sx={{ marginBottom: '2rem' }}>
            <NavLogo companyName='Billing' />
          </Box>

          {
            allStores.map((store) => (
                <NavBtn nav={`/billing-store/${store.store_id}/${store.store_name}`} title={store.store_name} icon={<CiShop />} />
            ))
          }
    </Box>
  )
}

export default AdminBillingStoreList