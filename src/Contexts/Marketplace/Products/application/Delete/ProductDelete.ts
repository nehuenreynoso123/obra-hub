import { ProductRepository } from '../../domain/ProductRepository';

export class ProductDelete {
  constructor(private repository: ProductRepository) {}
  async run(id: string): Promise<void> {
    await this.repository.remove(id);
  }
}
