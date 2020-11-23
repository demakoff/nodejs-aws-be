import {APIGatewayProxyHandler} from 'aws-lambda';

import { addProductToDB } from './db/addProductToDB';
import { CustomError } from "./utils/CustomError";
import { ProductExtended } from "./models/Product";

export const addProduct: APIGatewayProxyHandler = async (event) => {

    console.log(JSON.stringify(event));

    try {
        const body = JSON.parse(event.body);

        if (typeof body !== 'object' || body === null) throw new CustomError({
            message: 'Invalid product data',
            code: 400
        });

        const { title, year, engine, price, imageUrl, count }: ProductExtended = body;

        if (title === undefined
            || year === undefined
            || engine === undefined
            || price === undefined
            || imageUrl === undefined
            || count === undefined) throw new CustomError({
            message: 'Invalid product data',
            code: 400
        });

        const ProductsList = await addProductToDB({ title, year, engine, price, imageUrl, count } as ProductExtended);

        return {
            statusCode: 200,
            body: JSON.stringify(ProductsList),
        };

    } catch(err) {
        return {
            statusCode: err.code,
            body: err.message
        };
    }
};
