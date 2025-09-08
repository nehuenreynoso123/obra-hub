import BSON from 'bson';
import fs from 'fs';
import { Product } from '../../domain/Product';
import { ProductRepository } from '../../domain/ProductRepository';

export class FileProductRepository implements ProductRepository {
  private FILE_PATH = `${__dirname}/courses`;

  async save(product: Product): Promise<void> {
    fs.promises.writeFile(this.filePath(product.id), BSON.serialize(product));
  }

  private filePath(id: string): string {
    return `${this.FILE_PATH}.${id}.repo`;
  }
}
