import { Box, Typography } from '@mui/material';
import { HEADER_TXT_CLR } from '../../assets/colors';

type PageHeaderProps = {
  title: string | undefined;
};

const getOrdinalNum = (n: number) => {
  return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
};

const formatDate = (date: Date) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${getOrdinalNum(day)} ${monthNames[monthIndex]} ${year}`;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  const today = new Date();
  const formattedDate = formatDate(today);
  return (
    <Box sx={{justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <Typography sx={{ fontWeight: 200, color: HEADER_TXT_CLR, fontSize: '3rem', textAlign: 'left' }}>{title}</Typography>
      <Typography sx={{ fontWeight: 200, color: HEADER_TXT_CLR, fontSize: '1.4rem', textAlign: 'left' }}>{formattedDate}</Typography>
    </Box>
  );
};

export default PageHeader;