import { Routes } from '@angular/router';
import { MainFormComponent } from './components/main-form/main-form.component';
import { ResultComponent } from './components/result/result.component';
import { MainComponent } from './layouts/main/main.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { CountComponent } from './layouts/count/count.component';
import { TestCountComponent } from './components/test-count/test-count.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        title: 'Home Page',
        component: MainFormComponent,
      },
      {
        path: 'result/:id',
        title: 'Result Page',
        component: ResultComponent,
      },
    ],
  },
  {
    path: 'c',
    component: AdminComponent,
    children: [
      {
        path: '',
        title: 'Company List',
        component: CompanyListComponent,
      },
      {
        path: 'company',
        title: 'Company List',
        component: CompanyListComponent,
      },
    ],
  },
  {
    path: 't',
    component: CountComponent,
    children: [
      {
        path: '',
        title: 'Test Count',
        component: TestCountComponent,
      },
      {
        path: 'test-count',
        title: 'Test Count',
        component: TestCountComponent,
      },
    ],
  },
];
