import { Box, TextField, Button, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
type SearchBarProps = {
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
};

const SearchBar = ({ value, onChange }: SearchBarProps) => {

  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const handleRefreshPage = () => {
    // Refresh the page
    window.location.reload();
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'1rem', marginBottom:'1rem' }}>
      <TextField
        value={value}
        onChange={onChange}
        id="search"
        label="🔍 Search"
        variant="outlined"
        sx={{
          backgroundColor: "white",
          width: { sm: "60%", xs: '100%' },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#e8e8e8",
              borderWidth: "2px",
              borderRadius: '10px'
            },
            "&:hover fieldset": {
              borderColor: "#aaaaaa",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#e8e8e8",
              borderWidth: "2px",
            },
          },
        }}
      />

      {!isAuth && <Button
        onClick={handleRefreshPage}
        variant="text"
        sx={{
          height: '56px', 
          borderRadius: '10px',
          borderColor: '#ffa5a5',
          color: '#666666',
          borderWidth: "2px",
          marginLeft:'0.3rem',
          "&:hover": {
            borderColor: "#ffa5a5",
            backgroundColor: "#ffd8d8", // Slight background on hover for better UX
          },
        }}
      >
        <Typography sx={{color:'#ffa5a5', fontSize:'0.7rem'}}>Refresh</Typography>
       <RefreshIcon sx={{color:'#ffa5a5'}}/>
      </Button>}
    </Box>
  )
}

export default SearchBar