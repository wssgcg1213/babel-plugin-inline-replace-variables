

# babel-plugin-inline-replace-variables

[![Build Status](https://travis-ci.org/wssgcg1213/babel-plugin-inline-replace-variables.svg?branch=master)](https://travis-ci.org/wssgcg1213/babel-plugin-inline-replace-variables)

It replace an Identifier to a literial (LVal), if you want to transfrom a identifier to another identifier, you can see: [babel-plugin-replace-identifiers](https://github.com/wssgcg1213/babel-plugin-replace-identifiers)
## Usage

```bash
npm i babel-plugin-inline-replace-variables --save-dev
```

configure in .babelrc(should transfer to json format) or any babel queries:
```javascript
{
  plugins: [
    ['inline-replace-variables', {
      "__SERVER__": true,
      "__VERSION__": "v1.2.3"
    }]
  ]
}
```

#### EFFECT:

```javascript
if (__SERVER__) {
  console.log('this is server, version: %s', __VERSION__)
} else {
  alert('this is browser')
}
```

will be transformed to

```
if (true) {
  console.log('this is server, version: %s', "v1.2.3")
} else {
  alert('this is browser')
}
```

### Support Replace With Expression:

```js
{
  plugins: [
    ['inline-replace-variables', {
      "__TYPE__": {
        type: 'node',
        replacement: 'process.env.NODE_ENV'
      }
    }]
  ]
}
```

#### EFFECT
```js
if (__TYPE__) {
  // code
}
```

to

```js
if (process.env.NODE_ENV) {
  // code
}
```



### Also support babel AST Node

```js
const t = require('babel-types');
const nodeEnv = t.memberExpression(t.memberExpression(t.identifier('process'), t.identifier('env')), t.identifier('NODE_ENV'));

{
  plugins: [
    ['inline-replace-variables', {
      "__TYPE__": nodeEnv
    }]
  ]
}
```

#### EFFECT

The effect is the same above.



#### tip:

Version 1.0.1 fix the misspelling of 'varibles' to 'variables'

so `babel-plugin-inline-replace-varibles` is deprecated, you should instead it of `babel-plugin-inline-replace-variables`



Authors: https://github.com/wssgcg1213, https://github.com/rtsao


