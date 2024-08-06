/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canonicalize = canonicalize;
exports.diffJson = diffJson;
exports.jsonDiff = void 0;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_line = require("./line")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*istanbul ignore end*/
var jsonDiff =
/*istanbul ignore start*/
exports.jsonDiff =
/*istanbul ignore end*/
new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();
// Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
// dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:
jsonDiff.useLongestToken = true;
jsonDiff.tokenize =
/*istanbul ignore start*/
_line
/*istanbul ignore end*/
.
/*istanbul ignore start*/
lineDiff
/*istanbul ignore end*/
.tokenize;
jsonDiff.castInput = function (value, options) {
  var
    /*istanbul ignore start*/
    /*istanbul ignore end*/
    undefinedReplacement = options.undefinedReplacement,
    /*istanbul ignore start*/
    _options$stringifyRep =
    /*istanbul ignore end*/
    options.stringifyReplacer,
    /*istanbul ignore start*/
    /*istanbul ignore end*/
    stringifyReplacer = _options$stringifyRep === void 0 ? function (k, v)
    /*istanbul ignore start*/
    {
      return (
        /*istanbul ignore end*/
        typeof v === 'undefined' ? undefinedReplacement : v
      );
    } : _options$stringifyRep;
  return typeof value === 'string' ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, '  ');
};
jsonDiff.equals = function (left, right, options) {
  return (
    /*istanbul ignore start*/
    _base
    /*istanbul ignore end*/
    [
    /*istanbul ignore start*/
    "default"
    /*istanbul ignore end*/
    ].prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'), options)
  );
};
function diffJson(oldObj, newObj, options) {
  return jsonDiff.diff(oldObj, newObj, options);
}

