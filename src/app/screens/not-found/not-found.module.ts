import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from '@ds24/elements';
import { TranslateModule } from '@ngx-translate/core';

import { NotFoundComponent } from './components/not-found.component';

export const COMPONENTS = [NotFoundComponent];

const routes: Routes = [{ path: '', component: NotFoundComponent, data: { title: 'Not found', page: 'not-found' } }];

@NgModule({
  imports: [ButtonModule, TranslateModule.forChild(), RouterModule.forChild(routes)],
  declarations: COMPONENTS,
})
export class NotFoundScreenModule {}
