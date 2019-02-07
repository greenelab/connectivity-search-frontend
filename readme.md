### Hetmec Front-end

This repository contains the front-end interface for the [Hetmech project](https://github.com/greenelab/hetmech).


#### Test/Build

To install environment:

1. Install latest version of the [Node.js platform](https://nodejs.org/en/)
2. Clone this repo
3. Navigate to your local clone
4. Run `npm install` to download and install all the node package dependencies

To build packaged/bundled app:

1. Run `npx webpack`
2. Wait for build to complete, then open `/build/index.html`.
3. Webpack will watch for file changes in `/src` and automatically rebuild `/build`. Manually refresh/reload page to see changes.

To run test server:

1. Run `npx webpack-dev-server`
2. Wait for build to complete, then open `http://localhost:8080/webpack-dev-server/`
3. Webpack will watch for file changes in `/src`, automatically rebuild `/build`, and automatically "soft refresh"* the page.

\* *Intelligently refreshes only the elements/components that need to be updated.
Accelerates development and testing because it maintains page state that would be lost in a full reload, only reloads the resources that need to be, and instantly reflects changes made to the source in the browser. *
