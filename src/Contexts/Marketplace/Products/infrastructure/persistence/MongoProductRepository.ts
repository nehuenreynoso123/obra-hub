import { Nullable } from '../../../../Shared/domain/Nullable';
import { MongoRepository } from '../../../../Shared/infrastructure/persistence/mongo/MongoRepository';
import { ProductId } from '../../../Shared/domain/Products/ProductId';
import { Product } from '../../domain/Product';
import { ProductRepository } from '../../domain/ProductRepository';

interface ProductDocument {
  _id: string;
  name: string;
  description: string;
  price: number;
}

export class MongoProductRepository extends MongoRepository<Product> implements ProductRepository {
  public save(product: Product): Promise<void> {
    return this.persist(product.id.value, product);
  }

  public async search(id: ProductId): Promise<Nullable<Product>> {
    const collection = await this.collection();
    const document = await collection.findOne<ProductDocument>({ _id: id.value });
    return document
      ? Product.fromPrimitives({
          name: document.name,
          description: document.description,
          price: document.price,
          id: id.value
        })
      : null;
  }

  public async remove(id: string): Promise<void> {
    const collection = await this.collection();
    await collection.deleteOne({ _id: id });
  }

  protected collectionName(): string {
    return 'products';
  }
}
