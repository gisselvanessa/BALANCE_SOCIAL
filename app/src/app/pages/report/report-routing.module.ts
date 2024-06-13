import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportListComponent } from './report-list/report-list.component';
import { ListPrinciplesComponent } from './list-principles/list-principles.component';
import { Principle1Component } from './principle1/principle1.component';
import { Principle2Component } from './principle2/principle2.component';
import { Principle3Component } from './principle3/principle3.component';
import { Principle4Component } from './principle4/principle4.component';
import { Principle5Component } from './principle5/principle5.component';
import { Principle6Component } from './principle6/principle6.component';
import { Principle7Component } from './principle7/principle7.component';
import { GraphicsComponent } from './graphics/graphics.component';
import { GraphicsBComponent } from './graphics-b/graphics-b.component';
import { GraphicsCComponent } from './graphics-c/graphics-c.component';
import { ReportHistoryComponent } from './report-history/report-history.component';

export const ReportRoutes: Routes = [
  {
    path: 'report-list',
    component: ReportListComponent,
    data: {
      title: 'Report',
    },   
  },
  {
    path: 'report-history',
    component: ReportHistoryComponent,
    data: {
      title: 'Report History',
    },   
  },
    {
    path: 'principles-list/:id',
    component: ListPrinciplesComponent,
    data: {
      title: 'Report Principles List',
    },   
  },
  {
    path: 'principle-1',
    component: Principle1Component,
    data: {
      title: 'Principle 1',
    },   
  },
  {
    path: 'principle-2',
    component: Principle2Component,
    data: {
      title: 'Principle 2',
    },   
  },
  {
    path: 'principle-3',
    component: Principle3Component,
    data: {
      title: 'Principle 3',
    },   
  },
  {
    path: 'principle-4',
    component: Principle4Component,
    data: {
      title: 'Principle 4',
    },   
  },
  {
    path: 'principle-5',
    component: Principle5Component,
    data: {
      title: 'Principle 5',
    },   
  },
  {
    path: 'principle-6',
    component: Principle6Component,
    data: {
      title: 'Principle 6',
    },   
  },
  {
    path: 'principle-7',
    component: Principle7Component,
    data: {
      title: 'Principle 7',
    },   
  },
  {
    path: 'results/:id',
    component: GraphicsComponent,
    data: {
      title: 'Results',
    },   
  },
  {
    path: 'results-ic/:id',
    component: GraphicsBComponent,
    data: {
      title: 'Results',
    },   
  },
  {
    path: 'results-p/:id',
    component: GraphicsCComponent,
    data: {
      title: 'Results',
    },   
  },
 
];
