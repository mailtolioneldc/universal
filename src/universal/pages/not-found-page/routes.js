
import NotFoundIndex from './not-found-page';
import NotFoundPage from './not-found-page';
import NotFoundErrorPage from './not-found-error';

export default [
      {
        path: '/',
        component: NotFoundPage,
        exact : true                    
      },
      {
        path: '/:error',
        component: NotFoundErrorPage,
        exact : true                    
      }
];
