import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { CONTAINER_BG_CLR } from '../../assets/colors';
import { FaChevronRight } from "react-icons/fa6";

type NavBtn = {
  title: string,
  nav: string,
  icon: JSX.Element | null;
}
const NavBtn = ({ title, nav, icon }: NavBtn) => {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(`${nav}`)}

      sx={{
        color: '#2b4257',
        justifyContent: 'space-between',
        textAlign: 'left',
        width: '100%',
        borderRadius: 4,
        ":hover": {
          boxShadow: 'rgba(41, 54, 84, 0.44) 0px 4px 12px',
        },
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',
        marginBottom: '1rem',
        backgroundColor: CONTAINER_BG_CLR,
        paddingTop: '0.7rem',
        paddingBottom: '0.7rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ marginRight: '1rem', fontSize: 25 }}>{icon}</Typography>
        <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>{title}</Typography>
      </Box>
      <FaChevronRight />
    </Button>
  )
}

export default NavBtn