import { Product } from '../models/Product';
import { runQuery } from './dbClient';
import { CustomError } from "../utils/CustomError";

export async function getProductListFromDB(): Promise<Product[]> {

    try {
        return await runQuery<Product[]>(`SELECT 
            p.id, p.title, p.year, p.engine, p.price, p.image_url, s.count 
            FROM products p
            LEFT JOIN stock s
            ON p.id = s.product_id;`);

    } catch (e) {
        throw new CustomError({
            message: 'Cannot get products from DB',
            code: 500
        });
    }
}
