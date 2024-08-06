/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffLines = diffLines;
exports.diffTrimmedLines = diffTrimmedLines;
exports.lineDiff = void 0;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_params = require("../util/params")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/*istanbul ignore end*/
var lineDiff =
/*istanbul ignore start*/
exports.lineDiff =
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
lineDiff.tokenize = function (value, options) {
  if (options.stripTrailingCr) {
    // remove one \r before \n to match GNU diff's --strip-trailing-cr behavior
    value = value.replace(/\r\n/g, '\n');
  }
  var retLines = [],
    linesAndNewlines = value.split(/(\n|\r\n)/);

  // Ignore the final empty token that occurs if the string ends with a new line
  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  }

  // Merge the content and line separators into single tokens
  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];
    if (i % 2 && !options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      retLines.push(line);
    }
  }
  return retLines;
};
lineDiff.equals = function (left, right, options) {
  // If we're ignoring whitespace, we need to normalise lines by stripping
  // whitespace before checking equality. (This has an annoying interaction
  // with newlineIsToken that requires special handling: if newlines get their
  // own token, then we DON'T want to trim the *newline* tokens down to empty
  // strings, since this would cause us to treat whitespace-only line content
  // as equal to a separator between lines, which would be weird and
  // inconsistent with the documented behavior of the options.)
  if (options.ignoreWhitespace) {
    if (!options.newlineIsToken || !left.includes('\n')) {
      left = left.trim();
    }
    if (!options.newlineIsToken || !right.includes('\n')) {
      right = right.trim();
    }
  } else if (options.ignoreNewlineAtEof && !options.newlineIsToken) {
    if (left.endsWith('\n')) {
      left = left.slice(0, -1);
    }
    if (right.endsWith('\n')) {
      right = right.slice(0, -1);
    }
  }
  return (
    /*istanbul ignore start*/
    _base
    /*istanbul ignore end*/
    [
    /*istanbul ignore start*/
    "default"
    /*istanbul ignore end*/
    ].prototype.equals.call(this, left, right, options)
  );
};
function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}

