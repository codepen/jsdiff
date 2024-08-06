/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayDiff = void 0;
exports.diffArrays = diffArrays;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/*istanbul ignore end*/
var arrayDiff =
/*istanbul ignore start*/
exports.arrayDiff =
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
arrayDiff.tokenize = function (value) {
  return value.slice();
};
arrayDiff.join = arrayDiff.removeEmpty = function (value) {
  return value;
};
function diffArrays(oldArr, newArr, callback) {
  return arrayDiff.diff(oldArr, newArr, callback);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYmFzZSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiZSIsIl9fZXNNb2R1bGUiLCJhcnJheURpZmYiLCJleHBvcnRzIiwiRGlmZiIsInRva2VuaXplIiwidmFsdWUiLCJzbGljZSIsImpvaW4iLCJyZW1vdmVFbXB0eSIsImRpZmZBcnJheXMiLCJvbGRBcnIiLCJuZXdBcnIiLCJjYWxsYmFjayIsImRpZmYiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvZGlmZi9hcnJheS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGlmZiBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgY29uc3QgYXJyYXlEaWZmID0gbmV3IERpZmYoKTtcbmFycmF5RGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5zbGljZSgpO1xufTtcbmFycmF5RGlmZi5qb2luID0gYXJyYXlEaWZmLnJlbW92ZUVtcHR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZBcnJheXMob2xkQXJyLCBuZXdBcnIsIGNhbGxiYWNrKSB7IHJldHVybiBhcnJheURpZmYuZGlmZihvbGRBcnIsIG5ld0FyciwgY2FsbGJhY2spOyB9XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQUEsS0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQUE7QUFBQTtBQUEwQixtQ0FBQUQsdUJBQUFFLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxnQkFBQUEsQ0FBQTtBQUFBO0FBRW5CLElBQU1FLFNBQVM7QUFBQTtBQUFBQyxPQUFBLENBQUFELFNBQUE7QUFBQTtBQUFHO0FBQUlFO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBLENBQUksQ0FBQyxDQUFDO0FBQ25DRixTQUFTLENBQUNHLFFBQVEsR0FBRyxVQUFTQyxLQUFLLEVBQUU7RUFDbkMsT0FBT0EsS0FBSyxDQUFDQyxLQUFLLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBQ0RMLFNBQVMsQ0FBQ00sSUFBSSxHQUFHTixTQUFTLENBQUNPLFdBQVcsR0FBRyxVQUFTSCxLQUFLLEVBQUU7RUFDdkQsT0FBT0EsS0FBSztBQUNkLENBQUM7QUFFTSxTQUFTSSxVQUFVQSxDQUFDQyxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxFQUFFO0VBQUUsT0FBT1gsU0FBUyxDQUFDWSxJQUFJLENBQUNILE1BQU0sRUFBRUMsTUFBTSxFQUFFQyxRQUFRLENBQUM7QUFBRSIsImlnbm9yZUxpc3QiOltdfQ==