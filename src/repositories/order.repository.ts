import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Order, OrderRelations, Person, Product} from '../models';
import {PersonRepository} from './person.repository';
import {ProductRepository} from './product.repository';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {

  public readonly person: BelongsToAccessor<Person, typeof Order.prototype.id>;

  public readonly products: HasManyRepositoryFactory<Product, typeof Order.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('PersonRepository') protected personRepositoryGetter: Getter<PersonRepository>, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Order, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor('products', productRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
    this.person = this.createBelongsToAccessorFor('person', personRepositoryGetter,);
    this.registerInclusionResolver('person', this.person.inclusionResolver);
  }
}
