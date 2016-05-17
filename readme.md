# babel-plugin-inline-replace-varibles

## Usage

```bash
npm i babel-plugin-inline-replace-varibles --save-dev
```

configure in .babelrc or any babel queries:
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

CONTACT: https://github.com/wssgcg1213


