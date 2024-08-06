/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Diff", {
  enumerable: true,
  get: function get() {
    return _base["default"];
  }
});
Object.defineProperty(exports, "applyPatch", {
  enumerable: true,
  get: function get() {
    return _apply.applyPatch;
  }
});
Object.defineProperty(exports, "applyPatches", {
  enumerable: true,
  get: function get() {
    return _apply.applyPatches;
  }
});
Object.defineProperty(exports, "canonicalize", {
  enumerable: true,
  get: function get() {
    return _json.canonicalize;
  }
});
Object.defineProperty(exports, "convertChangesToDMP", {
  enumerable: true,
  get: function get() {
    return _dmp.convertChangesToDMP;
  }
});
Object.defineProperty(exports, "convertChangesToXML", {
  enumerable: true,
  get: function get() {
    return _xml.convertChangesToXML;
  }
});
Object.defineProperty(exports, "createPatch", {
  enumerable: true,
  get: function get() {
    return _create.createPatch;
  }
});
Object.defineProperty(exports, "createTwoFilesPatch", {
  enumerable: true,
  get: function get() {
    return _create.createTwoFilesPatch;
  }
});
Object.defineProperty(exports, "diffArrays", {
  enumerable: true,
  get: function get() {
    return _array.diffArrays;
  }
});
Object.defineProperty(exports, "diffChars", {
  enumerable: true,
  get: function get() {
    return _character.diffChars;
  }
});
Object.defineProperty(exports, "diffCss", {
  enumerable: true,
  get: function get() {
    return _css.diffCss;
  }
});
Object.defineProperty(exports, "diffJson", {
  enumerable: true,
  get: function get() {
    return _json.diffJson;
  }
});
Object.defineProperty(exports, "diffLines", {
  enumerable: true,
  get: function get() {
    return _line.diffLines;
  }
});
Object.defineProperty(exports, "diffSentences", {
  enumerable: true,
  get: function get() {
    return _sentence.diffSentences;
  }
});
Object.defineProperty(exports, "diffTrimmedLines", {
  enumerable: true,
  get: function get() {
    return _line.diffTrimmedLines;
  }
});
Object.defineProperty(exports, "diffWords", {
  enumerable: true,
  get: function get() {
    return _word.diffWords;
  }
});
Object.defineProperty(exports, "diffWordsWithSpace", {
  enumerable: true,
  get: function get() {
    return _word.diffWordsWithSpace;
  }
});
Object.defineProperty(exports, "formatPatch", {
  enumerable: true,
  get: function get() {
    return _create.formatPatch;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function get() {
    return _merge.merge;
  }
});
Object.defineProperty(exports, "parsePatch", {
  enumerable: true,
  get: function get() {
    return _parse.parsePatch;
  }
});
Object.defineProperty(exports, "reversePatch", {
  enumerable: true,
  get: function get() {
    return _reverse.reversePatch;
  }
});
Object.defineProperty(exports, "structuredPatch", {
  enumerable: true,
  get: function get() {
    return _create.structuredPatch;
  }
});
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./diff/base"))
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_character = require("./diff/character")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_word = require("./diff/word")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_line = require("./diff/line")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_sentence = require("./diff/sentence")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_css = require("./diff/css")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_json = require("./diff/json")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_array = require("./diff/array")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_apply = require("./patch/apply")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_parse = require("./patch/parse")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_merge = require("./patch/merge")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_reverse = require("./patch/reverse")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_create = require("./patch/create")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_dmp = require("./convert/dmp")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_xml = require("./convert/xml")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/*istanbul ignore end*/
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYmFzZSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2NoYXJhY3RlciIsIl93b3JkIiwiX2xpbmUiLCJfc2VudGVuY2UiLCJfY3NzIiwiX2pzb24iLCJfYXJyYXkiLCJfYXBwbHkiLCJfcGFyc2UiLCJfbWVyZ2UiLCJfcmV2ZXJzZSIsIl9jcmVhdGUiLCJfZG1wIiwiX3htbCIsImUiLCJfX2VzTW9kdWxlIl0sInNvdXJjZXMiOlsiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFNlZSBMSUNFTlNFIGZpbGUgZm9yIHRlcm1zIG9mIHVzZSAqL1xuXG4vKlxuICogVGV4dCBkaWZmIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIFRoaXMgbGlicmFyeSBzdXBwb3J0cyB0aGUgZm9sbG93aW5nIEFQSXM6XG4gKiBEaWZmLmRpZmZDaGFyczogQ2hhcmFjdGVyIGJ5IGNoYXJhY3RlciBkaWZmXG4gKiBEaWZmLmRpZmZXb3JkczogV29yZCAoYXMgZGVmaW5lZCBieSBcXGIgcmVnZXgpIGRpZmYgd2hpY2ggaWdub3JlcyB3aGl0ZXNwYWNlXG4gKiBEaWZmLmRpZmZMaW5lczogTGluZSBiYXNlZCBkaWZmXG4gKlxuICogRGlmZi5kaWZmQ3NzOiBEaWZmIHRhcmdldGVkIGF0IENTUyBjb250ZW50XG4gKlxuICogVGhlc2UgbWV0aG9kcyBhcmUgYmFzZWQgb24gdGhlIGltcGxlbWVudGF0aW9uIHByb3Bvc2VkIGluXG4gKiBcIkFuIE8oTkQpIERpZmZlcmVuY2UgQWxnb3JpdGhtIGFuZCBpdHMgVmFyaWF0aW9uc1wiIChNeWVycywgMTk4NikuXG4gKiBodHRwOi8vY2l0ZXNlZXJ4LmlzdC5wc3UuZWR1L3ZpZXdkb2Mvc3VtbWFyeT9kb2k9MTAuMS4xLjQuNjkyN1xuICovXG5pbXBvcnQgRGlmZiBmcm9tICcuL2RpZmYvYmFzZSc7XG5pbXBvcnQge2RpZmZDaGFyc30gZnJvbSAnLi9kaWZmL2NoYXJhY3Rlcic7XG5pbXBvcnQge2RpZmZXb3JkcywgZGlmZldvcmRzV2l0aFNwYWNlfSBmcm9tICcuL2RpZmYvd29yZCc7XG5pbXBvcnQge2RpZmZMaW5lcywgZGlmZlRyaW1tZWRMaW5lc30gZnJvbSAnLi9kaWZmL2xpbmUnO1xuaW1wb3J0IHtkaWZmU2VudGVuY2VzfSBmcm9tICcuL2RpZmYvc2VudGVuY2UnO1xuXG5pbXBvcnQge2RpZmZDc3N9IGZyb20gJy4vZGlmZi9jc3MnO1xuaW1wb3J0IHtkaWZmSnNvbiwgY2Fub25pY2FsaXplfSBmcm9tICcuL2RpZmYvanNvbic7XG5cbmltcG9ydCB7ZGlmZkFycmF5c30gZnJvbSAnLi9kaWZmL2FycmF5JztcblxuaW1wb3J0IHthcHBseVBhdGNoLCBhcHBseVBhdGNoZXN9IGZyb20gJy4vcGF0Y2gvYXBwbHknO1xuaW1wb3J0IHtwYXJzZVBhdGNofSBmcm9tICcuL3BhdGNoL3BhcnNlJztcbmltcG9ydCB7bWVyZ2V9IGZyb20gJy4vcGF0Y2gvbWVyZ2UnO1xuaW1wb3J0IHtyZXZlcnNlUGF0Y2h9IGZyb20gJy4vcGF0Y2gvcmV2ZXJzZSc7XG5pbXBvcnQge3N0cnVjdHVyZWRQYXRjaCwgY3JlYXRlVHdvRmlsZXNQYXRjaCwgY3JlYXRlUGF0Y2gsIGZvcm1hdFBhdGNofSBmcm9tICcuL3BhdGNoL2NyZWF0ZSc7XG5cbmltcG9ydCB7Y29udmVydENoYW5nZXNUb0RNUH0gZnJvbSAnLi9jb252ZXJ0L2RtcCc7XG5pbXBvcnQge2NvbnZlcnRDaGFuZ2VzVG9YTUx9IGZyb20gJy4vY29udmVydC94bWwnO1xuXG5leHBvcnQge1xuICBEaWZmLFxuXG4gIGRpZmZDaGFycyxcbiAgZGlmZldvcmRzLFxuICBkaWZmV29yZHNXaXRoU3BhY2UsXG4gIGRpZmZMaW5lcyxcbiAgZGlmZlRyaW1tZWRMaW5lcyxcbiAgZGlmZlNlbnRlbmNlcyxcblxuICBkaWZmQ3NzLFxuICBkaWZmSnNvbixcblxuICBkaWZmQXJyYXlzLFxuXG4gIHN0cnVjdHVyZWRQYXRjaCxcbiAgY3JlYXRlVHdvRmlsZXNQYXRjaCxcbiAgY3JlYXRlUGF0Y2gsXG4gIGZvcm1hdFBhdGNoLFxuICBhcHBseVBhdGNoLFxuICBhcHBseVBhdGNoZXMsXG4gIHBhcnNlUGF0Y2gsXG4gIG1lcmdlLFxuICByZXZlcnNlUGF0Y2gsXG4gIGNvbnZlcnRDaGFuZ2VzVG9ETVAsXG4gIGNvbnZlcnRDaGFuZ2VzVG9YTUwsXG4gIGNhbm9uaWNhbGl6ZVxufTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQTtBQUFBO0FBQUFBLEtBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFDLFVBQUEsR0FBQUQsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFFLEtBQUEsR0FBQUYsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFHLEtBQUEsR0FBQUgsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFJLFNBQUEsR0FBQUosT0FBQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUFLLElBQUEsR0FBQUwsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFNLEtBQUEsR0FBQU4sT0FBQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUFPLE1BQUEsR0FBQVAsT0FBQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUFRLE1BQUEsR0FBQVIsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFTLE1BQUEsR0FBQVQsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFVLE1BQUEsR0FBQVYsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFXLFFBQUEsR0FBQVgsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFZLE9BQUEsR0FBQVosT0FBQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUFhLElBQUEsR0FBQWIsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFjLElBQUEsR0FBQWQsT0FBQTtBQUFBO0FBQUE7QUFBa0QsbUNBQUFELHVCQUFBZ0IsQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLGdCQUFBQSxDQUFBO0FBQUEiLCJpZ25vcmVMaXN0IjpbXX0=