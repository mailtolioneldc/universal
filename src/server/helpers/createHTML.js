/*eslint no-console: ["error", { allow: ["warn", "log", "error", "info"] }] */
import { getBundles } from 'react-loadable/webpack';
import faviconUrl from 'server/components/html/images/favicon.ico';

const createHTML = ({ clientStats, reactLoadableStats, state, modules }) => {
  try {
    const { runtime, vendor, main } = clientStats.assetsByChunkName;

    const runtimeFile = Array.isArray(runtime) ? runtime[0] : runtime;
    const vendorFile = Array.isArray(vendor) ? vendor[0] : vendor;
    const mainjs = Array.isArray(main)
      ? main.filter((bundle) => bundle.endsWith('.js'))
      : main;
    const mainFile = Array.isArray(mainjs) ? mainjs[0] : mainjs;

    const maincss = Array.isArray(main)
      ? main.filter((bundle) => bundle.endsWith('.css'))
      : main;
    const mainCssFile = Array.isArray(maincss) ? maincss[0] : maincss;
    const bundles = getBundles(reactLoadableStats, modules);

    const scripts = bundles.filter((bundle) => bundle.file.endsWith('.js'));

    let header = `      <html lang="en">
            <head>
            <meta charSet="utf-8" />
            <link rel="shortcut icon" href=${faviconUrl} />
            <link rel="stylesheet" href="/dist/${mainCssFile}" />
            </head>
            <body>
            <div id={process.env.REACT_CONTAINER_ID}>`;

    let footer = `</div>
        <script
          dangerouslySetInnerHTML={{
            __html: window.__PRELOADED_STATE__=${JSON.stringify(state).replace(
              /</g,
              '\\u003c',
            )};,
          }}
        />
        <script src="/dist/${runtimeFile}" />
        <script src="/dist/${vendorFile}"" />
        ${scripts.map(({ file }) => `<script key={file} src="/dist/${file}" />`)}
        <script src="/dist/${mainFile}" />
      </body>
    </html>`;
    return {
      header,
      footer,
    };
  } catch (error) {
    // es-lint-desable no-console
    console.log(error);
    return null;
  }
};

export default createHTML;
