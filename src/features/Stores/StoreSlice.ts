import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export type StoreState =  {
    store_id: string,
    store_name: string,
    store_route_name: string,
    store_short_name: string,
}

export type stores = {
    stores: StoreState[],
}

const initialState: stores = {
    stores: []
}

export const StoreSlice = createSlice({
    name: 'stores',
    initialState,
    reducers: {
        setStores(state, action: PayloadAction<StoreState[]>){
            state.stores = action.payload;
        }
    }
})


export const { setStores } = StoreSlice.actions;
export default StoreSlice.reducer;