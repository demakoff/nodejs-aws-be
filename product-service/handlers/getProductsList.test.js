import { getProductsList } from './getProductsList';
import { getProductListFromDB } from './db/getProductsListFromDB';

jest.mock('./db/getProductsListFromDB');

describe('Get products list', () => {

    it('Should return successful response object with 200 status and body with products', async () => {
        const mockProducts = [{ id: 1 }, { id: 2 }];

        getProductListFromDB.mockResolvedValue(mockProducts);
        const result = await getProductsList();

        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify(mockProducts)
        });
    });

    it('Should return response object with 404 status and body with error message if no products found', async () => {
        getProductListFromDB.mockResolvedValue([]);

        const result = await getProductsList();

        expect(result).toEqual({
            statusCode: 404,
            body: 'Products not found'
        });
    });

});
