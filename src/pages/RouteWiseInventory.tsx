

import { useEffect, useState } from 'react';
import { supabase } from '../database/supabaseClient';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
    Box,
    Button,
} from '@mui/material';
import { CONTAINER_BG_CLR, HEADER_TXT_CLR, PRIMARY_CLR } from '../assets/colors';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';

// Define the type for product data
type ProductType = {
    product_name: string;
    quantity: number;
    route_name: string;
    store_name: string;
};

// Define the type for grouped routes
type GroupedRoutesType = {
    [route_name: string]: ProductType[];
};
type TransformedRowType = {
    product_name: string;
    total_quantity: number;
    [store: string]: number | string; // Allow dynamic keys for store names
};


const RouteWiseInventory = () => {
    const [groupedRoutes, setGroupedRoutes] = useState<GroupedRoutesType>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const { data, error } = await supabase.rpc('get_route_wise_inventory_dynamic');

                if (error) {
                    console.error('Error fetching inventory data:', error);
                    setError('Error fetching inventory data.');
                } else if (data) {
                    console.log('Fetched inventory data:', data);

                    // Group data by route
                    const groupedData = data.reduce((acc: GroupedRoutesType, item: ProductType) => {
                        if (!acc[item.route_name]) {
                            acc[item.route_name] = [];
                        }
                        acc[item.route_name].push(item);
                        return acc;
                    }, {});

                    setGroupedRoutes(groupedData);
                }
            } catch (fetchError) {
                console.error('Unexpected error:', fetchError);
                setError('Unexpected error occurred while fetching inventory data.');
            } finally {
                setLoading(false);
            }
        };

        fetchInventoryData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    const transformDataForTable = (data: ProductType[]): TransformedRowType[] => {
        const productMap: Record<string, Record<string, number>> = {};

        data.forEach(({ product_name, store_name, quantity }) => {
            if (!productMap[product_name]) {
                productMap[product_name] = {};
            }
            productMap[product_name][store_name] = quantity;
        });

        return Object.entries(productMap).map(([product_name, stores]) => ({
            product_name,
            ...stores,
            total_quantity: Object.values(stores).reduce((sum, qty) => sum + qty, 0),
        }));
    };

    return (
        <Box sx={{ padding: '1rem', backgroundColor: CONTAINER_BG_CLR }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} className="hide-print" >
                <Button sx={{ fontSize: '3rem', color: PRIMARY_CLR }} onClick={() => navigate(-1)}>
                    <IoMdArrowBack />
                </Button>
                <Button sx={{ fontSize: '3rem', backgroundColor: PRIMARY_CLR ,height:'3rem', borderRadius: 3}} variant="contained" onClick={handlePrint}>
                    <Typography>PRINT</Typography>
                </Button>
            </Box>
            <Box>
                {error && <Typography color="error">{error}</Typography>}
                {!error &&
                    Object.entries(groupedRoutes).map(([routeName, data]) => {
                        const transformedData = transformDataForTable(data);
                        const uniqueStores = Array.from(new Set(data.map((item) => item.store_name)));

                        return (
                            <Paper key={routeName} elevation={0} style={{ padding: '1rem' }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ color: HEADER_TXT_CLR, fontWeight: 600, textAlign: 'left' }}
                                >
                                    Route: {routeName.toUpperCase()}
                                </Typography>
                                <TableContainer component={Paper} sx={{boxShadow:'none', border:'0.5px solid #c4c0c0', borderRadius: '10px'}}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1rem',padding:'5px' }}
                                                >
                                                    Item
                                                </TableCell>
                                                {uniqueStores.map((store) => (
                                                    <TableCell
                                                        key={store}
                                                        align="center"
                                                        sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1rem',padding:'5px' }}
                                                    >
                                                        <strong>{store}</strong>
                                                    </TableCell>
                                                ))}
                                                <TableCell
                                                    align="center"
                                                    sx={{ color: PRIMARY_CLR, fontWeight: 600, fontSize: '1rem', padding:'5px' }}
                                                >
                                                    Total
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {transformedData.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{padding:'5px'}}>{row.product_name}</TableCell>
                                                    {uniqueStores.map((store) => (
                                                        <TableCell key={store} align="center" sx={{padding:'5px'}}>
                                                            {row[store] || 0}
                                                        </TableCell>
                                                    ))}
                                                    <TableCell align="center" sx={{fontWeight: 800, padding:'5px'}}>{row.total_quantity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        );
                    })}
            </Box>
        </Box>
    );
};

export default RouteWiseInventory;
