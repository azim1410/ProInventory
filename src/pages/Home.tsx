import { Box, Button, Modal, Typography } from '@mui/material';
import NavBtn from '../components/Navbar/NavBtn';
import { BsBasket, BsCart2 } from "react-icons/bs";
import { TbRouteAltRight } from "react-icons/tb";
import NavLogo from '../components/Navbar/NavLogo';
import { GrUserAdmin } from "react-icons/gr";
import { IoPricetagOutline, IoStorefrontOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { IoLogOutOutline } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { loginSuccess, logout } from '../features/Auth/AuthSlice';
import TextInp from '../components/InputFeilds';
import { IoPieChartOutline } from "react-icons/io5";
import { fetchAllStores } from '../features/StoreServices';
import { setStores } from '../features/Stores/StoreSlice';
import StoreList from '../components/StoresList';
import { toast } from 'react-toastify';
import AdminBillingStoreList from '../components/AdminBillingStoresList';

const Home = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [pass, setPass] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const dispatch = useDispatch();

  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  console.log(isAuth);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const notifySuccess = () => toast.success('Authenticated ✅', {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const handleLogin = () => {
    if (pass === "test") {
      dispatch(loginSuccess());
      setPass('');
      handleCloseModal();
      notifySuccess();
    }
    else {
      setErr("Wrong Password");
      console.log("wrong password");
    }
  }


  const handleLogout = () => {
    dispatch(logout());
  }


  useEffect(() => {
    const getData = async () => {
      const response = await fetchAllStores();
      dispatch(setStores(response));
    };
    getData();
  }, [dispatch]);


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'right', marginTop: '1rem', marginRight: '1rem' }}>
        {isAuth === true ? (
          <Button sx={{ fontSize: '3rem', backgroundColor: "#14202e", height: '2.5rem', borderRadius: 3 }} variant="contained" onClick={handleLogout}>
            <IoLogOutOutline size={"1rem"} />
            <Typography sx={{ marginLeft: '0.3rem', fontSize: '0.8rem' }}>Logout</Typography>
          </Button>
        ) : (
          <Button sx={{ fontSize: '3rem', backgroundColor: "#14202e", height: '2.5rem', borderRadius: 3 }} variant="contained" onClick={handleOpenModal}>
            <GrUserAdmin size={"1rem"} />
            <Typography sx={{ marginLeft: '0.3rem', fontSize: '0.8rem' }}>Admin</Typography>
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, padding: '2rem', justifyContent: 'space-around', alignItems: 'baseline' }}>

        {/* left */}
        <Box sx={{
          width: { xs: '100%', sm: '40%' }, borderRadius: 4, height: 'max-content',
          marginTop: '2rem', margin: { xs: 'auto', sm: 0 },
        }}>
          <Box sx={{ marginBottom: '2rem' }}>
            <NavLogo companyName='ProInventory' />
          </Box>
          <NavBtn title="Inventory" nav="/inventory" icon={<BsCart2 />} />
          <NavBtn title='Category' nav="/category" icon={<IoPricetagOutline />} />

          {isAuth &&
            <Box>
              <Box sx={{ marginBottom: '2rem' }}>
                <NavLogo companyName='Admin' />
              </Box>
              <NavBtn title="Stores" nav="/store" icon={<IoStorefrontOutline />} />
              <NavBtn title='Inventory Sales' nav="/inventory-sales" icon={<IoPieChartOutline />} />
              <AdminBillingStoreList />
            </Box>
            }

        </Box>

        {/* right */}
        <Box sx={{
          width: { xs: '100%', sm: '40%' }, borderRadius: 4, height: 'max-content',
          marginTop: '2rem', margin: { xs: 'auto', sm: 0 },
        }}>
          <Box sx={{ marginBottom: '2rem' }}>
            <NavLogo companyName='Daily Prints' />
          </Box>

          <NavBtn nav='/category-orders' title='Orders By Category' icon={<BsBasket />} />
          <NavBtn nav="/route-order" title='Order By Route' icon={<TbRouteAltRight />} />



          <StoreList />

        </Box>
      </Box>

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
            Enter Password
          </Typography>

          <TextInp label='Password' name="password" value={pass}
            onChange={(e) => setPass(e.target.value)} />

          <Typography variant="h6" sx={{ fontWeight: 200, color: '#f07979' }}>
            {err}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              sx={{ marginRight: 1, backgroundColor: '#1b2f47', boxShadow: 'none' }}
              onClick={handleLogin}
            >
              Authenticate
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  )
}

export default Home
