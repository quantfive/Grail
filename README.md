# grail-component

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

# Installation
```
yarn add grail-component
```

or

```
npm install grail-component
```

# Usage
```javascript
import Grail from 'grail-component';

let grailComponent = new Grail();
grailComponent.run();
```

First import Grail from `'grail-component'`, then instantiate the Grail class. Once the Grail class is instantiated, call .run() on it for it to run and display the controls in the bottom right.

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
