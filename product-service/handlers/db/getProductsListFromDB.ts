import ProductsListMock from '../productsList.mock.json';
import { Product } from '../models/Product';


export function getProductListFromDB(): Product[] {
    return ProductsListMock;
}
