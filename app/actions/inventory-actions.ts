'use server';

import sql from '@/db';
import { Asset, AssetCategory } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// Mapper function
function mapRowToAsset(row: any): Asset {
    return {
        id: row.id,
        name: row.name,
        category: row.category as AssetCategory,
        brand: row.brand,
        model: row.model,
        quantity: row.quantity,
        available: row.available_quantity,
        status: row.status,
        purchaseDate: row.purchase_date,
        purchasePrice: row.purchase_price ? Number(row.purchase_price) : undefined,
        lastServiceDate: row.last_service_date,
        nextServiceDate: row.next_service_date,
    };
}

export async function fetchAssetsAction() {
    try {
        const rows = await sql`SELECT * FROM inventory ORDER BY name ASC`;
        return { success: true, data: rows.map(mapRowToAsset) };
    } catch (error) {
        console.error('Fetch Assets Error:', error);
        return { success: false, error: 'Failed to fetch inventory' };
    }
}

export async function addAssetAction(data: Partial<Asset>) {
    try {
        const assetData = {
            name: data.name,
            category: data.category,
            brand: data.brand ?? null,
            model: data.model ?? null,
            quantity: data.quantity,
            available_quantity: data.quantity, // Initially same as total
            status: data.status || 'available',
            purchase_price: data.purchasePrice ?? null,
            purchase_date: data.purchaseDate ? new Date(data.purchaseDate).toISOString() : null,
        };

        const [newAsset] = await sql`
      INSERT INTO inventory ${sql(assetData)}
      RETURNING *
    `;

        revalidatePath('/admin/inventory');
        return { success: true, data: mapRowToAsset(newAsset) };
    } catch (error) {
        console.error('Add Asset Error:', error);
        return { success: false, error: 'Failed to add equipment' };
    }
}
