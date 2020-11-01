import ProductsListMock from '../productsList.mock.json';
import { Product } from '../models/Product';


export function getProductByIdFromDB(id): Product {
    return ProductsListMock.find(prod => prod.id === id);
}
