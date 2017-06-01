/**
 * Created at 16/5/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
const babel = require('babel-core');
const babylon = require('babylon');
require('should');
const plugin = require('../');

describe('simple', () => {
    describe(`transform`, () => {
        it(`__SERVER__ should be replaced to true`, () => {
            babel.transform(`
                if (__SERVER__) {
                    console.log('this is server, version: %s', __VERSION__)
                } else {
                    alert('this is browser')
                }
            `, {
                plugins: [[plugin, {
                    __SERVER__: true,
                    __VERSION__: "v1.2.3"
                }]]
            }).code
              .should.be.equal(`
if (true) {
    console.log('this is server, version: %s', 'v1.2.3');
} else {
    alert('this is browser');
}`)
        });
    });

});

describe('simple', () => {
    describe(`transform`, () => {
        it(`__SERVER__ should be replaced to false`, () => {
            babel.transform(`
                if (__SERVER__) {
                    console.log('this is server, version: %s', __VERSION__)
                } else {
                    alert('this is browser')
                }
            `, {
                plugins: [[plugin, {
                    __SERVER__: false,
                    __VERSION__: "v1.2.3"
                }]]
            }).code
              .should.be.equal(`
if (false) {
    console.log('this is server, version: %s', 'v1.2.3');
} else {
    alert('this is browser');
}`)
        });
    });

});



describe('member expression', () => {
    describe(`transform`, () => {
        it(`__SERVER__ should NOT be replaced to true`, () => {
            babel.transform(`
                if (foo.bar.__SERVER__) {
                    console.log('this is server, version: %s', __VERSION__)
                } else {
                    alert('this is browser')
                }
            `, {
                plugins: [[plugin, {
                    __SERVER__: true,
                    __VERSION__: "v1.2.3"
                }]]
            }).code
              .should.be.equal(`
if (foo.bar.__SERVER__) {
    console.log('this is server, version: %s', 'v1.2.3');
} else {
    alert('this is browser');
}`)
        });
    });

});

describe('non-globals', () => {
    describe(`transform`, () => {
        it(`__SERVER__ should NOT be replaced to true`, () => {
            babel.transform(`
                function foo(__SERVER__) {
                    console.log('this is a normal argument', __SERVER__)
                }
            `, {
                plugins: [[plugin, {
                    __SERVER__: true,
                    __VERSION__: "v1.2.3"
                }]]
            }).code
              .should.be.equal(`
function foo(__SERVER__) {
    console.log('this is a normal argument', __SERVER__);
}`)
        });
    });

});

describe('ignore class methods', () => {
    describe(`transform`, () => {
        it(`__SERVER__ should NOT be replaced`, () => {
            babel.transform(`
                export default class Hello {
                  __SERVER__(foo) {
                    this.foo = foo;
                  }
                }
            `, {
                plugins: [[plugin, {
                    __SERVER__: true,
                    __VERSION__: "v1.2.3"
                }]]
            }).code
              .should.be.equal(`
export default class Hello {
  __SERVER__(foo) {
    this.foo = foo;
  }
}`)
        });

    });

});

describe('object own properties', () => {
    describe(`transform`, () => {
        it(`only own properties should be replaced`, () => {
            babel.transform(`
                var foo = constructor;
                var bar = isPrototypeOf;
                var baz = __SERVER__;
            `, {
                plugins: [[plugin, {
                    __SERVER__: true,
                    __VERSION__: "v1.2.3"
                }]]
            }).code
              .should.be.equal(`
var foo = constructor;
var bar = isPrototypeOf;
var baz = true;`)
        });

    });
});

describe('support node replacement', () => {
  it('__DEV__ should be replaced by process.env.NODE_ENV', () => {
    babel.transform(`
        if (__DEV__) {
          console.log('this is dev');
        } else {
          console.log('this is prod');
        }
    `, {
        plugins: [[plugin, {
            __DEV__: {
              type: 'node',
              replacement: 'process.env.NODE_ENV'
            }
        }]]
    }).code.should.be.equal(`
if (process.env.NODE_ENV) {
  console.log('this is dev');
} else {
  console.log('this is prod');
}`);
  });

  it('__DEV__ should be replaced by process.env.NODE_ENV', () => {
    babel.transform(`
        if (__DEV__) {
          console.log('this is dev');
        } else {
          console.log('this is prod');
        }
    `, {
        plugins: [[plugin, {
            __DEV__: babylon.parseExpression('process.env.NODE_ENV')
        }]]
    }).code.should.be.equal(`
if (process.env.NODE_ENV) {
  console.log('this is dev');
} else {
  console.log('this is prod');
}`);
  });
});

describe('support false value replacement', () => {
  it('__DEV__ should be replaced by false', () => {
    babel.transform(`
        if (__DEV__) {
          console.log('this is dev');
        } else {
          console.log('this is prod');
        }
    `, {
        plugins: [[plugin, {
            __DEV__: false
        }]]
    }).code.should.be.equal(`
if (false) {
  console.log('this is dev');
} else {
  console.log('this is prod');
}`);
  });

  it('__DEV__ should be replaced by undefined', () => {
    babel.transform(`
        if (__DEV__) {
          console.log('this is dev');
        } else {
          console.log('this is prod');
        }
    `, {
        plugins: [[plugin, {
            __DEV__: undefined
        }]]
    }).code.should.be.equal(`
if (undefined) {
  console.log('this is dev');
} else {
  console.log('this is prod');
}`);
  });

  it('__DEV__ should be replaced by null', () => {
    babel.transform(`
        if (__DEV__) {
          console.log('this is dev');
        } else {
          console.log('this is prod');
        }
    `, {
        plugins: [[plugin, {
            __DEV__: null
        }]]
    }).code.should.be.equal(`
if (null) {
  console.log('this is dev');
} else {
  console.log('this is prod');
}`);
  });
});
