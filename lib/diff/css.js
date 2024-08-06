/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cssDiff = void 0;
exports.diffCss = diffCss;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/*istanbul ignore end*/
var cssDiff =
/*istanbul ignore start*/
exports.cssDiff =
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
cssDiff.tokenize = function (value) {
  return value.split(/([{}:;,]|\s+)/);
};
function diffCss(oldStr, newStr, callback) {
  return cssDiff.diff(oldStr, newStr, callback);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYmFzZSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiZSIsIl9fZXNNb2R1bGUiLCJjc3NEaWZmIiwiZXhwb3J0cyIsIkRpZmYiLCJ0b2tlbml6ZSIsInZhbHVlIiwic3BsaXQiLCJkaWZmQ3NzIiwib2xkU3RyIiwibmV3U3RyIiwiY2FsbGJhY2siLCJkaWZmIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RpZmYvY3NzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEaWZmIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBjb25zdCBjc3NEaWZmID0gbmV3IERpZmYoKTtcbmNzc0RpZmYudG9rZW5pemUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUuc3BsaXQoLyhbe306OyxdfFxccyspLyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZkNzcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHsgcmV0dXJuIGNzc0RpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spOyB9XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQUEsS0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQUE7QUFBQTtBQUEwQixtQ0FBQUQsdUJBQUFFLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxnQkFBQUEsQ0FBQTtBQUFBO0FBRW5CLElBQU1FLE9BQU87QUFBQTtBQUFBQyxPQUFBLENBQUFELE9BQUE7QUFBQTtBQUFHO0FBQUlFO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBLENBQUksQ0FBQyxDQUFDO0FBQ2pDRixPQUFPLENBQUNHLFFBQVEsR0FBRyxVQUFTQyxLQUFLLEVBQUU7RUFDakMsT0FBT0EsS0FBSyxDQUFDQyxLQUFLLENBQUMsZUFBZSxDQUFDO0FBQ3JDLENBQUM7QUFFTSxTQUFTQyxPQUFPQSxDQUFDQyxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxFQUFFO0VBQUUsT0FBT1QsT0FBTyxDQUFDVSxJQUFJLENBQUNILE1BQU0sRUFBRUMsTUFBTSxFQUFFQyxRQUFRLENBQUM7QUFBRSIsImlnbm9yZUxpc3QiOltdfQ==