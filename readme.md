# babel-plugin-inline-replace-variables

## Usage

```bash
npm i babel-plugin-inline-replace-variables --save-dev
```

configure in .babelrc(should transfer to json format) or any babel queries:
```javascript
{
  plugins: [
    ['inline-replace-varibles', {
      __SERVER__: true,
      __VERSION__: "v1.2.3"
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



#### tip:

Version 1.0.1 fix the misspelling of 'varibles' to 'variables'

so `babel-plugin-inline-replace-varibles` is deprecated, you should instead it of `babel-plugin-inline-replace-variables`



CONTACT: https://github.com/wssgcg1213


