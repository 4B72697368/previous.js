#!/usr/bin/env node

import { Command } from 'commander';

import http from 'http';
import path from 'path';
import fs from 'fs/promises';
import readline from 'readline'
import { pathToFileURL } from 'url';

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const getConfigOption = async (option, defaultVal) => {
  const configPaths = ['./previous.config.js', './previous.config.ts'];
  for (const configPath of configPaths) {
    if (await fileExists(configPath)) {
      const configUrl = pathToFileURL(path.resolve(configPath)).href;
      const config = await import(configUrl);
      if (config && typeof config === 'object' && config.default && typeof config.default === 'object') {
        return config.default[option] || defaultVal;
      }
    }
  }

  return "No Config File";
};

const routes = new Map();

const mapRoutes = async (directory, baseRoute = '') => {
  let files;

  try {
    files = await fs.readdir(directory);
  } catch (err) {
    process.stderr.write('Cannot locate src directory: ' + directory + '\n');
    process.exit(1);
  }

  for (const file of files) {
    const filePath = path.join(directory, file);

    if ((await fs.stat(filePath)).isDirectory()) {
      await mapRoutes(filePath, `${baseRoute}/${file}`);
    }

    if (file === 'page.js' || 'page.ts') {
      const routePath = baseRoute === '' ? '/' : baseRoute;

      const url = pathToFileURL(filePath).href;

      routes.set(routePath, async (req, res) => {
        try {
          const page = await import(url);
          const content = await page.default();

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'text/html' });

          let page500= `
            <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>500: Internal Server Error</title>
              </head>
              <body>
                <div style="font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; height: 100vh; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                  <div>
                    <style>
                      body {
                        color: #000;
                        background: #fff;
                        margin: 0;
                      }
                      .next-error-h1 {
                        border-right: 1px solid rgba(0, 0, 0, 0.3);
                      }
                      @media (prefers-color-scheme: dark) {
                        body {
                          color: #fff;
                          background: #000;
                        }
                        .next-error-h1 {
                          border-right: 1px solid rgba(255, 255, 255, 0.3);
                        }
                      }
                    </style>
                    <h1 class="next-error-h1" style="display: inline-block; margin: 0 20px 0 0; padding: 0 23px 0 0; font-size: 24px; font-weight: 500; vertical-align: top; line-height: 49px;">500</h1>
                    <div style="display: inline-block;">
                      <h2 style="font-size: 14px; font-weight: 400; line-height: 49px; margin: 0;">Internal Server Error.</h2>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `

          const custom500Path = await getConfigOption('500_Page_Route', null);
          if (!custom500Path) {}
          else if (await fileExists(custom500Path) && (custom500Path.endsWith('.js') || custom500Path.endsWith('.ts'))) {
            const custom500Module = await import(pathToFileURL(custom500Path).href);
            if (custom500Module.default) {
              try {
                page500 = await custom500Module.default();
              } catch (err) {
                process.stderr.write(`Error loading custom 500 page: ${err}` + '\n');
                process.exit(1);
              }
            } else {
              process.stderr.write('500 page must be in Javascript or Typescript and have a default export of the html content' + '\n');
              process.exit(1);
            }
          } else {
            process.stderr.write('500 page must be in Javascript or Typescript and have a default export of the html content' + '\n');
            process.exit(1);
          }
      
          res.end(page500);
        }
      });
    }
  }
};

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

  const handler = routes.get(pathname);

  if (handler) {
    await handler(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });

    let page404 = `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404: This page could not be found</title>
        </head>
        <body>
          <div style="font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; height: 100vh; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div>
              <style>
                body {
                  color: #000;
                  background: #fff;
                  margin: 0;
                }
                .next-error-h1 {
                  border-right: 1px solid rgba(0, 0, 0, 0.3);
                }
                @media (prefers-color-scheme: dark) {
                  body {
                    color: #fff;
                    background: #000;
                  }
                  .next-error-h1 {
                    border-right: 1px solid rgba(255, 255, 255, 0.3);
                  }
                }
              </style>
              <h1 class="next-error-h1" style="display: inline-block; margin: 0 20px 0 0; padding: 0 23px 0 0; font-size: 24px; font-weight: 500; vertical-align: top; line-height: 49px;">404</h1>
              <div style="display: inline-block;">
                <h2 style="font-size: 14px; font-weight: 400; line-height: 49px; margin: 0;">This page could not be found.</h2>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const custom404Path = await getConfigOption('404_Page_Route', null);
    if (!custom404Path) {}
    else if (await fileExists(custom404Path) && (custom404Path.endsWith('.js') || custom404Path.endsWith('.ts'))) {
      const custom404Module = await import(pathToFileURL(custom404Path).href);
      if (custom404Module.default) {
        try {
          page404 = await custom404Module.default();
        } catch (err) {
          process.stderr.write(`Error loading custom 404 page: ${err}` + '\n');
          process.exit(1);
        }
      } else {
        process.stderr.write('404 page must be in Javascript or Typescript and have a default export of the html content' + '\n');
        process.exit(1);
      }
    } else {
      process.stderr.write('404 page must be in Javascript or Typescript and have a default export of the html content' + '\n');
      process.exit(1);
    }

    res.end(page404);
  }
});

const startServer = async (startPort) => {
  let port = startPort;
  while (true) {
    try {
      await new Promise((resolve, reject) => {
        server.listen(port);
        server.on('listening', resolve);
        server.on('error', reject);
      });
      process.stdout.write(`Server is running at http://localhost:${port}` + '\n');
      break;
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        process.stdout.write(`Port ${port} is in use. Trying port ${port + 1}...` + '\n');
        port++;
      } else {
        process.stderr.write('Error starting server:', error + '\n');
        process.exit(1);
      }
    }
  }
};

const createProject = async (title) => {
  const projectDir = title;
  await fs.mkdir(projectDir, { recursive: true });

  const packageJson = {
    name: title,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      start: "previous start",
      dev: "nodemon --exec \"previous start\" --ext js,ts,json"
    },
    devDependencies: {
      nodemon: "^2.0.22",
      previous: "0.1.0"
    }
  };

  await fs.writeFile(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  let config =
`const previousConfig = {
  /* config options here */
};

export default previousConfig;
  `;

  await fs.writeFile(
    path.join(projectDir, 'previous.config.js'),
    config
  );

  const appDir = path.join(projectDir, 'app');
  await fs.mkdir(appDir, { recursive: true });
  
  let page =
`export const main = () => {
  return \`
    <div>
      <h1>Previous.js</h1>
      <p></p>
    </div>
  \`;
};

export default main;
  `;

  await fs.writeFile(
    path.join(appDir, 'page.js'),
    page
  );
};

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

const program = new Command();

program
  .command('create')
  .description('Initialize a new Previous.js project')
  .action(async () => {
    const title = await askQuestion("What would you like to call the project? \n");
    await createProject(title);
  });

program
  .command('start')
  .description('Start the server (developer-mode)')
  .action(async () => {
    const srcPath = await getConfigOption("src_dir", "app");

    if (srcPath == 'No Config File') {
      process.stderr.write('Cannot locate configuration options' + '\n')
    } else {
      await mapRoutes(srcPath);
      await startServer(3000);
    }
  });

program.parse(process.argv);
