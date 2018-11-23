/*eslint no-console: ["error", { allow: ["warn", "log", "error", "info"] }] */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { Capture } from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import faviconUrl from './images/favicon.ico';

const Html = ({ children, clientStats, reactLoadableStats, initialState }) => {
  try {
    const modules = [];

    renderToString(
      <Capture report={(moduleName) => modules.push(moduleName)}>{children}</Capture>,
    );

    const helmet = Helmet.renderStatic();

    const meta = helmet.meta.toComponent();
    const title = helmet.title.toComponent();

    const { runtime, vendor, main } = clientStats.assetsByChunkName;

    const runtimeFile = Array.isArray(runtime) ? runtime[0] : runtime;
    const vendorFile = Array.isArray(vendor) ? vendor[0] : vendor;
    console.log(main);
    const mainjs = Array.isArray(main)
      ? main.filter((bundle) => bundle.endsWith('.js'))
      : main;
    const mainFile = Array.isArray(mainjs) ? mainjs[0] : mainjs;
    const maincss = Array.isArray(main)
      ? main.filter((bundle) => bundle.endsWith('.css'))
      : main;
    let mainCssFile = '';
    if (maincss.length) {
      if (Array.isArray(maincss)) {
        if (maincss[0].endsWith('.css')) {
          mainCssFile = maincss[0];
        }
      } else if (maincss.endsWith('.css')) {
        mainCssFile = maincss;
      }
    }

    const bundles = getBundles(reactLoadableStats, modules);

    const scripts = bundles && bundles.filter((bundle) => bundle.file.endsWith('.js'));

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          {meta}
          {title}
          <link rel="shortcut icon" href={faviconUrl} />
          {mainCssFile ? <link rel="stylesheet" href={`/dist/${mainCssFile}`} /> : null}
        </head>
        <body>
          <div id={process.env.REACT_CONTAINER_ID}>{children}</div>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__PRELOADED_STATE__=${JSON.stringify(initialState).replace(
                /</g,
                '\\u003c',
              )};`,
            }}
          />
          <script src={`/dist/${runtimeFile}`} />
          <script src={`/dist/${vendorFile}`} />
          {scripts.map(({ file }) => <script key={file} src={`/dist/${file}`} />)}
          <script src={`/dist/${mainFile}`} />
        </body>
      </html>
    );
  } catch (error) {
    // es-lint-desable no-console
    console.log("error", error);
    return null;
  }
};

export default Html;