// This function handles the presence of circular references by bailing out when encountering an
// object that is already on the "stack" of items being processed. Accepts an optional replacer
function canonicalize(obj, stack, replacementStack, replacer, key) {
  stack = stack || [];
  replacementStack = replacementStack || [];
  if (replacer) {
    obj = replacer(key, obj);
  }
  var i;
  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }
  var canonicalizedObj;
  if ('[object Array]' === Object.prototype.toString.call(obj)) {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);
    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
    }
    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }
  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }
  if (
  /*istanbul ignore start*/
  _typeof(
  /*istanbul ignore end*/
  obj) === 'object' && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);
    var sortedKeys = [],
      _key;
    for (_key in obj) {
      /* istanbul ignore else */
      if (Object.prototype.hasOwnProperty.call(obj, _key)) {
        sortedKeys.push(_key);
      }
    }
    sortedKeys.sort();
    for (i = 0; i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i];
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    }
    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }
  return canonicalizedObj;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYmFzZSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2xpbmUiLCJlIiwiX19lc01vZHVsZSIsIl90eXBlb2YiLCJvIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJjb25zdHJ1Y3RvciIsInByb3RvdHlwZSIsImpzb25EaWZmIiwiZXhwb3J0cyIsIkRpZmYiLCJ1c2VMb25nZXN0VG9rZW4iLCJ0b2tlbml6ZSIsImxpbmVEaWZmIiwiY2FzdElucHV0IiwidmFsdWUiLCJvcHRpb25zIiwidW5kZWZpbmVkUmVwbGFjZW1lbnQiLCJfb3B0aW9ucyRzdHJpbmdpZnlSZXAiLCJzdHJpbmdpZnlSZXBsYWNlciIsImsiLCJ2IiwiSlNPTiIsInN0cmluZ2lmeSIsImNhbm9uaWNhbGl6ZSIsImVxdWFscyIsImxlZnQiLCJyaWdodCIsImNhbGwiLCJyZXBsYWNlIiwiZGlmZkpzb24iLCJvbGRPYmoiLCJuZXdPYmoiLCJkaWZmIiwib2JqIiwic3RhY2siLCJyZXBsYWNlbWVudFN0YWNrIiwicmVwbGFjZXIiLCJrZXkiLCJpIiwibGVuZ3RoIiwiY2Fub25pY2FsaXplZE9iaiIsIk9iamVjdCIsInRvU3RyaW5nIiwicHVzaCIsIkFycmF5IiwicG9wIiwidG9KU09OIiwic29ydGVkS2V5cyIsImhhc093blByb3BlcnR5Iiwic29ydCJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2pzb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7bGluZURpZmZ9IGZyb20gJy4vbGluZSc7XG5cbmV4cG9ydCBjb25zdCBqc29uRGlmZiA9IG5ldyBEaWZmKCk7XG4vLyBEaXNjcmltaW5hdGUgYmV0d2VlbiB0d28gbGluZXMgb2YgcHJldHR5LXByaW50ZWQsIHNlcmlhbGl6ZWQgSlNPTiB3aGVyZSBvbmUgb2YgdGhlbSBoYXMgYVxuLy8gZGFuZ2xpbmcgY29tbWEgYW5kIHRoZSBvdGhlciBkb2Vzbid0LiBUdXJucyBvdXQgaW5jbHVkaW5nIHRoZSBkYW5nbGluZyBjb21tYSB5aWVsZHMgdGhlIG5pY2VzdCBvdXRwdXQ6XG5qc29uRGlmZi51c2VMb25nZXN0VG9rZW4gPSB0cnVlO1xuXG5qc29uRGlmZi50b2tlbml6ZSA9IGxpbmVEaWZmLnRva2VuaXplO1xuanNvbkRpZmYuY2FzdElucHV0ID0gZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgY29uc3Qge3VuZGVmaW5lZFJlcGxhY2VtZW50LCBzdHJpbmdpZnlSZXBsYWNlciA9IChrLCB2KSA9PiB0eXBlb2YgdiA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWRSZXBsYWNlbWVudCA6IHZ9ID0gb3B0aW9ucztcblxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogSlNPTi5zdHJpbmdpZnkoY2Fub25pY2FsaXplKHZhbHVlLCBudWxsLCBudWxsLCBzdHJpbmdpZnlSZXBsYWNlciksIHN0cmluZ2lmeVJlcGxhY2VyLCAnICAnKTtcbn07XG5qc29uRGlmZi5lcXVhbHMgPSBmdW5jdGlvbihsZWZ0LCByaWdodCwgb3B0aW9ucykge1xuICByZXR1cm4gRGlmZi5wcm90b3R5cGUuZXF1YWxzLmNhbGwoanNvbkRpZmYsIGxlZnQucmVwbGFjZSgvLChbXFxyXFxuXSkvZywgJyQxJyksIHJpZ2h0LnJlcGxhY2UoLywoW1xcclxcbl0pL2csICckMScpLCBvcHRpb25zKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmSnNvbihvbGRPYmosIG5ld09iaiwgb3B0aW9ucykgeyByZXR1cm4ganNvbkRpZmYuZGlmZihvbGRPYmosIG5ld09iaiwgb3B0aW9ucyk7IH1cblxuLy8gVGhpcyBmdW5jdGlvbiBoYW5kbGVzIHRoZSBwcmVzZW5jZSBvZiBjaXJjdWxhciByZWZlcmVuY2VzIGJ5IGJhaWxpbmcgb3V0IHdoZW4gZW5jb3VudGVyaW5nIGFuXG4vLyBvYmplY3QgdGhhdCBpcyBhbHJlYWR5IG9uIHRoZSBcInN0YWNrXCIgb2YgaXRlbXMgYmVpbmcgcHJvY2Vzc2VkLiBBY2NlcHRzIGFuIG9wdGlvbmFsIHJlcGxhY2VyXG5leHBvcnQgZnVuY3Rpb24gY2Fub25pY2FsaXplKG9iaiwgc3RhY2ssIHJlcGxhY2VtZW50U3RhY2ssIHJlcGxhY2VyLCBrZXkpIHtcbiAgc3RhY2sgPSBzdGFjayB8fCBbXTtcbiAgcmVwbGFjZW1lbnRTdGFjayA9IHJlcGxhY2VtZW50U3RhY2sgfHwgW107XG5cbiAgaWYgKHJlcGxhY2VyKSB7XG4gICAgb2JqID0gcmVwbGFjZXIoa2V5LCBvYmopO1xuICB9XG5cbiAgbGV0IGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKHN0YWNrW2ldID09PSBvYmopIHtcbiAgICAgIHJldHVybiByZXBsYWNlbWVudFN0YWNrW2ldO1xuICAgIH1cbiAgfVxuXG4gIGxldCBjYW5vbmljYWxpemVkT2JqO1xuXG4gIGlmICgnW29iamVjdCBBcnJheV0nID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkge1xuICAgIHN0YWNrLnB1c2gob2JqKTtcbiAgICBjYW5vbmljYWxpemVkT2JqID0gbmV3IEFycmF5KG9iai5sZW5ndGgpO1xuICAgIHJlcGxhY2VtZW50U3RhY2sucHVzaChjYW5vbmljYWxpemVkT2JqKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjYW5vbmljYWxpemVkT2JqW2ldID0gY2Fub25pY2FsaXplKG9ialtpXSwgc3RhY2ssIHJlcGxhY2VtZW50U3RhY2ssIHJlcGxhY2VyLCBrZXkpO1xuICAgIH1cbiAgICBzdGFjay5wb3AoKTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnBvcCgpO1xuICAgIHJldHVybiBjYW5vbmljYWxpemVkT2JqO1xuICB9XG5cbiAgaWYgKG9iaiAmJiBvYmoudG9KU09OKSB7XG4gICAgb2JqID0gb2JqLnRvSlNPTigpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCkge1xuICAgIHN0YWNrLnB1c2gob2JqKTtcbiAgICBjYW5vbmljYWxpemVkT2JqID0ge307XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wdXNoKGNhbm9uaWNhbGl6ZWRPYmopO1xuICAgIGxldCBzb3J0ZWRLZXlzID0gW10sXG4gICAgICAgIGtleTtcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBzb3J0ZWRLZXlzLnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc29ydGVkS2V5cy5zb3J0KCk7XG4gICAgZm9yIChpID0gMDsgaSA8IHNvcnRlZEtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGtleSA9IHNvcnRlZEtleXNbaV07XG4gICAgICBjYW5vbmljYWxpemVkT2JqW2tleV0gPSBjYW5vbmljYWxpemUob2JqW2tleV0sIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwga2V5KTtcbiAgICB9XG4gICAgc3RhY2sucG9wKCk7XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBjYW5vbmljYWxpemVkT2JqID0gb2JqO1xuICB9XG4gIHJldHVybiBjYW5vbmljYWxpemVkT2JqO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBQSxLQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBQyxLQUFBLEdBQUFELE9BQUE7QUFBQTtBQUFBO0FBQWdDLG1DQUFBRCx1QkFBQUcsQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLGdCQUFBQSxDQUFBO0FBQUEsU0FBQUUsUUFBQUMsQ0FBQSxzQ0FBQUQsT0FBQSx3QkFB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