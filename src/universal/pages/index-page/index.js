import Loadable from 'react-loadable';
import LoadingPage from 'universal/pages/loading-page';
import './style.scss';

export default Loadable({
  loader: () => import('./index-page'),
  loading: LoadingPage,
});
