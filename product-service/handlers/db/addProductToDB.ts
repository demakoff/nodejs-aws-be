import { Product, ProductExtended } from '../models/Product';
import { runQuery } from './dbClient';
import { CustomError } from "../utils/CustomError";

export async function addProductToDB(data: ProductExtended): Promise<Product[]> {

    const { title, year, engine, price, imageUrl, count } = data;
    try {
        return await runQuery<any>(`
            BEGIN;
            
            WITH new_product AS (
              INSERT INTO products (title, year, engine, price, imageUrl) VALUES
                ('${title}', ${year}, '${engine}', ${price}, '${imageUrl}')
              RETURNING id
            )
            
            INSERT INTO stock (product_id, count) VALUES 
            ((SELECT id FROM new_product), ${count});
            
            COMMIT;`);

    } catch (e) {
        throw new CustomError({
            message: 'Cannot save product to DB: '+ e,
            code: 500
        });
    }
}
