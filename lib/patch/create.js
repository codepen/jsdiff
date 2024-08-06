/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPatch = createPatch;
exports.createTwoFilesPatch = createTwoFilesPatch;
exports.formatPatch = formatPatch;
exports.structuredPatch = structuredPatch;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_line = require("../diff/line")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*istanbul ignore end*/
function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  if (!options) {
    options = {};
  }
  if (typeof options === 'function') {
    options = {
      callback: options
    };
  }
  if (typeof options.context === 'undefined') {
    options.context = 4;
  }
  if (options.newlineIsToken) {
    throw new Error('newlineIsToken may not be used with patch-generation functions, only with diffing functions');
  }
  if (!options.callback) {
    return diffLinesResultToPatch(
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _line
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    diffLines)
    /*istanbul ignore end*/
    (oldStr, newStr, options));
  } else {
    var
      /*istanbul ignore start*/
      _options =
      /*istanbul ignore end*/
      options,
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      _callback = _options.callback;
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _line
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    diffLines)
    /*istanbul ignore end*/
    (oldStr, newStr,
    /*istanbul ignore start*/
    _objectSpread(_objectSpread({},
    /*istanbul ignore end*/
    options), {}, {
      callback: function callback(diff) {
        var patch = diffLinesResultToPatch(diff);
        _callback(patch);
      }
    }));
  }
  function diffLinesResultToPatch(diff) {
    // STEP 1: Build up the patch with no "\ No newline at end of file" lines and with the arrays
    //         of lines containing trailing newline characters. We'll tidy up later...

    if (!diff) {
      return;
    }
    diff.push({
      value: '',
      lines: []
    }); // Append an empty value to make cleanup easier

    function contextLines(lines) {
      return lines.map(function (entry) {
        return ' ' + entry;
      });
    }
    var hunks = [];
    var oldRangeStart = 0,
      newRangeStart = 0,
      curRange = [],
      oldLine = 1,
      newLine = 1;
    /*istanbul ignore start*/
    var _loop = function _loop()
    /*istanbul ignore end*/
    {
      var current = diff[i],
        lines = current.lines || splitLines(current.value);
      current.lines = lines;
      if (current.added || current.removed) {
        /*istanbul ignore start*/
        var _curRange;
        /*istanbul ignore end*/
        // If we have previous context, start with that
        if (!oldRangeStart) {
          var prev = diff[i - 1];
          oldRangeStart = oldLine;
          newRangeStart = newLine;
          if (prev) {
            curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
            oldRangeStart -= curRange.length;
            newRangeStart -= curRange.length;
          }
        }

        // Output our changes
        /*istanbul ignore start*/
        /*istanbul ignore end*/
        /*istanbul ignore start*/
        (_curRange =
        /*istanbul ignore end*/
        curRange).push.apply(
        /*istanbul ignore start*/
        _curRange
        /*istanbul ignore end*/
        ,
        /*istanbul ignore start*/
        _toConsumableArray(
        /*istanbul ignore end*/
        lines.map(function (entry) {
          return (current.added ? '+' : '-') + entry;
        })));

        // Track the updated file position
        if (current.added) {
          newLine += lines.length;
        } else {
          oldLine += lines.length;
        }
      } else {
        // Identical context lines. Track line changes
        if (oldRangeStart) {
          // Close out any changes that have been output (or join overlapping)
          if (lines.length <= options.context * 2 && i < diff.length - 2) {
            /*istanbul ignore start*/
            var _curRange2;
            /*istanbul ignore end*/
            // Overlapping
            /*istanbul ignore start*/
            /*istanbul ignore end*/
            /*istanbul ignore start*/
            (_curRange2 =
            /*istanbul ignore end*/
            curRange).push.apply(
            /*istanbul ignore start*/
            _curRange2
            /*istanbul ignore end*/
            ,
            /*istanbul ignore start*/
            _toConsumableArray(
            /*istanbul ignore end*/
            contextLines(lines)));
          } else {
            /*istanbul ignore start*/
            var _curRange3;
            /*istanbul ignore end*/
            // end the range and output
            var contextSize = Math.min(lines.length, options.context);
            /*istanbul ignore start*/
            /*istanbul ignore end*/
            /*istanbul ignore start*/
            (_curRange3 =
            /*istanbul ignore end*/
            curRange).push.apply(
            /*istanbul ignore start*/
            _curRange3
            /*istanbul ignore end*/
            ,
            /*istanbul ignore start*/
            _toConsumableArray(
            /*istanbul ignore end*/
            contextLines(lines.slice(0, contextSize))));
            var _hunk = {
              oldStart: oldRangeStart,
              oldLines: oldLine - oldRangeStart + contextSize,
              newStart: newRangeStart,
              newLines: newLine - newRangeStart + contextSize,
              lines: curRange
            };
            hunks.push(_hunk);
            oldRangeStart = 0;
            newRangeStart = 0;
            curRange = [];
          }
        }
        oldLine += lines.length;
        newLine += lines.length;
      }
    };
    for (var i = 0; i < diff.length; i++)
    /*istanbul ignore start*/
    {
      _loop();
    }

    // Step 2: eliminate the trailing `\n` from each line of each hunk, and, where needed, add
    //         "\ No newline at end of file".
    /*istanbul ignore end*/
    for (
    /*istanbul ignore start*/
    var _i = 0, _hunks =
      /*istanbul ignore end*/
      hunks;
    /*istanbul ignore start*/
    _i < _hunks.length
    /*istanbul ignore end*/
    ;
    /*istanbul ignore start*/
    _i++
    /*istanbul ignore end*/
    ) {
      var hunk =
      /*istanbul ignore start*/
      _hunks[_i]
      /*istanbul ignore end*/
      ;
      for (var _i2 = 0; _i2 < hunk.lines.length; _i2++) {
        if (hunk.lines[_i2].endsWith('\n')) {
          hunk.lines[_i2] = hunk.lines[_i2].slice(0, -1);
        } else {
          hunk.lines.splice(_i2 + 1, 0, '\\ No newline at end of file');
          _i2++; // Skip the line we just added, then continue iterating
        }
      }
    }
    return {
      oldFileName: oldFileName,
      newFileName: newFileName,
      oldHeader: oldHeader,
      newHeader: newHeader,
      hunks: hunks
    };
  }
}
function formatPatch(diff) {
  if (Array.isArray(diff)) {
    return diff.map(formatPatch).join('\n');
  }
  var ret = [];
  if (diff.oldFileName == diff.newFileName) {
    ret.push('Index: ' + diff.oldFileName);
  }
  ret.push('===================================================================');
  ret.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\t' + diff.oldHeader));
  ret.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\t' + diff.newHeader));
  for (var i = 0; i < diff.hunks.length; i++) {
    var hunk = diff.hunks[i];
    // Unified Diff Format quirk: If the chunk size is 0,
    // the first number is one lower than one would expect.
    // https://www.artima.com/weblogs/viewpost.jsp?thread=164293
    if (hunk.oldLines === 0) {
      hunk.oldStart -= 1;
    }
    if (hunk.newLines === 0) {
      hunk.newStart -= 1;
    }
    ret.push('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@');
    ret.push.apply(ret, hunk.lines);
  }
  return ret.join('\n') + '\n';
}
function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  /*istanbul ignore start*/
  var _options2;
  /*istanbul ignore end*/
  if (typeof options === 'function') {
    options = {
      callback: options
    };
  }
  if (!
  /*istanbul ignore start*/
  ((_options2 =
  /*istanbul ignore end*/
  options) !== null && _options2 !== void 0 &&
  /*istanbul ignore start*/
  _options2
  /*istanbul ignore end*/
  .callback)) {
    var patchObj = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options);
    if (!patchObj) {
      return;
    }
    return formatPatch(patchObj);
  } else {
    var
      /*istanbul ignore start*/
      _options3 =
      /*istanbul ignore end*/
      options,
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      _callback2 = _options3.callback;
    structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader,
    /*istanbul ignore start*/
    _objectSpread(_objectSpread({},
    /*istanbul ignore end*/
    options), {}, {
      callback: function callback(patchObj) {
        if (!patchObj) {
          _callback2();
        } else {
          _callback2(formatPatch(patchObj));
        }
      }
    }));
  }
}
function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
  return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
}

