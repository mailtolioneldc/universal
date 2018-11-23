import url from 'url';
import { matchPath } from 'react-router-dom';
import Routes from 'universal/routes';

//implement debounce to avoid more delay in ssr
const fetchDataForRender = (req, store) => {
  const promises = [];

  Routes.some((route) => {
    const match = matchPath(url.parse(req.url).pathname, route);
    //console.log(match)
    if (match) {
      const promise =
        route.component &&
        route.component.fetchData &&
        route.component.fetchData(store, match);
      promise && promises.push(promise);
    }
    return match;
  });
  return Promise.all(promises);
};

export default fetchDataForRender;
