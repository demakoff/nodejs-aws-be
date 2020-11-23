export interface Product {
  id: string,
  year: number,
  engine: string,
  imageUrl: string,
  title: string,
  price: number,
}

export interface ProductExtended extends Product {
  count: number
}
