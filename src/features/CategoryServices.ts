import { supabase } from "../database/supabaseClient";


export type CategoryProps = {
    category_id: string,
    category_name: string,
    description: string,
}

export const addCategory = async (categoryName: string, description: string) => {
    const { data, error } = await supabase
        .from('Category')
        .insert([{ category_name: categoryName, description }]);

    if (error) {
        console.error('Error adding category:', error);
    } else {
        console.log('Category added successfully:', data);
    }
};



export const fetchAllCategories = async () => {
    const { data, error } = await supabase
        .from('category')
        .select('*'); // Select all columns

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    } else {
        console.log('Fetched categories:', data);
        return data; // Returns an array of categories
    }
};

// type CatProp = {
//     category_name: string | undefined
// }
// type DataProps = {
//     product_name: string;
//     total_quantity: number;
//     category: CatProp
// }



// export const fetchInventoryByCategory = async () => {
//     const { data, error } = await supabase
//         .from('inventory')
//         .select(`
//             product_name,
//             total_quantity,
//             category:category_id!inner (
//                 category_name
//             )
//         `)
//         .order('category_name', { foreignTable: 'category' }) // Order by category name
//         .order('product_name'); // Order by product name within each category

//     if (error) {
//         console.error('Error fetching inventory by category:', error);
//         return null;
//     }

//     console.log(data);
//     // Transform data to group by category name
//     const groupedData: { [categoryName: string]: { product_name: string; total_quantity: number }[] } = {};

//     data?.forEach((item: DataProps) => {
//         const categoryName = item.category.category_name || 'Uncategorized';
//         if (!groupedData[categoryName]) {
//             groupedData[categoryName] = [];
//         }
//         groupedData[categoryName].push({
//             product_name: item.product_name,
//             total_quantity: item.total_quantity,
//         });
//     });

//     return groupedData;
// };



export type CategoryProps2 = {
    category_name: string;
};

export type InventoryItem = {
    product_name: string;
    total_quantity: number;
    category: CategoryProps2; // No longer an array
};

export const fetchInventoryByCategory = async () => {
    const { data, error } = await supabase
        .from('inventory')
        .select(`
            product_name,
            total_quantity,
            category:category_id (
                category_name
            )
        `)
        .order('category_name', { foreignTable: 'category' })
        .order('product_name');

    if (error) {
        console.error('Error fetching inventory by category:', error);
        return null;
    }

    console.log(data);

    const groupedData: { [categoryName: string]: { product_name: string; total_quantity: number }[] } = {};
    // @ts-expect-error ddd
    data?.forEach((item: InventoryItem) => {
        // Check if category array is not empty, pick first item
        const categoryName = item.category.category_name || 'Uncategorized';
        if (!groupedData[categoryName]) {
            groupedData[categoryName] = [];
        }
        groupedData[categoryName].push({
            product_name: item.product_name,
            total_quantity: item.total_quantity
        });
    });

    return groupedData;
};