// Kept for backwards compatibility. This is a rather arbitrary wrapper method
// that just calls `diffLines` with `ignoreWhitespace: true`. It's confusing to
// have two ways to do exactly the same thing in the API, so we no longer
// document this one (library users should explicitly use `diffLines` with
// `ignoreWhitespace: true` instead) but we keep it around to maintain
// compatibility with code that used old versions.
function diffTrimmedLines(oldStr, newStr, callback) {
  var options =
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/
  /*istanbul ignore start*/
  _params
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  generateOptions)
  /*istanbul ignore end*/
  (callback, {
    ignoreWhitespace: true
  });
  return lineDiff.diff(oldStr, newStr, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYmFzZSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3BhcmFtcyIsImUiLCJfX2VzTW9kdWxlIiwibGluZURpZmYiLCJleHBvcnRzIiwiRGlmZiIsInRva2VuaXplIiwidmFsdWUiLCJvcHRpb25zIiwic3RyaXBUcmFpbGluZ0NyIiwicmVwbGFjZSIsInJldExpbmVzIiwibGluZXNBbmROZXdsaW5lcyIsInNwbGl0IiwibGVuZ3RoIiwicG9wIiwiaSIsImxpbmUiLCJuZXdsaW5lSXNUb2tlbiIsInB1c2giLCJlcXVhbHMiLCJsZWZ0IiwicmlnaHQiLCJpZ25vcmVXaGl0ZXNwYWNlIiwiaW5jbHVkZXMiLCJ0cmltIiwiaWdub3JlTmV3bGluZUF0RW9mIiwiZW5kc1dpdGgiLCJzbGljZSIsInByb3RvdHlwZSIsImNhbGwiLCJkaWZmTGluZXMiLCJvbGRTdHIiLCJuZXdTdHIiLCJjYWxsYmFjayIsImRpZmYiLCJkaWZmVHJpbW1lZExpbmVzIiwiZ2VuZXJhdGVPcHRpb25zIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RpZmYvbGluZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGlmZiBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHtnZW5lcmF0ZU9wdGlvbnN9IGZyb20gJy4uL3V0aWwvcGFyYW1zJztcblxuZXhwb3J0IGNvbnN0IGxpbmVEaWZmID0gbmV3IERpZmYoKTtcbmxpbmVEaWZmLnRva2VuaXplID0gZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgaWYob3B0aW9ucy5zdHJpcFRyYWlsaW5nQ3IpIHtcbiAgICAvLyByZW1vdmUgb25lIFxcciBiZWZvcmUgXFxuIHRvIG1hdGNoIEdOVSBkaWZmJ3MgLS1zdHJpcC10cmFpbGluZy1jciBiZWhhdmlvclxuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgfVxuXG4gIGxldCByZXRMaW5lcyA9IFtdLFxuICAgICAgbGluZXNBbmROZXdsaW5lcyA9IHZhbHVlLnNwbGl0KC8oXFxufFxcclxcbikvKTtcblxuICAvLyBJZ25vcmUgdGhlIGZpbmFsIGVtcHR5IHRva2VuIHRoYXQgb2NjdXJzIGlmIHRoZSBzdHJpbmcgZW5kcyB3aXRoIGEgbmV3IGxpbmVcbiAgaWYgKCFsaW5lc0FuZE5ld2xpbmVzW2xpbmVzQW5kTmV3bGluZXMubGVuZ3RoIC0gMV0pIHtcbiAgICBsaW5lc0FuZE5ld2xpbmVzLnBvcCgpO1xuICB9XG5cbiAgLy8gTWVyZ2UgdGhlIGNvbnRlbnQgYW5kIGxpbmUgc2VwYXJhdG9ycyBpbnRvIHNpbmdsZSB0b2tlbnNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lc0FuZE5ld2xpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGxpbmUgPSBsaW5lc0FuZE5ld2xpbmVzW2ldO1xuXG4gICAgaWYgKGkgJSAyICYmICFvcHRpb25zLm5ld2xpbmVJc1Rva2VuKSB7XG4gICAgICByZXRMaW5lc1tyZXRMaW5lcy5sZW5ndGggLSAxXSArPSBsaW5lO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXRMaW5lcztcbn07XG5cbmxpbmVEaWZmLmVxdWFscyA9IGZ1bmN0aW9uKGxlZnQsIHJpZ2h0LCBvcHRpb25zKSB7XG4gIC8vIElmIHdlJ3JlIGlnbm9yaW5nIHdoaXRlc3BhY2UsIHdlIG5lZWQgdG8gbm9ybWFsaXNlIGxpbmVzIGJ5IHN0cmlwcGluZ1xuICAvLyB3aGl0ZXNwYWNlIGJlZm9yZSBjaGVja2luZyBlcXVhbGl0eS4gKFRoaXMgaGFzIGFuIGFubm95aW5nIGludGVyYWN0aW9uXG4gIC8vIHdpdGggbmV3bGluZUlzVG9rZW4gdGhhdCByZXF1aXJlcyBzcGVjaWFsIGhhbmRsaW5nOiBpZiBuZXdsaW5lcyBnZXQgdGhlaXJcbiAgLy8gb3duIHRva2VuLCB0aGVuIHdlIERPTidUIHdhbnQgdG8gdHJpbSB0aGUgKm5ld2xpbmUqIHRva2VucyBkb3duIHRvIGVtcHR5XG4gIC8vIHN0cmluZ3MsIHNpbmNlIHRoaXMgd291bGQgY2F1c2UgdXMgdG8gdHJlYXQgd2hpdGVzcGFjZS1vbmx5IGxpbmUgY29udGVudFxuICAvLyBhcyBlcXVhbCB0byBhIHNlcGFyYXRvciBiZXR3ZWVuIGxpbmVzLCB3aGljaCB3b3VsZCBiZSB3ZWlyZCBhbmRcbiAgLy8gaW5jb25zaXN0ZW50IHdpdGggdGhlIGRvY3VtZW50ZWQgYmVoYXZpb3Igb2YgdGhlIG9wdGlvbnMuKVxuICBpZiAob3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlKSB7XG4gICAgaWYgKCFvcHRpb25zLm5ld2xpbmVJc1Rva2VuIHx8ICFsZWZ0LmluY2x1ZGVzKCdcXG4nKSkge1xuICAgICAgbGVmdCA9IGxlZnQudHJpbSgpO1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMubmV3bGluZUlzVG9rZW4gfHwgIXJpZ2h0LmluY2x1ZGVzKCdcXG4nKSkge1xuICAgICAgcmlnaHQgPSByaWdodC50cmltKCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKG9wdGlvbnMuaWdub3JlTmV3bGluZUF0RW9mICYmICFvcHRpb25zLm5ld2xpbmVJc1Rva2VuKSB7XG4gICAgaWYgKGxlZnQuZW5kc1dpdGgoJ1xcbicpKSB7XG4gICAgICBsZWZ0ID0gbGVmdC5zbGljZSgwLCAtMSk7XG4gICAgfVxuICAgIGlmIChyaWdodC5lbmRzV2l0aCgnXFxuJykpIHtcbiAgICAgIHJpZ2h0ID0gcmlnaHQuc2xpY2UoMCwgLTEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gRGlmZi5wcm90b3R5cGUuZXF1YWxzLmNhbGwodGhpcywgbGVmdCwgcmlnaHQsIG9wdGlvbnMpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZMaW5lcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHsgcmV0dXJuIGxpbmVEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKTsgfVxuXG4vLyBLZXB0IGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gVGhpcyBpcyBhIHJhdGhlciBhcmJpdHJhcnkgd3JhcHBlciBtZXRob2Rcbi8vIHRoYXQganVzdCBjYWxscyBgZGlmZkxpbmVzYCB3aXRoIGBpZ25vcmVXaGl0ZXNwYWNlOiB0cnVlYC4gSXQncyBjb25mdXNpbmcgdG9cbi8vIGhhdmUgdHdvIHdheXMgdG8gZG8gZXhhY3RseSB0aGUgc2FtZSB0aGluZyBpbiB0aGUgQVBJLCBzbyB3ZSBubyBsb25nZXJcbi8vIGRvY3VtZW50IHRoaXMgb25lIChsaWJyYXJ5IHVzZXJzIHNob3VsZCBleHBsaWNpdGx5IHVzZSBgZGlmZkxpbmVzYCB3aXRoXG4vLyBgaWdub3JlV2hpdGVzcGFjZTogdHJ1ZWAgaW5zdGVhZCkgYnV0IHdlIGtlZXAgaXQgYXJvdW5kIHRvIG1haW50YWluXG4vLyBjb21wYXRpYmlsaXR5IHdpdGggY29kZSB0aGF0IHVzZWQgb2xkIHZlcnNpb25zLlxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZUcmltbWVkTGluZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7XG4gIGxldCBvcHRpb25zID0gZ2VuZXJhdGVPcHRpb25zKGNhbGxiYWNrLCB7aWdub3JlV2hpdGVzcGFjZTogdHJ1ZX0pO1xuICByZXR1cm4gbGluZURpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUFBLEtBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFDLE9BQUEsR0FBQUQsT0FBQTtBQUFBO0FBQUE7QUFBK0MsbUNBQUFELHVCQUFBRyxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsZ0JBQUFBLENBQUE7QUFBQTtBQUV4QyxJQUFNRSxRQUFRO0FBQUE7QUFBQUMsT0FBQSxDQUFBRCxRQUFBO0FBQUE7QUFBRztBQUFJRTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQSxDQUFJLENBQUMsQ0FBQztBQUNsQ0YsUUFBUSxDQUFDRyxRQUFRLEdBQUcsVUFBU0MsS0FBSyxFQUFFQyxPQUFPLEVBQUU7RUFDM0MsSUFBR0EsT0FBTyxDQUFDQyxlQUFlLEVBQUU7SUFDMUI7SUFDQUYsS0FBSyxHQUFHQSxLQUFLLENBQUNHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO0VBQ3RDO0VBRUEsSUFBSUMsUUFBUSxHQUFHLEVBQUU7SUFDYkMsZ0JBQWdCLEdBQUdMLEtBQUssQ0FBQ00sS0FBSyxDQUFDLFdBQVcsQ0FBQzs7RUFFL0M7RUFDQSxJQUFJLENBQUNELGdCQUFnQixDQUFDQSxnQkFBZ0IsQ0FBQ0UsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ2xERixnQkFBZ0IsQ0FBQ0csR0FBRyxDQUFDLENBQUM7RUFDeEI7O0VBRUE7RUFDQSxLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0osZ0JBQWdCLENBQUNFLE1BQU0sRUFBRUUsQ0FBQyxFQUFFLEVBQUU7SUFDaEQsSUFBSUMsSUFBSSxHQUFHTCxnQkFBZ0IsQ0FBQ0ksQ0FBQyxDQUFDO0lBRTlCLElBQUlBLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQ1IsT0FBTyxDQUFDVSxjQUFjLEVBQUU7TUFDcENQLFFBQVEsQ0FBQ0EsUUFBUSxDQUFDRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUlHLElBQUk7SUFDdkMsQ0FBQyxNQUFNO01BQ0xOLFFBQVEsQ0FBQ1EsSUFBSSxDQUFDRixJQUFJLENBQUM7SUFDckI7RUFDRjtFQUVBLE9BQU9OLFFBQVE7QUFDakIsQ0FBQztBQUVEUixRQUFRLENBQUNpQixNQUFNLEdBQUcsVUFBU0MsSUFBSSxFQUFFQyxLQUFLLEVBQUVkLE9BQU8sRUFBRTtFQUMvQztFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLElBQUlBLE9BQU8sQ0FBQ2UsZ0JBQWdCLEVBQUU7SUFDNUIsSUFBSSxDQUFDZixPQUFPLENBQUNVLGNBQWMsSUFBSSxDQUFDRyxJQUFJLENBQUNHLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNuREgsSUFBSSxHQUFHQSxJQUFJLENBQUNJLElBQUksQ0FBQyxDQUFDO0lBQ3BCO0lBQ0EsSUFBSSxDQUFDakIsT0FBTyxDQUFDVSxjQUFjLElBQUksQ0FBQ0ksS0FBSyxDQUFDRSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDcERGLEtBQUssR0FBR0EsS0FBSyxDQUFDRyxJQUFJLENBQUMsQ0FBQztJQUN0QjtFQUNGLENBQUMsTUFBTSxJQUFJakIsT0FBTyxDQUFDa0Isa0JBQWtCLElBQUksQ0FBQ2xCLE9BQU8sQ0FBQ1UsY0FBYyxFQUFFO0lBQ2hFLElBQUlHLElBQUksQ0FBQ00sUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ3ZCTixJQUFJLEdBQUdBLElBQUksQ0FBQ08sS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMxQjtJQUNBLElBQUlOLEtBQUssQ0FBQ0ssUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ3hCTCxLQUFLLEdBQUdBLEtBQUssQ0FBQ00sS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QjtFQUNGO0VBQ0EsT0FBT3ZCO0lBQUFBO0lBQUFBO0lBQUFBO0lBQUFBO0lBQUFBO0lBQUFBO0lBQUFBO0lBQUFBLENBQUksQ0FBQ3dCLFNBQVMsQ0FBQ1QsTUFBTSxDQUFDVSxJQUFJLENBQUMsSUFBSSxFQUFFVCxJQUFJLEVBQUVDLEtBQUssRUFBRWQsT0FBTztFQUFDO0FBQy9ELENBQUM7QUFFTSxTQUFTdUIsU0FBU0EsQ0FBQ0MsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLFFBQVEsRUFBRTtFQUFFLE9BQU8vQixRQUFRLENBQUNnQyxJQUFJLENBQUNILE1BQU0sRUFBRUMsTUFBTSxFQUFFQyxRQUFRLENBQUM7QUFBRTs7QUFFdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBU0UsZ0JBQWdCQSxDQUFDSixNQUFNLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxFQUFFO0VBQ3pELElBQUkxQixPQUFPO0VBQUc7RUFBQTtFQUFBO0VBQUE2QjtFQUFBQTtFQUFBQTtFQUFBQTtFQUFBQTtFQUFBQSxlQUFlO0VBQUE7RUFBQSxDQUFDSCxRQUFRLEVBQUU7SUFBQ1gsZ0JBQWdCLEVBQUU7RUFBSSxDQUFDLENBQUM7RUFDakUsT0FBT3BCLFFBQVEsQ0FBQ2dDLElBQUksQ0FBQ0gsTUFBTSxFQUFFQyxNQUFNLEVBQUV6QixPQUFPLENBQUM7QUFDL0MiLCJpZ25vcmVMaXN0IjpbXX0=