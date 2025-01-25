import { Box, Typography } from '@mui/material'

import { PRIMARY_CLR } from '../../assets/colors'

const GlobalNav = () => {
  return (
    <Box sx={{
        backgroundColor: '#9be0c3', display: 'flex', justifyContent: 'space-around', alignItems: 'center', position: 'sticky', top: 4,
        flex: 1,
        width: '98%',
        height: '3.5rem',
        zIndex: 5,
        background: 'transparent', backdropFilter: 'blur(20px)', margin:'auto', borderRadius: 3
    }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: PRIMARY_CLR, fontSize: '2rem', }}>ProInventory</Typography>
    </Box>
  )
}

export default GlobalNav