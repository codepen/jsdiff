/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffSentences = diffSentences;
exports.sentenceDiff = void 0;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/*istanbul ignore end*/
var sentenceDiff =
/*istanbul ignore start*/
exports.sentenceDiff =
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
sentenceDiff.tokenize = function (value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};
function diffSentences(oldStr, newStr, callback) {
  return sentenceDiff.diff(oldStr, newStr, callback);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYmFzZSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiZSIsIl9fZXNNb2R1bGUiLCJzZW50ZW5jZURpZmYiLCJleHBvcnRzIiwiRGlmZiIsInRva2VuaXplIiwidmFsdWUiLCJzcGxpdCIsImRpZmZTZW50ZW5jZXMiLCJvbGRTdHIiLCJuZXdTdHIiLCJjYWxsYmFjayIsImRpZmYiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvZGlmZi9zZW50ZW5jZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGlmZiBmcm9tICcuL2Jhc2UnO1xuXG5cbmV4cG9ydCBjb25zdCBzZW50ZW5jZURpZmYgPSBuZXcgRGlmZigpO1xuc2VudGVuY2VEaWZmLnRva2VuaXplID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnNwbGl0KC8oXFxTLis/Wy4hP10pKD89XFxzK3wkKS8pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZTZW50ZW5jZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7IHJldHVybiBzZW50ZW5jZURpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spOyB9XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQUEsS0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQUE7QUFBQTtBQUEwQixtQ0FBQUQsdUJBQUFFLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxnQkFBQUEsQ0FBQTtBQUFBO0FBR25CLElBQU1FLFlBQVk7QUFBQTtBQUFBQyxPQUFBLENBQUFELFlBQUE7QUFBQTtBQUFHO0FBQUlFO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBLENBQUksQ0FBQyxDQUFDO0FBQ3RDRixZQUFZLENBQUNHLFFBQVEsR0FBRyxVQUFTQyxLQUFLLEVBQUU7RUFDdEMsT0FBT0EsS0FBSyxDQUFDQyxLQUFLLENBQUMsdUJBQXVCLENBQUM7QUFDN0MsQ0FBQztBQUVNLFNBQVNDLGFBQWFBLENBQUNDLE1BQU0sRUFBRUMsTUFBTSxFQUFFQyxRQUFRLEVBQUU7RUFBRSxPQUFPVCxZQUFZLENBQUNVLElBQUksQ0FBQ0gsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLFFBQVEsQ0FBQztBQUFFIiwiaWdub3JlTGlzdCI6W119