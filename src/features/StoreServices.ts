import { supabase } from "../database/supabaseClient";


export type StoreProps = {
    store_id: string,
        store_name: string,
        store_short_name: string,
        store_route_name: string
}

export const fetchAllStores = async () => {
    const { data, error } = await supabase
        .from('stores')
        .select('*'); // Select all columns

    if (error) {
        console.error('Error fetching stores:', error);
        return [];
    } else {
        console.log('Fetched Stores:', data);
        return data; // Returns an array of categories
    }
};


export const fetchStoreInventory = async (storeId: string | undefined) => {
    const { data, error } = await supabase
    .from('store_inventory')
    .select(`
        id,
        store_id,
        product_id,
        quantity,
        inventory:product_id ( 
            product_name,
            price,
            category:category_id ( 
                category_name
            )
        )
    `)
    .eq('store_id', storeId);

    if (error) {
        console.error('Error fetching store inventory:', error);
        return null;
    }
    const transformedData = data?.map((item) => ({
        ...item,
        // @ts-expect-error ddd
        category_name: item.inventory?.category?.category_name || 'Uncategorized', // Safely access category_name
        // You might want to adjust what you retain in this object based on your needs.
    }));

    return transformedData;
};



export const updateStoreInventory = async (id: string, newQuantity: number) => {
    const { data, error } = await supabase
        .from('store_inventory')
        .update({ quantity: newQuantity })
        .eq('id', id);

    if (error) {
        console.error('Error updating store inventory:', error);
        return null;
    }
    return data;
};
