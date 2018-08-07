'use strict';

function joinTypes(typed) {
  return typed && typed.types ? typed.types.join('|').replace(/\*/g, 'any') : 'any';
}

function joinTypesInPlace(collection) {
  return (collection || []).map(t => {
    t.type = joinTypes(t);
    delete t.types;

    return t;
  });
}

function extractDecoratorType(decorator) {
  // For now we're just doing simple extracting, in the future
  // we should work on this to make it better
  if (decorator && decorator.arguments) {
    // remove quotes and surrounding parens
    return decorator.arguments.replace(/['"]/g, '').match(/^\(([\s\S]*)\)$/)[1];
  }
}

module.exports = { joinTypes, joinTypesInPlace, extractDecoratorType };
