import { Exclude, Expose } from 'class-transformer';
import {
  PaginationPresenter,
  PaginationPresenterProps,
} from './pagination.presenter';

export abstract class CollectionPresenter {
  @Exclude()
  protected meta: PaginationPresenter;

  constructor(props: PaginationPresenterProps) {
    this.meta = new PaginationPresenter(props);
  }

  @Expose({ name: 'meta' })
  get _meta() {
    return this.meta;
  }

  abstract get data();
}
