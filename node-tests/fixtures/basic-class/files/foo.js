function decorate() {

}

/**
  A foo class

  ```js

  foo({
    bar: 'baz'
  })
  ```

  @anArbitraryTag
*/
@decorate
export default class Foo {
  /**
    A field named foo
  */
  foo = 123;

  /**
    A static decorated field named bar with a tag

    @taggg
  */
  @decorate
  static bar = '123';

  /**
    An accessor named baz
  */
  get baz() {
    return this._baz;
  }

  set baz(val) {
    this._baz = val;
  }

  /**
    A static accessor named baz
  */
  static get baz() {
    return this._bazzz;
  }

  /**
    An accessor without a setter named qux
  */
  get qux() {
    return true;
  }

  /**
    A set only accessor named quux
  */
  set quuz(val) {
    this._quuz = val;
  }

  /**
    A method named corge with a tag

    @param {string} foo - a foo param
    @param {number} bar - a bar param
    @return {string} - the corge return value
  */
  corge(foo, bar) {
    return foo + bar;
  }

  /**
    An static async method named grault
  */
  static async grault(foo, bar) {
    return foo + bar;
  }

  /**
    A generator method named garply
  */
  *garply(foo, bar) {
    yield foo + bar;
  }
}
