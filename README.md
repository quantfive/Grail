# grail-component

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

# Installation
```
yarn add https://github.com/lightninglu10/grail-frontend-test-package.git#grail-component
npm install https://github.com/lightninglu10/grail-frontend-test-package.git#grail-component
```

# Usage
```
import Grail from 'grail-component';

this.grailComponent = new Grail();
this.grailComponent.run();
```

First import Grail from `'grail-component'`, then instantiate the Grail class. Once the Grail class is instantiated, call .run() on it for it to run and display the controls in the bottom right.

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
