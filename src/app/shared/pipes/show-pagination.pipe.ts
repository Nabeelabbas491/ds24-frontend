import { Pipe, PipeTransform } from '@angular/core';
import { PageBase } from 'src/app/types/misc.type';
import { showPagination } from '../common/util';

@Pipe({
  name: 'showPagination',
})
export class ShowPaginationPipe implements PipeTransform {
  transform(pageBase: PageBase): boolean {
    return showPagination(pageBase);
  }
}
