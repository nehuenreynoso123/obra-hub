import { Product } from '../../domain/Product';
import { ProductRepository } from '../../domain/ProductRepository';
import { CreatePoductRequest } from './CreateProductRequest';
import { ProductName } from '../../domain/ProductName';
import { ProductId } from '../../../Shared/domain/Products/ProductId';
import { ProductPrice } from '../../domain/ProductPrice';
import { ProductDescription } from '../../domain/ProductDescription';

export class ProductCreator {
  constructor(private repository: ProductRepository) {}

  async run(request: CreatePoductRequest): Promise<void> {
    const product = new Product({
      id: new ProductId(request.id),
      name: new ProductName(request.name),
      description: new ProductDescription(request.description),
      price: new ProductPrice(request.price)
    });

    return this.repository.save(product);
  }
}