/**
 * Split `text` into an array of lines, including the trailing newline character (where present)
 */
function splitLines(text) {
  var hasTrailingNl = text.endsWith('\n');
  var result = text.split('\n').map(function (line)
  /*istanbul ignore start*/
  {
    return (
      /*istanbul ignore end*/
      line + '\n'
    );
  });
  if (hasTrailingNl) {
    result.pop();
  } else {
    result.push(result.pop().slice(0, -1));
  }
  return result;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbGluZSIsInJlcXVpcmUiLCJfdHlwZW9mIiwibyIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJyIiwiX2FycmF5V2l0aG91dEhvbGVzIiwiX2l0ZXJhYmxlVG9BcnJheSIsIl91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSIsIl9ub25JdGVyYWJsZVNwcmVhZCIsIlR5cGVFcnJvciIsImEiLCJfYXJyYXlMaWtlVG9BcnJheSIsInQiLCJ0b1N0cmluZyIsImNhbGwiLCJzbGljZSIsIm5hbWUiLCJBcnJheSIsImZyb20iLCJ0ZXN0IiwiaXNBcnJheSIsImxlbmd0aCIsImUiLCJuIiwib3duS2V5cyIsIk9iamVjdCIsImtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJmaWx0ZXIiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwicHVzaCIsImFwcGx5IiwiX29iamVjdFNwcmVhZCIsImFyZ3VtZW50cyIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImRlZmluZVByb3BlcnR5IiwiX3RvUHJvcGVydHlLZXkiLCJ2YWx1ZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiaSIsIl90b1ByaW1pdGl2ZSIsInRvUHJpbWl0aXZlIiwiU3RyaW5nIiwiTnVtYmVyIiwic3RydWN0dXJlZFBhdGNoIiwib2xkRmlsZU5hbWUiLCJuZXdGaWxlTmFtZSIsIm9sZFN0ciIsIm5ld1N0ciIsIm9sZEhlYWRlciIsIm5ld0hlYWRlciIsIm9wdGlvbnMiLCJjYWxsYmFjayIsImNvbnRleHQiLCJuZXdsaW5lSXNUb2tlbiIsIkVycm9yIiwiZGlmZkxpbmVzUmVzdWx0VG9QYXRjaCIsImRpZmZMaW5lcyIsIl9vcHRpb25zIiwiZGlmZiIsInBhdGNoIiwibGluZXMiLCJjb250ZXh0TGluZXMiLCJtYXAiLCJlbnRyeSIsImh1bmtzIiwib2xkUmFuZ2VTdGFydCIsIm5ld1JhbmdlU3RhcnQiLCJjdXJSYW5nZSIsIm9sZExpbmUiLCJuZXdMaW5lIiwiX2xvb3AiLCJjdXJyZW50Iiwic3BsaXRMaW5lcyIsImFkZGVkIiwicmVtb3ZlZCIsIl9jdXJSYW5nZSIsInByZXYiLCJfY3VyUmFuZ2UyIiwiX2N1clJhbmdlMyIsImNvbnRleHRTaXplIiwiTWF0aCIsIm1pbiIsImh1bmsiLCJvbGRTdGFydCIsIm9sZExpbmVzIiwibmV3U3RhcnQiLCJuZXdMaW5lcyIsIl9pIiwiX2h1bmtzIiwiZW5kc1dpdGgiLCJzcGxpY2UiLCJmb3JtYXRQYXRjaCIsImpvaW4iLCJyZXQiLCJjcmVhdGVUd29GaWxlc1BhdGNoIiwiX29wdGlvbnMyIiwicGF0Y2hPYmoiLCJfb3B0aW9uczMiLCJjcmVhdGVQYXRjaCIsImZpbGVOYW1lIiwidGV4dCIsImhhc1RyYWlsaW5nTmwiLCJyZXN1bHQiLCJzcGxpdCIsImxpbmUiLCJwb3AiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvcGF0Y2gvY3JlYXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGlmZkxpbmVzfSBmcm9tICcuLi9kaWZmL2xpbmUnO1xuXG5leHBvcnQgZnVuY3Rpb24gc3RydWN0dXJlZFBhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBvcHRpb25zID0ge2NhbGxiYWNrOiBvcHRpb25zfTtcbiAgfVxuICBpZiAodHlwZW9mIG9wdGlvbnMuY29udGV4dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRpb25zLmNvbnRleHQgPSA0O1xuICB9XG4gIGlmIChvcHRpb25zLm5ld2xpbmVJc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCduZXdsaW5lSXNUb2tlbiBtYXkgbm90IGJlIHVzZWQgd2l0aCBwYXRjaC1nZW5lcmF0aW9uIGZ1bmN0aW9ucywgb25seSB3aXRoIGRpZmZpbmcgZnVuY3Rpb25zJyk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZGlmZkxpbmVzUmVzdWx0VG9QYXRjaChkaWZmTGluZXMob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB7Y2FsbGJhY2t9ID0gb3B0aW9ucztcbiAgICBkaWZmTGluZXMoXG4gICAgICBvbGRTdHIsXG4gICAgICBuZXdTdHIsXG4gICAgICB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIGNhbGxiYWNrOiAoZGlmZikgPT4ge1xuICAgICAgICAgIGNvbnN0IHBhdGNoID0gZGlmZkxpbmVzUmVzdWx0VG9QYXRjaChkaWZmKTtcbiAgICAgICAgICBjYWxsYmFjayhwYXRjaCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlmZkxpbmVzUmVzdWx0VG9QYXRjaChkaWZmKSB7XG4gICAgLy8gU1RFUCAxOiBCdWlsZCB1cCB0aGUgcGF0Y2ggd2l0aCBubyBcIlxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGVcIiBsaW5lcyBhbmQgd2l0aCB0aGUgYXJyYXlzXG4gICAgLy8gICAgICAgICBvZiBsaW5lcyBjb250YWluaW5nIHRyYWlsaW5nIG5ld2xpbmUgY2hhcmFjdGVycy4gV2UnbGwgdGlkeSB1cCBsYXRlci4uLlxuXG4gICAgaWYoIWRpZmYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkaWZmLnB1c2goe3ZhbHVlOiAnJywgbGluZXM6IFtdfSk7IC8vIEFwcGVuZCBhbiBlbXB0eSB2YWx1ZSB0byBtYWtlIGNsZWFudXAgZWFzaWVyXG5cbiAgICBmdW5jdGlvbiBjb250ZXh0TGluZXMobGluZXMpIHtcbiAgICAgIHJldHVybiBsaW5lcy5tYXAoZnVuY3Rpb24oZW50cnkpIHsgcmV0dXJuICcgJyArIGVudHJ5OyB9KTtcbiAgICB9XG5cbiAgICBsZXQgaHVua3MgPSBbXTtcbiAgICBsZXQgb2xkUmFuZ2VTdGFydCA9IDAsIG5ld1JhbmdlU3RhcnQgPSAwLCBjdXJSYW5nZSA9IFtdLFxuICAgICAgICBvbGRMaW5lID0gMSwgbmV3TGluZSA9IDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gZGlmZltpXSxcbiAgICAgICAgICAgIGxpbmVzID0gY3VycmVudC5saW5lcyB8fCBzcGxpdExpbmVzKGN1cnJlbnQudmFsdWUpO1xuICAgICAgY3VycmVudC5saW5lcyA9IGxpbmVzO1xuXG4gICAgICBpZiAoY3VycmVudC5hZGRlZCB8fCBjdXJyZW50LnJlbW92ZWQpIHtcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBwcmV2aW91cyBjb250ZXh0LCBzdGFydCB3aXRoIHRoYXRcbiAgICAgICAgaWYgKCFvbGRSYW5nZVN0YXJ0KSB7XG4gICAgICAgICAgY29uc3QgcHJldiA9IGRpZmZbaSAtIDFdO1xuICAgICAgICAgIG9sZFJhbmdlU3RhcnQgPSBvbGRMaW5lO1xuICAgICAgICAgIG5ld1JhbmdlU3RhcnQgPSBuZXdMaW5lO1xuXG4gICAgICAgICAgaWYgKHByZXYpIHtcbiAgICAgICAgICAgIGN1clJhbmdlID0gb3B0aW9ucy5jb250ZXh0ID4gMCA/IGNvbnRleHRMaW5lcyhwcmV2LmxpbmVzLnNsaWNlKC1vcHRpb25zLmNvbnRleHQpKSA6IFtdO1xuICAgICAgICAgICAgb2xkUmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgICAgICBuZXdSYW5nZVN0YXJ0IC09IGN1clJhbmdlLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdXRwdXQgb3VyIGNoYW5nZXNcbiAgICAgICAgY3VyUmFuZ2UucHVzaCguLi4gbGluZXMubWFwKGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgICAgICAgcmV0dXJuIChjdXJyZW50LmFkZGVkID8gJysnIDogJy0nKSArIGVudHJ5O1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gVHJhY2sgdGhlIHVwZGF0ZWQgZmlsZSBwb3NpdGlvblxuICAgICAgICBpZiAoY3VycmVudC5hZGRlZCkge1xuICAgICAgICAgIG5ld0xpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9sZExpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJZGVudGljYWwgY29udGV4dCBsaW5lcy4gVHJhY2sgbGluZSBjaGFuZ2VzXG4gICAgICAgIGlmIChvbGRSYW5nZVN0YXJ0KSB7XG4gICAgICAgICAgLy8gQ2xvc2Ugb3V0IGFueSBjaGFuZ2VzIHRoYXQgaGF2ZSBiZWVuIG91dHB1dCAob3Igam9pbiBvdmVybGFwcGluZylcbiAgICAgICAgICBpZiAobGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCAqIDIgJiYgaSA8IGRpZmYubGVuZ3RoIC0gMikge1xuICAgICAgICAgICAgLy8gT3ZlcmxhcHBpbmdcbiAgICAgICAgICAgIGN1clJhbmdlLnB1c2goLi4uIGNvbnRleHRMaW5lcyhsaW5lcykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlbmQgdGhlIHJhbmdlIGFuZCBvdXRwdXRcbiAgICAgICAgICAgIGxldCBjb250ZXh0U2l6ZSA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgb3B0aW9ucy5jb250ZXh0KTtcbiAgICAgICAgICAgIGN1clJhbmdlLnB1c2goLi4uIGNvbnRleHRMaW5lcyhsaW5lcy5zbGljZSgwLCBjb250ZXh0U2l6ZSkpKTtcblxuICAgICAgICAgICAgbGV0IGh1bmsgPSB7XG4gICAgICAgICAgICAgIG9sZFN0YXJ0OiBvbGRSYW5nZVN0YXJ0LFxuICAgICAgICAgICAgICBvbGRMaW5lczogKG9sZExpbmUgLSBvbGRSYW5nZVN0YXJ0ICsgY29udGV4dFNpemUpLFxuICAgICAgICAgICAgICBuZXdTdGFydDogbmV3UmFuZ2VTdGFydCxcbiAgICAgICAgICAgICAgbmV3TGluZXM6IChuZXdMaW5lIC0gbmV3UmFuZ2VTdGFydCArIGNvbnRleHRTaXplKSxcbiAgICAgICAgICAgICAgbGluZXM6IGN1clJhbmdlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHVua3MucHVzaChodW5rKTtcblxuICAgICAgICAgICAgb2xkUmFuZ2VTdGFydCA9IDA7XG4gICAgICAgICAgICBuZXdSYW5nZVN0YXJ0ID0gMDtcbiAgICAgICAgICAgIGN1clJhbmdlID0gW107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG9sZExpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgICBuZXdMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdGVwIDI6IGVsaW1pbmF0ZSB0aGUgdHJhaWxpbmcgYFxcbmAgZnJvbSBlYWNoIGxpbmUgb2YgZWFjaCBodW5rLCBhbmQsIHdoZXJlIG5lZWRlZCwgYWRkXG4gICAgLy8gICAgICAgICBcIlxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGVcIi5cbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgaHVua3MpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaHVuay5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaHVuay5saW5lc1tpXS5lbmRzV2l0aCgnXFxuJykpIHtcbiAgICAgICAgICBodW5rLmxpbmVzW2ldID0gaHVuay5saW5lc1tpXS5zbGljZSgwLCAtMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaHVuay5saW5lcy5zcGxpY2UoaSArIDEsIDAsICdcXFxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGUnKTtcbiAgICAgICAgICBpKys7IC8vIFNraXAgdGhlIGxpbmUgd2UganVzdCBhZGRlZCwgdGhlbiBjb250aW51ZSBpdGVyYXRpbmdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBvbGRGaWxlTmFtZTogb2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lOiBuZXdGaWxlTmFtZSxcbiAgICAgIG9sZEhlYWRlcjogb2xkSGVhZGVyLCBuZXdIZWFkZXI6IG5ld0hlYWRlcixcbiAgICAgIGh1bmtzOiBodW5rc1xuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFBhdGNoKGRpZmYpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGlmZikpIHtcbiAgICByZXR1cm4gZGlmZi5tYXAoZm9ybWF0UGF0Y2gpLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgY29uc3QgcmV0ID0gW107XG4gIGlmIChkaWZmLm9sZEZpbGVOYW1lID09IGRpZmYubmV3RmlsZU5hbWUpIHtcbiAgICByZXQucHVzaCgnSW5kZXg6ICcgKyBkaWZmLm9sZEZpbGVOYW1lKTtcbiAgfVxuICByZXQucHVzaCgnPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PScpO1xuICByZXQucHVzaCgnLS0tICcgKyBkaWZmLm9sZEZpbGVOYW1lICsgKHR5cGVvZiBkaWZmLm9sZEhlYWRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6ICdcXHQnICsgZGlmZi5vbGRIZWFkZXIpKTtcbiAgcmV0LnB1c2goJysrKyAnICsgZGlmZi5uZXdGaWxlTmFtZSArICh0eXBlb2YgZGlmZi5uZXdIZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJycgOiAnXFx0JyArIGRpZmYubmV3SGVhZGVyKSk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmLmh1bmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgaHVuayA9IGRpZmYuaHVua3NbaV07XG4gICAgLy8gVW5pZmllZCBEaWZmIEZvcm1hdCBxdWlyazogSWYgdGhlIGNodW5rIHNpemUgaXMgMCxcbiAgICAvLyB0aGUgZmlyc3QgbnVtYmVyIGlzIG9uZSBsb3dlciB0aGFuIG9uZSB3b3VsZCBleHBlY3QuXG4gICAgLy8gaHR0cHM6Ly93d3cuYXJ0aW1hLmNvbS93ZWJsb2dzL3ZpZXdwb3N0LmpzcD90aHJlYWQ9MTY0MjkzXG4gICAgaWYgKGh1bmsub2xkTGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsub2xkU3RhcnQgLT0gMTtcbiAgICB9XG4gICAgaWYgKGh1bmsubmV3TGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsubmV3U3RhcnQgLT0gMTtcbiAgICB9XG4gICAgcmV0LnB1c2goXG4gICAgICAnQEAgLScgKyBodW5rLm9sZFN0YXJ0ICsgJywnICsgaHVuay5vbGRMaW5lc1xuICAgICAgKyAnICsnICsgaHVuay5uZXdTdGFydCArICcsJyArIGh1bmsubmV3TGluZXNcbiAgICAgICsgJyBAQCdcbiAgICApO1xuICAgIHJldC5wdXNoLmFwcGx5KHJldCwgaHVuay5saW5lcyk7XG4gIH1cblxuICByZXR1cm4gcmV0LmpvaW4oJ1xcbicpICsgJ1xcbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUd29GaWxlc1BhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdGlvbnMgPSB7Y2FsbGJhY2s6IG9wdGlvbnN9O1xuICB9XG5cbiAgaWYgKCFvcHRpb25zPy5jYWxsYmFjaykge1xuICAgIGNvbnN0IHBhdGNoT2JqID0gc3RydWN0dXJlZFBhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKTtcbiAgICBpZiAoIXBhdGNoT2JqKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBmb3JtYXRQYXRjaChwYXRjaE9iaik7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qge2NhbGxiYWNrfSA9IG9wdGlvbnM7XG4gICAgc3RydWN0dXJlZFBhdGNoKFxuICAgICAgb2xkRmlsZU5hbWUsXG4gICAgICBuZXdGaWxlTmFtZSxcbiAgICAgIG9sZFN0cixcbiAgICAgIG5ld1N0cixcbiAgICAgIG9sZEhlYWRlcixcbiAgICAgIG5ld0hlYWRlcixcbiAgICAgIHtcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgY2FsbGJhY2s6IHBhdGNoT2JqID0+IHtcbiAgICAgICAgICBpZiAoIXBhdGNoT2JqKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjayhmb3JtYXRQYXRjaChwYXRjaE9iaikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBhdGNoKGZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNyZWF0ZVR3b0ZpbGVzUGF0Y2goZmlsZU5hbWUsIGZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIFNwbGl0IGB0ZXh0YCBpbnRvIGFuIGFycmF5IG9mIGxpbmVzLCBpbmNsdWRpbmcgdGhlIHRyYWlsaW5nIG5ld2xpbmUgY2hhcmFjdGVyICh3aGVyZSBwcmVzZW50KVxuICovXG5mdW5jdGlvbiBzcGxpdExpbmVzKHRleHQpIHtcbiAgY29uc3QgaGFzVHJhaWxpbmdObCA9IHRleHQuZW5kc1dpdGgoJ1xcbicpO1xuICBjb25zdCByZXN1bHQgPSB0ZXh0LnNwbGl0KCdcXG4nKS5tYXAobGluZSA9PiBsaW5lICsgJ1xcbicpO1xuICBpZiAoaGFzVHJhaWxpbmdObCkge1xuICAgIHJlc3VsdC5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQucHVzaChyZXN1bHQucG9wKCkuc2xpY2UoMCwgLTEpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQUEsS0FBQSxHQUFBQyxPQUFBO0FBQUE7QUFBQTtBQUF1QyxtQ0FBQUMsUUFBQUMsQ0FBQSxzQ0FBQUQsT0FBQSx3QkFBQUUsTUFBQSx1QkFBQUEsTUFBQSxDQUFBQyxRQUFBLGFBQUFGLENBQUEsa0JBQUFBLENBQUEsZ0JBQUFBLENBQUEsV0FBQUEsQ0FBQSx5QkFBQUMsTUFBQSxJQUFBRCxDQUFBLENBQUFHLFdBQUEsS0FBQUYsTUFBQSxJQUFBRCxDQUFBLEtBQUFDLE1BQUEsQ0FBQUcsU0FBQSxxQkFBQUosQ0FBQSxLQUFBRCxPQUFBLENBQUFDLENBQUE7QUFBQSxTQUFBSyxtQkFBQUMsQ0FBQSxXQUFBQyxrQkFBQSxDQUFBRCxDQUFBLEtBQUFFLGdCQUFBLENBQUFGLENBQUEsS0FBQUcsMkJBQUEsQ0FBQUgsQ0FBQSxLQUFBSSxrQkFBQTtBQUFBLFNBQUFBLG1CQUFBLGNBQUFDLFNBQUE7QUFBQSxTQUFBRiw0QkFBQUgsQ0FBQSxFQUFBTSxDQUFBLFFBQUFOLENBQUEsMkJBQUFBLENBQUEsU0FBQU8saUJBQUEsQ0FBQVAsQ0FBQSxFQUFBTSxDQUFBLE9BQUFFLENBQUEsTUFBQUMsUUFBQSxDQUFBQyxJQUFBLENBQUFWLENBQUEsRUFBQVcsS0FBQSw2QkFBQUgsQ0FBQSxJQUFBUixDQUFBLENBQUFILFdBQUEsS0FBQVcsQ0FBQSxHQUFBUixDQUFBLENBQUFILFdBQUEsQ0FBQWUsSUFBQSxhQUFBSixDQUFBLGNBQUFBLENBQUEsR0FBQUssS0FBQSxDQUFBQyxJQUFBLENBQUFkLENBQUEsb0JBQUFRLENBQUEsK0NBQUFPLElBQUEsQ0FBQVAsQ0FBQSxJQUFBRCxpQkFBQSxDQUFBUCxDQUFBLEVBQUFNLENBQUE7QUFBQSxTQUFBSixpQkFB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QUM7RUFDOUIsQ0FBQyxNQUFNO0lBQ0w7TUFBQTtNQUFBQyxTQUFBO01BQUE7TUFBbUIvQyxPQUFPO01BQUE7TUFBQTtNQUFuQkMsVUFBUSxHQUFBOEMsU0FBQSxDQUFSOUMsUUFBUTtJQUNmUixlQUFlLENBQ2JDLFdBQVcsRUFDWEMsV0FBVyxFQUNYQyxNQUFNLEVBQ05DLE1BQU0sRUFDTkMsU0FBUyxFQUNUQyxTQUFTO0lBQUE7SUFBQXRCLGFBQUEsQ0FBQUEsYUFBQTtJQUFBO0lBRUp1QixPQUFPO01BQ1ZDLFFBQVEsRUFBRSxTQUFWQSxRQUFRQSxDQUFFNkMsUUFBUSxFQUFJO1FBQ3BCLElBQUksQ0FBQ0EsUUFBUSxFQUFFO1VBQ2I3QyxVQUFRLENBQUMsQ0FBQztRQUNaLENBQUMsTUFBTTtVQUNMQSxVQUFRLENBQUN3QyxXQUFXLENBQUNLLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDO01BQ0Y7SUFBQyxFQUVMLENBQUM7RUFDSDtBQUNGO0FBRU8sU0FBU0UsV0FBV0EsQ0FBQ0MsUUFBUSxFQUFFckQsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFQyxPQUFPLEVBQUU7RUFDbkYsT0FBTzRDLG1CQUFtQixDQUFDSyxRQUFRLEVBQUVBLFFBQVEsRUFBRXJELE1BQU0sRUFBRUMsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRUMsT0FBTyxDQUFDO0FBQy9GOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVNzQixVQUFVQSxDQUFDNEIsSUFBSSxFQUFFO0VBQ3hCLElBQU1DLGFBQWEsR0FBR0QsSUFBSSxDQUFDWCxRQUFRLENBQUMsSUFBSSxDQUFDO0VBQ3pDLElBQU1hLE1BQU0sR0FBR0YsSUFBSSxDQUFDRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUN6QyxHQUFHLENBQUMsVUFBQTBDLElBQUk7RUFBQTtFQUFBO0lBQUE7TUFBQTtNQUFJQSxJQUFJLEdBQUc7SUFBSTtFQUFBLEVBQUM7RUFDeEQsSUFBSUgsYUFBYSxFQUFFO0lBQ2pCQyxNQUFNLENBQUNHLEdBQUcsQ0FBQyxDQUFDO0VBQ2QsQ0FBQyxNQUFNO0lBQ0xILE1BQU0sQ0FBQzdFLElBQUksQ0FBQzZFLE1BQU0sQ0FBQ0csR0FBRyxDQUFDLENBQUMsQ0FBQ2hHLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN4QztFQUNBLE9BQU82RixNQUFNO0FBQ2YiLCJpZ25vcmVMaXN0IjpbXX0=