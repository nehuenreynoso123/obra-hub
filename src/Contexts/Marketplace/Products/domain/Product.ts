import { AggregateRoot } from '../../../Shared/domain/AggregateRoot';
import { ProductName } from './ProductName';
import { ProductId } from '../../Shared/domain/Products/ProductId';
import { ProductPrice } from './ProductPrice';
import { ProductDescription } from './ProductDescription';

export class Product extends AggregateRoot {
  //readonly id: string;
  readonly id: ProductId;
  readonly name: ProductName;
  readonly description: ProductDescription;
  readonly price: ProductPrice;

  //constructor(params: { id: string; name: string; description: string; price: number }) {
  constructor({
    id,
    name,
    description,
    price
  }: {
    id: ProductId;
    name: ProductName;
    description: ProductDescription;
    price: ProductPrice;
  }) {
    super();
    /* this.id = params.id;
    this.name = params.name; */
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
  }

  static fromPrimitives(plainData: { id: string; name: string; description: string; price: number }): Product {
    return new Product({
      id: new ProductId(plainData.id),
      name: new ProductName(plainData.name),
      description: new ProductDescription(plainData.description),
      price: new ProductPrice(plainData.price)
    });
  }

  toPrimitives(): any {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description.value,
      price: this.price.value
    };
  }
}
