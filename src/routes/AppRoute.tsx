import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from '../pages/Home';
import Category from '../pages/Category';
import Stores from '../pages/Stores';
import Inventory from '../pages/Inventory';
import StoreInventory from '../pages/StoreInventory';
import CategoryOrders from '../pages/CategoryOrders';
import RouteWiseInventory from '../pages/RouteWiseInventory';
import InventorySales from '../pages/InventorySales';
import StoreBilling from '../pages/StoreBilling';


const AppRoute = () => {
  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path="/category" element={<Category />}/>
            <Route path='/store/:store_id/:store_name' element={<StoreInventory />}/>
            <Route path='/billing-store/:store_id/:store_name' element={<StoreBilling />}/>
            <Route path="/inventory" element={<Inventory />}/>
            <Route path="/category-orders" element={<CategoryOrders />}/>
            <Route path="/route-order" element={<RouteWiseInventory />}/>
            <Route path='/store' element={<Stores />}/>
            <Route path="/inventory-sales" element={<InventorySales />}/>
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default AppRoute