

import { supabase } from "../database/supabaseClient";

export type InventoryProps = {
    product_id: string;
    product_name: string;
    price: number;
    total_quantity: number;
    category_id: string;
    category_name: string; // Add this to include category name in your type
}

export const fetchAllProducts = async (): Promise<InventoryProps[]> => {
    const { data, error } = await supabase
        .from('inventory')
        .select(`
            product_id,
            product_name,
            price,
            total_quantity,
            category_id,
            category:category_id ( 
                category_name
            )
        `); // Use a specific select statement with a join on the category

    if (error) {
        console.error('Error fetching Inventory data:', error);
        return [];
    }

    const transformedData = data?.map((item) => ({
        ...item,
        // @ts-expect-error ddd
        category_name: item.category?.category_name || 'Uncategorized', // Safely access category_name
    })) || [];

    console.log('Fetched Inventory:', transformedData);
    return transformedData; // Returns an array of inventory items with category names
};
