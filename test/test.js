/**
 * Created at 16/5/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
const babel = require('babel-core');
import 'should';
import plugin from '../src';

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