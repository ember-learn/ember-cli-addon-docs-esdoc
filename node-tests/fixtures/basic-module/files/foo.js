/**
  @interface
*/
export class Foo {

}

/**
  @param {string} bar a bar string
  @param {number} [baz=123] a baz number with default value
  @return {string}
*/
export default function foo(bar, baz = 123) {
  return bar + baz;
}

/**
  @function bar
  @return {Array<boolean>}
*/
export function bar() {
  return [true];
}

export const baz = 123;

/**
  @type string
*/
export const qux = '123';

/**
  @type boolean
*/
export const quux = true;

/**
  An async function named quuz
*/
export async function quuz(foo, bar) {
  return foo + bar;
}

/**
  A generator function named corge
*/
export function *corge(foo, bar) {
  yield foo + bar;
}

/**
 * An unexported function
 */
function makeMacro() {
  return function macro() {
     // do a think
  };
}

/**
  @function
*/
export const garply = makeMacro();
