/**
 * Created at 16/5/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
const babel = require('babel-core');
const t = require('babel-types');
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

describe('node replacement', () => {
    describe(`transform`, () => {
        const nodeEnv = t.memberExpression(t.memberExpression(t.identifier('process'), t.identifier('env')), t.identifier('NODE_ENV'));
        const nodeEnvCheck = t.binaryExpression('!==', nodeEnv, t.stringLiteral('production'));

        it(`__DEV__ should be replaced to expression`, () => {
            babel.transform(`
                if (__DEV__) {
                    console.log('development')
                } else {
                    console.log('production')
                }
            `, {
                plugins: [[plugin, {
                    __DEV__: nodeEnvCheck,
                }]]
            }).code
              .should.be.equal(`
if (process.env.NODE_ENV !== 'production') {
    console.log('development');
} else {
    console.log('production');
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
