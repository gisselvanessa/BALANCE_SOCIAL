
import { RouterModule, Routes } from '@angular/router';
import { EditPrincipleComponent } from './edit-principle/edit-principle1.component';


export const PrinciplesRoutes: Routes = [
  // {
  //   path: 'principles-list/:id',
  //   component: ListPrinciplesComponent,
  //   data: {
  //     title: 'Principles',
  //   },   
  // },
  // {
  //   path: 'principle-1',
  //   component: Principle1Component,
  //   data: {
  //     title: 'Principle 1',
  //   },   
  // },
  {
    path: 'principle-edit/:id',
    component: EditPrincipleComponent,
    data: {
      title: 'Edit Principle 1',
    },   
  },

  // {
  //   path: 'principle-2',
  //   component: Principle2Component,
  //   data: {
  //     title: 'Principle 2',
  //   },   
  // },
  // {
  //   path: 'principle-3',
  //   component: Principle3Component,
  //   data: {
  //     title: 'Principle 3',
  //   },   
  // },
  // {
  //   path: 'principle-4',
  //   component: Principle4Component,
  //   data: {
  //     title: 'Principle 4',
  //   },   
  // },
  // {
  //   path: 'principle-5',
  //   component: Principle5Component,
  //   data: {
  //     title: 'Principle 5',
  //   },   
  // },
  // {
  //   path: 'principle-6',
  //   component: Principle6Component,
  //   data: {
  //     title: 'Principle 6',
  //   },   
  // },
  // {
  //   path: 'principle-7',
  //   component: Principle7Component,
  //   data: {
  //     title: 'Principle 7',
  //   },   
  // },
  // {
  //   path: 'results/:id',
  //   component: GraphicsComponent,
  //   data: {
  //     title: 'Results',
  //   },   
  // },
  // {
  //   path: 'results-ic/:id',
  //   component: GraphicsBComponent,
  //   data: {
  //     title: 'Results',
  //   },   
  // },
  // {
  //   path: 'results-p/:id',
  //   component: GraphicsCComponent,
  //   data: {
  //     title: 'Results',
  //   },   
  // },
 
];


