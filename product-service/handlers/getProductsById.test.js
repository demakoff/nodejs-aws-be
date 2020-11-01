import { getProductsById } from './getProductsById';
import { getProductByIdFromDB } from './db/getProductByIdFromDB';

jest.mock('./db/getProductByIdFromDB');

let mockRequest;
let mockProduct;

describe('Get products by ID', () => {

    beforeEach(() => {
        mockRequest = { pathParameters: { id: 'fc73c48a80aa' } };
        mockProduct = { id: 'fc73c48a80aa' };
    });

    it('Should return successful response object with 200 status and body with a product', async () => {
        getProductByIdFromDB.mockResolvedValue(mockProduct);

        const result = await getProductsById(mockRequest);

        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify(mockProduct)
        });
    });

    it('Should return response object with 404 status and body with error message if no product found', async () => {
        getProductByIdFromDB.mockResolvedValue();

        const result = await getProductsById(mockRequest);

        expect(result).toEqual({
            statusCode: 404,
            body: 'Product not found'
        });
    });

    it('Should return response object with 400 status and body with error message if invalid Id used', async () => {
        getProductByIdFromDB.mockResolvedValue(mockProduct);

        mockRequest.pathParameters.id = 'invalid-id';
        const result = await getProductsById(mockRequest);

        expect(result).toEqual({
            statusCode: 400,
            body: 'Invalid ID supplied'
        });
    });

});
