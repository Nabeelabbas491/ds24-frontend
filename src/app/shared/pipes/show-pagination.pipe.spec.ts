import { ShowPaginationPipe } from './show-pagination.pipe';
import * as helper from './../common/util';
import { PageBase } from 'src/app/types/misc.type';

describe('Show Pagination Pipe', () => {
  let pipe: ShowPaginationPipe;

  beforeEach(() => {
    pipe = new ShowPaginationPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return true, if ', () => {
    const pageBase: PageBase = {
      total: 100,
      page: 1,
      limit: 10,
    };

    const spy = jest.spyOn(helper, 'showPagination');
    spy.mockReturnValue(true);

    expect(pipe.transform(pageBase)).toEqual(true);
  });
});
