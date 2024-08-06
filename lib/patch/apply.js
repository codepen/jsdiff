/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyPatch = applyPatch;
exports.applyPatches = applyPatches;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_string = require("../util/string")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_lineEndings = require("./line-endings")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_parse = require("./parse")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_distanceIterator = _interopRequireDefault(require("../util/distance-iterator"))
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/*istanbul ignore end*/
function applyPatch(source, uniDiff) {
  /*istanbul ignore start*/
  var
  /*istanbul ignore end*/
  options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (typeof uniDiff === 'string') {
    uniDiff =
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _parse
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    parsePatch)
    /*istanbul ignore end*/
    (uniDiff);
  }
  if (Array.isArray(uniDiff)) {
    if (uniDiff.length > 1) {
      throw new Error('applyPatch only works with a single input.');
    }
    uniDiff = uniDiff[0];
  }
  if (options.autoConvertLineEndings || options.autoConvertLineEndings == null) {
    if (
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _string
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    hasOnlyWinLineEndings)
    /*istanbul ignore end*/
    (source) &&
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _lineEndings
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    isUnix)
    /*istanbul ignore end*/
    (uniDiff)) {
      uniDiff =
      /*istanbul ignore start*/
      (0,
      /*istanbul ignore end*/
      /*istanbul ignore start*/
      _lineEndings
      /*istanbul ignore end*/
      .
      /*istanbul ignore start*/
      unixToWin)
      /*istanbul ignore end*/
      (uniDiff);
    } else if (
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _string
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    hasOnlyUnixLineEndings)
    /*istanbul ignore end*/
    (source) &&
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _lineEndings
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    isWin)
    /*istanbul ignore end*/
    (uniDiff)) {
      uniDiff =
      /*istanbul ignore start*/
      (0,
      /*istanbul ignore end*/
      /*istanbul ignore start*/
      _lineEndings
      /*istanbul ignore end*/
      .
      /*istanbul ignore start*/
      winToUnix)
      /*istanbul ignore end*/
      (uniDiff);
    }
  }

  // Apply the diff to the input
  var lines = source.split('\n'),
    hunks = uniDiff.hunks,
    compareLine = options.compareLine || function (lineNumber, line, operation, patchContent)
    /*istanbul ignore start*/
    {
      return (
        /*istanbul ignore end*/
        line === patchContent
      );
    },
    fuzzFactor = options.fuzzFactor || 0,
    minLine = 0;
  if (fuzzFactor < 0 || !Number.isInteger(fuzzFactor)) {
    throw new Error('fuzzFactor must be a non-negative integer');
  }

  // Special case for empty patch.
  if (!hunks.length) {
    return source;
  }

  // Before anything else, handle EOFNL insertion/removal. If the patch tells us to make a change
  // to the EOFNL that is redundant/impossible - i.e. to remove a newline that's not there, or add a
  // newline that already exists - then we either return false and fail to apply the patch (if
  // fuzzFactor is 0) or simply ignore the problem and do nothing (if fuzzFactor is >0).
  // If we do need to remove/add a newline at EOF, this will always be in the final hunk:
  var prevLine = '',
    removeEOFNL = false,
    addEOFNL = false;
  for (var i = 0; i < hunks[hunks.length - 1].lines.length; i++) {
    var line = hunks[hunks.length - 1].lines[i];
    if (line[0] == '\\') {
      if (prevLine[0] == '+') {
        removeEOFNL = true;
      } else if (prevLine[0] == '-') {
        addEOFNL = true;
      }
    }
    prevLine = line;
  }
  if (removeEOFNL) {
    if (addEOFNL) {
      // This means the final line gets changed but doesn't have a trailing newline in either the
      // original or patched version. In that case, we do nothing if fuzzFactor > 0, and if
      // fuzzFactor is 0, we simply validate that the source file has no trailing newline.
      if (!fuzzFactor && lines[lines.length - 1] == '') {
        return false;
      }
    } else if (lines[lines.length - 1] == '') {
      lines.pop();
    } else if (!fuzzFactor) {
      return false;
    }
  } else if (addEOFNL) {
    if (lines[lines.length - 1] != '') {
      lines.push('');
    } else if (!fuzzFactor) {
      return false;
    }
  }

  /**
   * Checks if the hunk can be made to fit at the provided location with at most `maxErrors`
   * insertions, substitutions, or deletions, while ensuring also that:
   * - lines deleted in the hunk match exactly, and
   * - wherever an insertion operation or block of insertion operations appears in the hunk, the
   *   immediately preceding and following lines of context match exactly
   *
   * `toPos` should be set such that lines[toPos] is meant to match hunkLines[0].
   *
   * If the hunk can be applied, returns an object with properties `oldLineLastI` and
   * `replacementLines`. Otherwise, returns null.
   */
  function applyHunk(hunkLines, toPos, maxErrors) {
    /*istanbul ignore start*/
    var
    /*istanbul ignore end*/
    hunkLinesI = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    /*istanbul ignore start*/
    var
    /*istanbul ignore end*/
    lastContextLineMatched = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    /*istanbul ignore start*/
    var
    /*istanbul ignore end*/
    patchedLines = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
    /*istanbul ignore start*/
    var
    /*istanbul ignore end*/
    patchedLinesLength = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    var nConsecutiveOldContextLines = 0;
    var nextContextLineMustMatch = false;
    for (; hunkLinesI < hunkLines.length; hunkLinesI++) {
      var hunkLine = hunkLines[hunkLinesI],
        operation = hunkLine.length > 0 ? hunkLine[0] : ' ',
        content = hunkLine.length > 0 ? hunkLine.substr(1) : hunkLine;
      if (operation === '-') {
        if (compareLine(toPos + 1, lines[toPos], operation, content)) {
          toPos++;
          nConsecutiveOldContextLines = 0;
        } else {
          if (!maxErrors || lines[toPos] == null) {
            return null;
          }
          patchedLines[patchedLinesLength] = lines[toPos];
          return applyHunk(hunkLines, toPos + 1, maxErrors - 1, hunkLinesI, false, patchedLines, patchedLinesLength + 1);
        }
      }
      if (operation === '+') {
        if (!lastContextLineMatched) {
          return null;
        }
        patchedLines[patchedLinesLength] = content;
        patchedLinesLength++;
        nConsecutiveOldContextLines = 0;
        nextContextLineMustMatch = true;
      }
      if (operation === ' ') {
        nConsecutiveOldContextLines++;
        patchedLines[patchedLinesLength] = lines[toPos];
        if (compareLine(toPos + 1, lines[toPos], operation, content)) {
          patchedLinesLength++;
          lastContextLineMatched = true;
          nextContextLineMustMatch = false;
          toPos++;
        } else {
          if (nextContextLineMustMatch || !maxErrors) {
            return null;
          }

          // Consider 3 possibilities in sequence:
          // 1. lines contains a *substitution* not included in the patch context, or
          // 2. lines contains an *insertion* not included in the patch context, or
          // 3. lines contains a *deletion* not included in the patch context
          // The first two options are of course only possible if the line from lines is non-null -
          // i.e. only option 3 is possible if we've overrun the end of the old file.
          return lines[toPos] && (applyHunk(hunkLines, toPos + 1, maxErrors - 1, hunkLinesI + 1, false, patchedLines, patchedLinesLength + 1) || applyHunk(hunkLines, toPos + 1, maxErrors - 1, hunkLinesI, false, patchedLines, patchedLinesLength + 1)) || applyHunk(hunkLines, toPos, maxErrors - 1, hunkLinesI + 1, false, patchedLines, patchedLinesLength);
        }
      }
    }

    // Before returning, trim any unmodified context lines off the end of patchedLines and reduce
    // toPos (and thus oldLineLastI) accordingly. This allows later hunks to be applied to a region
    // that starts in this hunk's trailing context.
    patchedLinesLength -= nConsecutiveOldContextLines;
    toPos -= nConsecutiveOldContextLines;
    patchedLines.length = patchedLinesLength;
    return {
      patchedLines: patchedLines,
      oldLineLastI: toPos - 1
    };
  }
  var resultLines = [];

  // Search best fit offsets for each hunk based on the previous ones
  var prevHunkOffset = 0;
  for (var _i = 0; _i < hunks.length; _i++) {
    var hunk = hunks[_i];
    var hunkResult =
    /*istanbul ignore start*/
    void 0
    /*istanbul ignore end*/
    ;
    var maxLine = lines.length - hunk.oldLines + fuzzFactor;
    var toPos =
    /*istanbul ignore start*/
    void 0
    /*istanbul ignore end*/
    ;
    for (var maxErrors = 0; maxErrors <= fuzzFactor; maxErrors++) {
      toPos = hunk.oldStart + prevHunkOffset - 1;
      var iterator =
      /*istanbul ignore start*/
      (0,
      /*istanbul ignore end*/
      /*istanbul ignore start*/
      _distanceIterator
      /*istanbul ignore end*/
      [
      /*istanbul ignore start*/
      "default"
      /*istanbul ignore end*/
      ])(toPos, minLine, maxLine);
      for (; toPos !== undefined; toPos = iterator()) {
        hunkResult = applyHunk(hunk.lines, toPos, maxErrors);
        if (hunkResult) {
          break;
        }
      }
      if (hunkResult) {
        break;
      }
    }
    if (!hunkResult) {
      return false;
    }

    // Copy everything from the end of where we applied the last hunk to the start of this hunk
    for (var _i2 = minLine; _i2 < toPos; _i2++) {
      resultLines.push(lines[_i2]);
    }

    // Add the lines produced by applying the hunk:
    for (var _i3 = 0; _i3 < hunkResult.patchedLines.length; _i3++) {
      var _line = hunkResult.patchedLines[_i3];
      resultLines.push(_line);
    }

    // Set lower text limit to end of the current hunk, so next ones don't try
    // to fit over already patched text
    minLine = hunkResult.oldLineLastI + 1;

    // Note the offset between where the patch said the hunk should've applied and where we
    // applied it, so we can adjust future hunks accordingly:
    prevHunkOffset = toPos + 1 - hunk.oldStart;
  }

  // Copy over the rest of the lines from the old text
  for (var _i4 = minLine; _i4 < lines.length; _i4++) {
    resultLines.push(lines[_i4]);
  }
  return resultLines.join('\n');
}

// Wrapper that supports multiple file patches via callbacks.
function applyPatches(uniDiff, options) {
  if (typeof uniDiff === 'string') {
    uniDiff =
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _parse
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    parsePatch)
    /*istanbul ignore end*/
    (uniDiff);
  }
  var currentIndex = 0;
  function processIndex() {
    var index = uniDiff[currentIndex++];
    if (!index) {
      return options.complete();
    }
    options.loadFile(index, function (err, data) {
      if (err) {
        return options.complete(err);
      }
      var updatedContent = applyPatch(data, index, options);
      options.patched(index, updatedContent, function (err) {
        if (err) {
          return options.complete(err);
        }
        processIndex();
      });
    });
  }
  processIndex();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfc3RyaW5nIiwicmVxdWlyZSIsIl9saW5lRW5kaW5ncyIsIl9wYXJzZSIsIl9kaXN0YW5jZUl0ZXJhdG9yIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsImUiLCJfX2VzTW9kdWxlIiwiYXBwbHlQYXRjaCIsInNvdXJjZSIsInVuaURpZmYiLCJvcHRpb25zIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwicGFyc2VQYXRjaCIsIkFycmF5IiwiaXNBcnJheSIsIkVycm9yIiwiYXV0b0NvbnZlcnRMaW5lRW5kaW5ncyIsImhhc09ubHlXaW5MaW5lRW5kaW5ncyIsImlzVW5peCIsInVuaXhUb1dpbiIsImhhc09ubHlVbml4TGluZUVuZGluZ3MiLCJpc1dpbiIsIndpblRvVW5peCIsImxpbmVzIiwic3BsaXQiLCJodW5rcyIsImNvbXBhcmVMaW5lIiwibGluZU51bWJlciIsImxpbmUiLCJvcGVyYXRpb24iLCJwYXRjaENvbnRlbnQiLCJmdXp6RmFjdG9yIiwibWluTGluZSIsIk51bWJlciIsImlzSW50ZWdlciIsInByZXZMaW5lIiwicmVtb3ZlRU9GTkwiLCJhZGRFT0ZOTCIsImkiLCJwb3AiLCJwdXNoIiwiYXBwbHlIdW5rIiwiaHVua0xpbmVzIiwidG9Qb3MiLCJtYXhFcnJvcnMiLCJodW5rTGluZXNJIiwibGFzdENvbnRleHRMaW5lTWF0Y2hlZCIsInBhdGNoZWRMaW5lcyIsInBhdGNoZWRMaW5lc0xlbmd0aCIsIm5Db25zZWN1dGl2ZU9sZENvbnRleHRMaW5lcyIsIm5leHRDb250ZXh0TGluZU11c3RNYXRjaCIsImh1bmtMaW5lIiwiY29udGVudCIsInN1YnN0ciIsIm9sZExpbmVMYXN0SSIsInJlc3VsdExpbmVzIiwicHJldkh1bmtPZmZzZXQiLCJodW5rIiwiaHVua1Jlc3VsdCIsIm1heExpbmUiLCJvbGRMaW5lcyIsIm9sZFN0YXJ0IiwiaXRlcmF0b3IiLCJkaXN0YW5jZUl0ZXJhdG9yIiwiam9pbiIsImFwcGx5UGF0Y2hlcyIsImN1cnJlbnRJbmRleCIsInByb2Nlc3NJbmRleCIsImluZGV4IiwiY29tcGxldGUiLCJsb2FkRmlsZSIsImVyciIsImRhdGEiLCJ1cGRhdGVkQ29udGVudCIsInBhdGNoZWQiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvcGF0Y2gvYXBwbHkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtoYXNPbmx5V2luTGluZUVuZGluZ3MsIGhhc09ubHlVbml4TGluZUVuZGluZ3N9IGZyb20gJy4uL3V0aWwvc3RyaW5nJztcbmltcG9ydCB7aXNXaW4sIGlzVW5peCwgdW5peFRvV2luLCB3aW5Ub1VuaXh9IGZyb20gJy4vbGluZS1lbmRpbmdzJztcbmltcG9ydCB7cGFyc2VQYXRjaH0gZnJvbSAnLi9wYXJzZSc7XG5pbXBvcnQgZGlzdGFuY2VJdGVyYXRvciBmcm9tICcuLi91dGlsL2Rpc3RhbmNlLWl0ZXJhdG9yJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UGF0Y2goc291cmNlLCB1bmlEaWZmLCBvcHRpb25zID0ge30pIHtcbiAgaWYgKHR5cGVvZiB1bmlEaWZmID09PSAnc3RyaW5nJykge1xuICAgIHVuaURpZmYgPSBwYXJzZVBhdGNoKHVuaURpZmYpO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodW5pRGlmZikpIHtcbiAgICBpZiAodW5pRGlmZi5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FwcGx5UGF0Y2ggb25seSB3b3JrcyB3aXRoIGEgc2luZ2xlIGlucHV0LicpO1xuICAgIH1cblxuICAgIHVuaURpZmYgPSB1bmlEaWZmWzBdO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuYXV0b0NvbnZlcnRMaW5lRW5kaW5ncyB8fCBvcHRpb25zLmF1dG9Db252ZXJ0TGluZUVuZGluZ3MgPT0gbnVsbCkge1xuICAgIGlmIChoYXNPbmx5V2luTGluZUVuZGluZ3Moc291cmNlKSAmJiBpc1VuaXgodW5pRGlmZikpIHtcbiAgICAgIHVuaURpZmYgPSB1bml4VG9XaW4odW5pRGlmZik7XG4gICAgfSBlbHNlIGlmIChoYXNPbmx5VW5peExpbmVFbmRpbmdzKHNvdXJjZSkgJiYgaXNXaW4odW5pRGlmZikpIHtcbiAgICAgIHVuaURpZmYgPSB3aW5Ub1VuaXgodW5pRGlmZik7XG4gICAgfVxuICB9XG5cbiAgLy8gQXBwbHkgdGhlIGRpZmYgdG8gdGhlIGlucHV0XG4gIGxldCBsaW5lcyA9IHNvdXJjZS5zcGxpdCgnXFxuJyksXG4gICAgICBodW5rcyA9IHVuaURpZmYuaHVua3MsXG5cbiAgICAgIGNvbXBhcmVMaW5lID0gb3B0aW9ucy5jb21wYXJlTGluZSB8fCAoKGxpbmVOdW1iZXIsIGxpbmUsIG9wZXJhdGlvbiwgcGF0Y2hDb250ZW50KSA9PiBsaW5lID09PSBwYXRjaENvbnRlbnQpLFxuICAgICAgZnV6ekZhY3RvciA9IG9wdGlvbnMuZnV6ekZhY3RvciB8fCAwLFxuICAgICAgbWluTGluZSA9IDA7XG5cbiAgaWYgKGZ1enpGYWN0b3IgPCAwIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGZ1enpGYWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmdXp6RmFjdG9yIG11c3QgYmUgYSBub24tbmVnYXRpdmUgaW50ZWdlcicpO1xuICB9XG5cbiAgLy8gU3BlY2lhbCBjYXNlIGZvciBlbXB0eSBwYXRjaC5cbiAgaWYgKCFodW5rcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgLy8gQmVmb3JlIGFueXRoaW5nIGVsc2UsIGhhbmRsZSBFT0ZOTCBpbnNlcnRpb24vcmVtb3ZhbC4gSWYgdGhlIHBhdGNoIHRlbGxzIHVzIHRvIG1ha2UgYSBjaGFuZ2VcbiAgLy8gdG8gdGhlIEVPRk5MIHRoYXQgaXMgcmVkdW5kYW50L2ltcG9zc2libGUgLSBpLmUuIHRvIHJlbW92ZSBhIG5ld2xpbmUgdGhhdCdzIG5vdCB0aGVyZSwgb3IgYWRkIGFcbiAgLy8gbmV3bGluZSB0aGF0IGFscmVhZHkgZXhpc3RzIC0gdGhlbiB3ZSBlaXRoZXIgcmV0dXJuIGZhbHNlIGFuZCBmYWlsIHRvIGFwcGx5IHRoZSBwYXRjaCAoaWZcbiAgLy8gZnV6ekZhY3RvciBpcyAwKSBvciBzaW1wbHkgaWdub3JlIHRoZSBwcm9ibGVtIGFuZCBkbyBub3RoaW5nIChpZiBmdXp6RmFjdG9yIGlzID4wKS5cbiAgLy8gSWYgd2UgZG8gbmVlZCB0byByZW1vdmUvYWRkIGEgbmV3bGluZSBhdCBFT0YsIHRoaXMgd2lsbCBhbHdheXMgYmUgaW4gdGhlIGZpbmFsIGh1bms6XG4gIGxldCBwcmV2TGluZSA9ICcnLFxuICAgICAgcmVtb3ZlRU9GTkwgPSBmYWxzZSxcbiAgICAgIGFkZEVPRk5MID0gZmFsc2U7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaHVua3NbaHVua3MubGVuZ3RoIC0gMV0ubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBsaW5lID0gaHVua3NbaHVua3MubGVuZ3RoIC0gMV0ubGluZXNbaV07XG4gICAgaWYgKGxpbmVbMF0gPT0gJ1xcXFwnKSB7XG4gICAgICBpZiAocHJldkxpbmVbMF0gPT0gJysnKSB7XG4gICAgICAgIHJlbW92ZUVPRk5MID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAocHJldkxpbmVbMF0gPT0gJy0nKSB7XG4gICAgICAgIGFkZEVPRk5MID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcHJldkxpbmUgPSBsaW5lO1xuICB9XG4gIGlmIChyZW1vdmVFT0ZOTCkge1xuICAgIGlmIChhZGRFT0ZOTCkge1xuICAgICAgLy8gVGhpcyBtZWFucyB0aGUgZmluYWwgbGluZSBnZXRzIGNoYW5nZWQgYnV0IGRvZXNuJ3QgaGF2ZSBhIHRyYWlsaW5nIG5ld2xpbmUgaW4gZWl0aGVyIHRoZVxuICAgICAgLy8gb3JpZ2luYWwgb3IgcGF0Y2hlZCB2ZXJzaW9uLiBJbiB0aGF0IGNhc2UsIHdlIGRvIG5vdGhpbmcgaWYgZnV6ekZhY3RvciA+IDAsIGFuZCBpZlxuICAgICAgLy8gZnV6ekZhY3RvciBpcyAwLCB3ZSBzaW1wbHkgdmFsaWRhdGUgdGhhdCB0aGUgc291cmNlIGZpbGUgaGFzIG5vIHRyYWlsaW5nIG5ld2xpbmUuXG4gICAgICBpZiAoIWZ1enpGYWN0b3IgJiYgbGluZXNbbGluZXMubGVuZ3RoIC0gMV0gPT0gJycpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobGluZXNbbGluZXMubGVuZ3RoIC0gMV0gPT0gJycpIHtcbiAgICAgIGxpbmVzLnBvcCgpO1xuICAgIH0gZWxzZSBpZiAoIWZ1enpGYWN0b3IpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYWRkRU9GTkwpIHtcbiAgICBpZiAobGluZXNbbGluZXMubGVuZ3RoIC0gMV0gIT0gJycpIHtcbiAgICAgIGxpbmVzLnB1c2goJycpO1xuICAgIH0gZWxzZSBpZiAoIWZ1enpGYWN0b3IpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBodW5rIGNhbiBiZSBtYWRlIHRvIGZpdCBhdCB0aGUgcHJvdmlkZWQgbG9jYXRpb24gd2l0aCBhdCBtb3N0IGBtYXhFcnJvcnNgXG4gICAqIGluc2VydGlvbnMsIHN1YnN0aXR1dGlvbnMsIG9yIGRlbGV0aW9ucywgd2hpbGUgZW5zdXJpbmcgYWxzbyB0aGF0OlxuICAgKiAtIGxpbmVzIGRlbGV0ZWQgaW4gdGhlIGh1bmsgbWF0Y2ggZXhhY3RseSwgYW5kXG4gICAqIC0gd2hlcmV2ZXIgYW4gaW5zZXJ0aW9uIG9wZXJhdGlvbiBvciBibG9jayBvZiBpbnNlcnRpb24gb3BlcmF0aW9ucyBhcHBlYXJzIGluIHRoZSBodW5rLCB0aGVcbiAgICogICBpbW1lZGlhdGVseSBwcmVjZWRpbmcgYW5kIGZvbGxvd2luZyBsaW5lcyBvZiBjb250ZXh0IG1hdGNoIGV4YWN0bHlcbiAgICpcbiAgICogYHRvUG9zYCBzaG91bGQgYmUgc2V0IHN1Y2ggdGhhdCBsaW5lc1t0b1Bvc10gaXMgbWVhbnQgdG8gbWF0Y2ggaHVua0xpbmVzWzBdLlxuICAgKlxuICAgKiBJZiB0aGUgaHVuayBjYW4gYmUgYXBwbGllZCwgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGBvbGRMaW5lTGFzdElgIGFuZFxuICAgKiBgcmVwbGFjZW1lbnRMaW5lc2AuIE90aGVyd2lzZSwgcmV0dXJucyBudWxsLlxuICAgKi9cbiAgZnVuY3Rpb24gYXBwbHlIdW5rKFxuICAgIGh1bmtMaW5lcyxcbiAgICB0b1BvcyxcbiAgICBtYXhFcnJvcnMsXG4gICAgaHVua0xpbmVzSSA9IDAsXG4gICAgbGFzdENvbnRleHRMaW5lTWF0Y2hlZCA9IHRydWUsXG4gICAgcGF0Y2hlZExpbmVzID0gW10sXG4gICAgcGF0Y2hlZExpbmVzTGVuZ3RoID0gMCxcbiAgKSB7XG4gICAgbGV0IG5Db25zZWN1dGl2ZU9sZENvbnRleHRMaW5lcyA9IDA7XG4gICAgbGV0IG5leHRDb250ZXh0TGluZU11c3RNYXRjaCA9IGZhbHNlO1xuICAgIGZvciAoOyBodW5rTGluZXNJIDwgaHVua0xpbmVzLmxlbmd0aDsgaHVua0xpbmVzSSsrKSB7XG4gICAgICBsZXQgaHVua0xpbmUgPSBodW5rTGluZXNbaHVua0xpbmVzSV0sXG4gICAgICAgICAgb3BlcmF0aW9uID0gKGh1bmtMaW5lLmxlbmd0aCA+IDAgPyBodW5rTGluZVswXSA6ICcgJyksXG4gICAgICAgICAgY29udGVudCA9IChodW5rTGluZS5sZW5ndGggPiAwID8gaHVua0xpbmUuc3Vic3RyKDEpIDogaHVua0xpbmUpO1xuXG4gICAgICBpZiAob3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgaWYgKGNvbXBhcmVMaW5lKHRvUG9zICsgMSwgbGluZXNbdG9Qb3NdLCBvcGVyYXRpb24sIGNvbnRlbnQpKSB7XG4gICAgICAgICAgdG9Qb3MrKztcbiAgICAgICAgICBuQ29uc2VjdXRpdmVPbGRDb250ZXh0TGluZXMgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghbWF4RXJyb3JzIHx8IGxpbmVzW3RvUG9zXSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcGF0Y2hlZExpbmVzW3BhdGNoZWRMaW5lc0xlbmd0aF0gPSBsaW5lc1t0b1Bvc107XG4gICAgICAgICAgcmV0dXJuIGFwcGx5SHVuayhcbiAgICAgICAgICAgIGh1bmtMaW5lcyxcbiAgICAgICAgICAgIHRvUG9zICsgMSxcbiAgICAgICAgICAgIG1heEVycm9ycyAtIDEsXG4gICAgICAgICAgICBodW5rTGluZXNJLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBwYXRjaGVkTGluZXMsXG4gICAgICAgICAgICBwYXRjaGVkTGluZXNMZW5ndGggKyAxLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJysnKSB7XG4gICAgICAgIGlmICghbGFzdENvbnRleHRMaW5lTWF0Y2hlZCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHBhdGNoZWRMaW5lc1twYXRjaGVkTGluZXNMZW5ndGhdID0gY29udGVudDtcbiAgICAgICAgcGF0Y2hlZExpbmVzTGVuZ3RoKys7XG4gICAgICAgIG5Db25zZWN1dGl2ZU9sZENvbnRleHRMaW5lcyA9IDA7XG4gICAgICAgIG5leHRDb250ZXh0TGluZU11c3RNYXRjaCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcGVyYXRpb24gPT09ICcgJykge1xuICAgICAgICBuQ29uc2VjdXRpdmVPbGRDb250ZXh0TGluZXMrKztcbiAgICAgICAgcGF0Y2hlZExpbmVzW3BhdGNoZWRMaW5lc0xlbmd0aF0gPSBsaW5lc1t0b1Bvc107XG4gICAgICAgIGlmIChjb21wYXJlTGluZSh0b1BvcyArIDEsIGxpbmVzW3RvUG9zXSwgb3BlcmF0aW9uLCBjb250ZW50KSkge1xuICAgICAgICAgIHBhdGNoZWRMaW5lc0xlbmd0aCsrO1xuICAgICAgICAgIGxhc3RDb250ZXh0TGluZU1hdGNoZWQgPSB0cnVlO1xuICAgICAgICAgIG5leHRDb250ZXh0TGluZU11c3RNYXRjaCA9IGZhbHNlO1xuICAgICAgICAgIHRvUG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG5leHRDb250ZXh0TGluZU11c3RNYXRjaCB8fCAhbWF4RXJyb3JzKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDb25zaWRlciAzIHBvc3NpYmlsaXRpZXMgaW4gc2VxdWVuY2U6XG4gICAgICAgICAgLy8gMS4gbGluZXMgY29udGFpbnMgYSAqc3Vic3RpdHV0aW9uKiBub3QgaW5jbHVkZWQgaW4gdGhlIHBhdGNoIGNvbnRleHQsIG9yXG4gICAgICAgICAgLy8gMi4gbGluZXMgY29udGFpbnMgYW4gKmluc2VydGlvbiogbm90IGluY2x1ZGVkIGluIHRoZSBwYXRjaCBjb250ZXh0LCBvclxuICAgICAgICAgIC8vIDMuIGxpbmVzIGNvbnRhaW5zIGEgKmRlbGV0aW9uKiBub3QgaW5jbHVkZWQgaW4gdGhlIHBhdGNoIGNvbnRleHRcbiAgICAgICAgICAvLyBUaGUgZmlyc3QgdHdvIG9wdGlvbnMgYXJlIG9mIGNvdXJzZSBvbmx5IHBvc3NpYmxlIGlmIHRoZSBsaW5lIGZyb20gbGluZXMgaXMgbm9uLW51bGwgLVxuICAgICAgICAgIC8vIGkuZS4gb25seSBvcHRpb24gMyBpcyBwb3NzaWJsZSBpZiB3ZSd2ZSBvdmVycnVuIHRoZSBlbmQgb2YgdGhlIG9sZCBmaWxlLlxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBsaW5lc1t0b1Bvc10gJiYgKFxuICAgICAgICAgICAgICBhcHBseUh1bmsoXG4gICAgICAgICAgICAgICAgaHVua0xpbmVzLFxuICAgICAgICAgICAgICAgIHRvUG9zICsgMSxcbiAgICAgICAgICAgICAgICBtYXhFcnJvcnMgLSAxLFxuICAgICAgICAgICAgICAgIGh1bmtMaW5lc0kgKyAxLFxuICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgIHBhdGNoZWRMaW5lcyxcbiAgICAgICAgICAgICAgICBwYXRjaGVkTGluZXNMZW5ndGggKyAxXG4gICAgICAgICAgICAgICkgfHwgYXBwbHlIdW5rKFxuICAgICAgICAgICAgICAgIGh1bmtMaW5lcyxcbiAgICAgICAgICAgICAgICB0b1BvcyArIDEsXG4gICAgICAgICAgICAgICAgbWF4RXJyb3JzIC0gMSxcbiAgICAgICAgICAgICAgICBodW5rTGluZXNJLFxuICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgIHBhdGNoZWRMaW5lcyxcbiAgICAgICAgICAgICAgICBwYXRjaGVkTGluZXNMZW5ndGggKyAxXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkgfHwgYXBwbHlIdW5rKFxuICAgICAgICAgICAgICBodW5rTGluZXMsXG4gICAgICAgICAgICAgIHRvUG9zLFxuICAgICAgICAgICAgICBtYXhFcnJvcnMgLSAxLFxuICAgICAgICAgICAgICBodW5rTGluZXNJICsgMSxcbiAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgIHBhdGNoZWRMaW5lcyxcbiAgICAgICAgICAgICAgcGF0Y2hlZExpbmVzTGVuZ3RoXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJlZm9yZSByZXR1cm5pbmcsIHRyaW0gYW55IHVubW9kaWZpZWQgY29udGV4dCBsaW5lcyBvZmYgdGhlIGVuZCBvZiBwYXRjaGVkTGluZXMgYW5kIHJlZHVjZVxuICAgIC8vIHRvUG9zIChhbmQgdGh1cyBvbGRMaW5lTGFzdEkpIGFjY29yZGluZ2x5LiBUaGlzIGFsbG93cyBsYXRlciBodW5rcyB0byBiZSBhcHBsaWVkIHRvIGEgcmVnaW9uXG4gICAgLy8gdGhhdCBzdGFydHMgaW4gdGhpcyBodW5rJ3MgdHJhaWxpbmcgY29udGV4dC5cbiAgICBwYXRjaGVkTGluZXNMZW5ndGggLT0gbkNvbnNlY3V0aXZlT2xkQ29udGV4dExpbmVzO1xuICAgIHRvUG9zIC09IG5Db25zZWN1dGl2ZU9sZENvbnRleHRMaW5lcztcbiAgICBwYXRjaGVkTGluZXMubGVuZ3RoID0gcGF0Y2hlZExpbmVzTGVuZ3RoO1xuICAgIHJldHVybiB7XG4gICAgICBwYXRjaGVkTGluZXMsXG4gICAgICBvbGRMaW5lTGFzdEk6IHRvUG9zIC0gMVxuICAgIH07XG4gIH1cblxuICBjb25zdCByZXN1bHRMaW5lcyA9IFtdO1xuXG4gIC8vIFNlYXJjaCBiZXN0IGZpdCBvZmZzZXRzIGZvciBlYWNoIGh1bmsgYmFzZWQgb24gdGhlIHByZXZpb3VzIG9uZXNcbiAgbGV0IHByZXZIdW5rT2Zmc2V0ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBodW5rcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGh1bmsgPSBodW5rc1tpXTtcbiAgICBsZXQgaHVua1Jlc3VsdDtcbiAgICBsZXQgbWF4TGluZSA9IGxpbmVzLmxlbmd0aCAtIGh1bmsub2xkTGluZXMgKyBmdXp6RmFjdG9yO1xuICAgIGxldCB0b1BvcztcbiAgICBmb3IgKGxldCBtYXhFcnJvcnMgPSAwOyBtYXhFcnJvcnMgPD0gZnV6ekZhY3RvcjsgbWF4RXJyb3JzKyspIHtcbiAgICAgIHRvUG9zID0gaHVuay5vbGRTdGFydCArIHByZXZIdW5rT2Zmc2V0IC0gMTtcbiAgICAgIGxldCBpdGVyYXRvciA9IGRpc3RhbmNlSXRlcmF0b3IodG9Qb3MsIG1pbkxpbmUsIG1heExpbmUpO1xuICAgICAgZm9yICg7IHRvUG9zICE9PSB1bmRlZmluZWQ7IHRvUG9zID0gaXRlcmF0b3IoKSkge1xuICAgICAgICBodW5rUmVzdWx0ID0gYXBwbHlIdW5rKGh1bmsubGluZXMsIHRvUG9zLCBtYXhFcnJvcnMpO1xuICAgICAgICBpZiAoaHVua1Jlc3VsdCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaHVua1Jlc3VsdCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWh1bmtSZXN1bHQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBDb3B5IGV2ZXJ5dGhpbmcgZnJvbSB0aGUgZW5kIG9mIHdoZXJlIHdlIGFwcGxpZWQgdGhlIGxhc3QgaHVuayB0byB0aGUgc3RhcnQgb2YgdGhpcyBodW5rXG4gICAgZm9yIChsZXQgaSA9IG1pbkxpbmU7IGkgPCB0b1BvczsgaSsrKSB7XG4gICAgICByZXN1bHRMaW5lcy5wdXNoKGxpbmVzW2ldKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIGxpbmVzIHByb2R1Y2VkIGJ5IGFwcGx5aW5nIHRoZSBodW5rOlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaHVua1Jlc3VsdC5wYXRjaGVkTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGxpbmUgPSBodW5rUmVzdWx0LnBhdGNoZWRMaW5lc1tpXTtcbiAgICAgIHJlc3VsdExpbmVzLnB1c2gobGluZSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IGxvd2VyIHRleHQgbGltaXQgdG8gZW5kIG9mIHRoZSBjdXJyZW50IGh1bmssIHNvIG5leHQgb25lcyBkb24ndCB0cnlcbiAgICAvLyB0byBmaXQgb3ZlciBhbHJlYWR5IHBhdGNoZWQgdGV4dFxuICAgIG1pbkxpbmUgPSBodW5rUmVzdWx0Lm9sZExpbmVMYXN0SSArIDE7XG5cbiAgICAvLyBOb3RlIHRoZSBvZmZzZXQgYmV0d2VlbiB3aGVyZSB0aGUgcGF0Y2ggc2FpZCB0aGUgaHVuayBzaG91bGQndmUgYXBwbGllZCBhbmQgd2hlcmUgd2VcbiAgICAvLyBhcHBsaWVkIGl0LCBzbyB3ZSBjYW4gYWRqdXN0IGZ1dHVyZSBodW5rcyBhY2NvcmRpbmdseTpcbiAgICBwcmV2SHVua09mZnNldCA9IHRvUG9zICsgMSAtIGh1bmsub2xkU3RhcnQ7XG4gIH1cblxuICAvLyBDb3B5IG92ZXIgdGhlIHJlc3Qgb2YgdGhlIGxpbmVzIGZyb20gdGhlIG9sZCB0ZXh0XG4gIGZvciAobGV0IGkgPSBtaW5MaW5lOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICByZXN1bHRMaW5lcy5wdXNoKGxpbmVzW2ldKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHRMaW5lcy5qb2luKCdcXG4nKTtcbn1cblxuLy8gV3JhcHBlciB0aGF0IHN1cHBvcnRzIG11bHRpcGxlIGZpbGUgcGF0Y2hlcyB2aWEgY2FsbGJhY2tzLlxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UGF0Y2hlcyh1bmlEaWZmLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgdW5pRGlmZiA9PT0gJ3N0cmluZycpIHtcbiAgICB1bmlEaWZmID0gcGFyc2VQYXRjaCh1bmlEaWZmKTtcbiAgfVxuXG4gIGxldCBjdXJyZW50SW5kZXggPSAwO1xuICBmdW5jdGlvbiBwcm9jZXNzSW5kZXgoKSB7XG4gICAgbGV0IGluZGV4ID0gdW5pRGlmZltjdXJyZW50SW5kZXgrK107XG4gICAgaWYgKCFpbmRleCkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICBvcHRpb25zLmxvYWRGaWxlKGluZGV4LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuY29tcGxldGUoZXJyKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHVwZGF0ZWRDb250ZW50ID0gYXBwbHlQYXRjaChkYXRhLCBpbmRleCwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLnBhdGNoZWQoaW5kZXgsIHVwZGF0ZWRDb250ZW50LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBwcm9jZXNzSW5kZXgoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHByb2Nlc3NJbmRleCgpO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUFBLE9BQUEsR0FBQUMsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFDLFlBQUEsR0FBQUQsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFFLE1BQUEsR0FBQUYsT0FBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUFHLGlCQUFBLEdBQUFDLHNCQUFBLENBQUFKLE9BQUE7QUFBQTtBQUFBO0FBQXlELG1DQUFBSSx1QkFBQUMsQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLGdCQUFBQSxDQUFBO0FBQUE7QUFFbEQsU0FBU0UsVUFBVUEsQ0FBQ0MsTUFBTSxFQUFFQyxPQUFPLEVBQWdCO0VBQUE7RUFBQTtFQUFBO0VBQWRDLE9BQU8sR0FBQUMsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUcsQ0FBQyxDQUFDO0VBQ3RELElBQUksT0FBT0YsT0FBTyxLQUFLLFFBQVEsRUFBRTtJQUMvQkEsT0FBTztJQUFHO0lBQUE7SUFBQTtJQUFBSztJQUFBQTtJQUFBQTtJQUFBQTtJQUFBQTtJQUFBQSxVQUFVO0lBQUE7SUFBQSxDQUFDTCxPQUFPLENBQUM7RUFDL0I7RUFFQSxJQUFJTSxLQUFLLENBQUNDLE9BQU8sQ0FBQ1AsT0FBTyxDQUFDLEVBQUU7SUFDMUIsSUFBSUEsT0FBTyxDQUFDRyxNQUFNLEdBQUcsQ0FBQyxFQUFFO01BQ3RCLE1BQU0sSUFBSUssS0FBSyxDQUFDLDRDQUE0QyxDQUFDO0lBQy9EO0lBRUFSLE9BQU8sR0FBR0EsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUN0QjtFQUVBLElBQUlDLE9BQU8sQ0FBQ1Esc0JBQXNCLElBQUlSLE9BQU8sQ0FBQ1Esc0JBQXNCLElBQUksSUFBSSxFQUFFO0lBQzVFO0lBQUk7SUFBQTtJQUFBO0lBQUFDO0lBQUFBO0lBQUFBO0lBQUFBO0lBQUFBO0lBQUFBLHFCQUFxQjtJQUFBO0lBQUEsQ0FBQ1gsTUFBTSxDQUFDO0lBQUk7SUFBQTtJQUFBO0lBQUFZO0lBQUFBO0lBQUFBO0lBQUFBO0lBQUFBO0lBQUFBLE1BQU07SUFBQTtJQUFBLENBQUNYLE9BQU8sQ0FBQyxFQUFFO01BQ3BEQSxPQUFPO01BQUc7TUFBQTtNQUFBO01BQUFZO01BQUFBO01BQUFBO01BQUFBO01BQUFBO01BQUFBLFNBQVM7TUFBQTtNQUFBLENBQUNaLE9BQU8sQ0FBQztJQUM5QixDQUFDLE1BQU07SUFBSTtJQUFBO0lBQUE7SUFBQWE7SUFBQUE7SUFBQUE7SUFBQUE7SUFBQUE7SUFBQUEsc0JBQXNCO0lBQUE7SUFBQSxDQUFDZCxNQUFNLENBQUM7SUFBSTtJQUFBO0lBQUE7SUFBQWU7SUFBQUE7SUFBQUE7SUFBQUE7SUFBQUE7SUFBQUEsS0FBSztJQUFBO0lBQUEsQ0FBQ2QsT0FBTyxDQUFDLEVBQUU7TUFDM0RBLE9BQU87TUFBRztNQUFBO01BQUE7TUFBQWU7TUFBQUE7TUFBQUE7TUFBQUE7TUFBQUE7TUFBQUEsU0FBUztNQUFBO01BQUEsQ0FBQ2YsT0FBTyxDQUFDO0lBQzlCO0VBQ0Y7O0VBRUE7RUFDQSxJQUFJZ0IsS0FBSyxHQUFHakIsTUFBTSxDQUFDa0IsS0FBSyxDQUFDLElBQUksQ0FBQztJQUMxQkMsS0FBSyxHQUFHbEIsT0FBTyxDQUFDa0IsS0FBSztJQUVyQkMsV0FBVyxHQUFHbEIsT0FBTyxDQUFDa0IsV0FBVyxJQUFLLFVBQUNDLFVBQVUsRUFBRUMsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFlBQVk7SUFBQTtJQUFBO01BQUE7UUFBQTtRQUFLRixJQUFJLEtBQUtFO01BQVk7SUFBQSxDQUFDO0lBQzNHQyxVQUFVLEdBQUd2QixPQUFPLENBQUN1QixVQUFVLElBQUksQ0FBQztJQUNwQ0MsT0FBTyxHQUFHLENBQUM7RUFFZixJQUFJRCxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUNFLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDSCxVQUFVLENBQUMsRUFBRTtJQUNuRCxNQUFNLElBQUloQixLQUFLLENBQUMsMkNBQTJDLENBQUM7RUFDOUQ7O0VBRUE7RUFDQSxJQUFJLENBQUNVLEtBQUssQ0FBQ2YsTUFBTSxFQUFFO0lBQ2pCLE9BQU9KLE1BQU07RUFDZjs7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsSUFBSTZCLFFBQVEsR0FBRyxFQUFFO0lBQ2JDLFdBQVcsR0FBRyxLQUFLO0lBQ25CQyxRQUFRLEdBQUcsS0FBSztFQUNwQixLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR2IsS0FBSyxDQUFDQSxLQUFLLENBQUNmLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQ2EsS0FBSyxDQUFDYixNQUFNLEVBQUU0QixDQUFDLEVBQUUsRUFBRTtJQUM3RCxJQUFNVixJQUFJLEdBQUdILEtBQUssQ0FBQ0EsS0FBSyxDQUFDZixNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUNhLEtBQUssQ0FBQ2UsQ0FBQyxDQUFDO0lBQzdDLElBQUlWLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUU7TUFDbkIsSUFBSU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRTtRQUN0QkMsV0FBVyxHQUFHLElBQUk7TUFDcEIsQ0FBQyxNQUFNLElBQUlELFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7UUFDN0JFLFFBQVEsR0FBRyxJQUFJO01BQ2pCO0lBQ0Y7SUFDQUYsUUFBUSxHQUFHUCxJQUFJO0VBQ2pCO0VBQ0EsSUFBSVEsV0FBVyxFQUFFO0lBQ2YsSUFBSUMsUUFBUSxFQUFFO01BQ1o7TUFDQTtNQUNBO01BQ0EsSUFBSSxDQUFDTixVQUFVLElBQUlSLEtBQUssQ0FBQ0EsS0FBSyxDQUFDYixNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ2hELE9BQU8sS0FBSztNQUNkO0lBQ0YsQ0FBQyxNQUFNLElBQUlhLEtBQUssQ0FBQ0EsS0FBSyxDQUFDYixNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO01BQ3hDYSxLQUFLLENBQUNnQixHQUFHLENBQUMsQ0FBQztJQUNiLENBQUMsTUFBTSxJQUFJLENBQUNSLFVBQVUsRUFBRTtNQUN0QixPQUFPLEtBQUs7SUFDZDtFQUNGLENBQUMsTUFBTSxJQUFJTSxRQUFRLEVBQUU7SUFDbkIsSUFBSWQsS0FBSyxDQUFDQSxLQUFLLENBQUNiLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7TUFDakNhLEtBQUssQ0FBQ2lCLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDaEIsQ0FBQyxNQUFNLElBQUksQ0FBQ1QsVUFBVSxFQUFFO01BQ3RCLE9BQU8sS0FBSztJQUNkO0VBQ0Y7O0VBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0UsU0FBU1UsU0FBU0EsQ0FDaEJDLFNBQVMsRUFDVEMsS0FBSyxFQUNMQyxTQUFTLEVBS1Q7SUFBQTtJQUFBO0lBQUE7SUFKQUMsVUFBVSxHQUFBcEMsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUcsQ0FBQztJQUFBO0lBQUE7SUFBQTtJQUNkcUMsc0JBQXNCLEdBQUFyQyxTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBRyxJQUFJO0lBQUE7SUFBQTtJQUFBO0lBQzdCc0MsWUFBWSxHQUFBdEMsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUcsRUFBRTtJQUFBO0lBQUE7SUFBQTtJQUNqQnVDLGtCQUFrQixHQUFBdkMsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUcsQ0FBQztJQUV0QixJQUFJd0MsMkJBQTJCLEdBQUcsQ0FBQztJQUNuQyxJQUFJQyx3QkFBd0IsR0FBRyxLQUFLO0lBQ3BDLE9BQU9MLFVBQVUsR0FBR0gsU0FBUyxDQUFDaEMsTUFBTSxFQUFFbUMsVUFBVSxFQUFFLEVBQUU7TUFDbEQsSUFBSU0sUUFBUSxHQUFHVCxTQUFTLENBQUNHLFVBQVUsQ0FBQztRQUNoQ2hCLFNBQVMsR0FBSXNCLFFBQVEsQ0FBQ3pDLE1BQU0sR0FBRyxDQUFDLEdBQUd5QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBSTtRQUNyREMsT0FBTyxHQUFJRCxRQUFRLENBQUN6QyxNQUFNLEdBQUcsQ0FBQyxHQUFHeUMsUUFBUSxDQUFDRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUdGLFFBQVM7TUFFbkUsSUFBSXRCLFNBQVMsS0FBSyxHQUFHLEVBQUU7UUFDckIsSUFBSUgsV0FBVyxDQUFDaUIsS0FBSyxHQUFHLENBQUMsRUFBRXBCLEtBQUssQ0FBQ29CLEtBQUssQ0FBQyxFQUFFZCxTQUFTLEVBQUV1QixPQUFPLENBQUMsRUFBRTtVQUM1RFQsS0FBSyxFQUFFO1VBQ1BNLDJCQUEyQixHQUFHLENBQUM7UUFDakMsQ0FBQyxNQUFNO1VBQ0wsSUFBSSxDQUFDTCxTQUFTLElBQUlyQixLQUFLLENBQUNvQixLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDdEMsT0FBTyxJQUFJO1VBQ2I7VUFDQUksWUFBWSxDQUFDQyxrQkFBa0IsQ0FBQyxHQUFHekIsS0FBSyxDQUFDb0IsS0FBSyxDQUFDO1VBQy9DLE9BQU9GLFNBQVMsQ0FDZEMsU0FBUyxFQUNUQyxLQUFLLEdBQUcsQ0FBQyxFQUNUQyxTQUFTLEdBQUcsQ0FBQyxFQUNiQyxVQUFVLEVBQ1YsS0FBSyxFQUNMRSxZQUFZLEVBQ1pDLGtCQUFrQixHQUFHLENBQ3ZCLENBQUM7UUFDSDtNQUNGO01BRUEsSUFBSW5CLFNBQVMsS0FBSyxHQUFHLEVBQUU7UUFDckIsSUFBSSxDQUFDaUIsc0JBQXNCLEVBQUU7VUFDM0IsT0FBTyxJQUFJO1FBQ2I7UUFDQUMsWUFBWSxDQUFDQyxrQkFBa0IsQ0FBQyxHQUFHSSxPQUFPO1FBQzFDSixrQkFBa0IsRUFBRTtRQUNwQkMsMkJBQTJCLEdBQUcsQ0FBQztRQUMvQkMsd0JBQXdCLEdBQUcsSUFBSTtNQUNqQztNQUVBLElBQUlyQixTQUFTLEtBQUssR0FBRyxFQUFFO1FBQ3JCb0IsMkJBQTJCLEVBQUU7UUFDN0JGLFlBQVksQ0FBQ0Msa0JBQWtCLENBQUMsR0FBR3pCLEtBQUssQ0FBQ29CLEtBQUssQ0FBQztRQUMvQyxJQUFJakIsV0FBVyxDQUFDaUIsS0FBSyxHQUFHLENBQUMsRUFBRXBCLEtBQUssQ0FBQ29CLEtBQUssQ0FBQyxFQUFFZCxTQUFTLEVBQUV1QixPQUFPLENBQUMsRUFBRTtVQUM1REosa0JBQWtCLEVBQUU7VUFDcEJGLHNCQUFzQixHQUFHLElBQUk7VUFDN0JJLHdCQUF3QixHQUFHLEtBQUs7VUFDaENQLEtBQUssRUFBRTtRQUNULENBQUMsTUFBTTtVQUNMLElBQUlPLHdCQUF3QixJQUFJLENBQUNOLFNBQVMsRUFBRTtZQUMxQyxPQUFPLElBQUk7VUFDYjs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSxPQUNFckIsS0FBSyxDQUFDb0IsS0FBSyxDQUFDLEtBQ1ZGLFNBQVMsQ0FDUEMsU0FBUyxFQUNUQyxLQUFLLEdBQUcsQ0FBQyxFQUNUQyxTQUFTLEdBQUcsQ0FBQyxFQUNiQyxVQUFVLEdBQUcsQ0FBQyxFQUNkLEtBQUssRUFDTEUsWUFBWSxFQUNaQyxrQkFBa0IsR0FBRyxDQUN2QixDQUFDLElBQUlQLFNBQVMsQ0FDWkMsU0FBUyxFQUNUQyxLQUFLLEdBQUcsQ0FBQyxFQUNUQyxTQUFTLEdBQUcsQ0FBQyxFQUNiQyxVQUFVLEVBQ1YsS0FBSyxFQUNMRSxZQUFZLEVBQ1pDLGtCQUFrQixHQUFHLENBQ3ZCLENBQUMsQ0FDRixJQUFJUCxTQUFTLENBQ1pDLFNBQVMsRUFDVEMsS0FBSyxFQUNMQyxTQUFTLEdBQUcsQ0FBQyxFQUNiQyxVQUFVLEdBQUcsQ0FBQyxFQUNkLEtBQUssRUFDTEUsWUFBWSxFQUNaQyxrQkFDRixDQUFDO1FBRUw7TUFDRjtJQUNGOztJQUVBO0lBQ0E7SUFDQTtJQUNBQSxrQkFBa0IsSUFBSUMsMkJBQTJCO0lBQ2pETixLQUFLLElBQUlNLDJCQUEyQjtJQUNwQ0YsWUFBWSxDQUFDckMsTUFBTSxHQUFHc0Msa0JBQWtCO0lBQ3hDLE9BQU87TUFDTEQsWUFBWSxFQUFaQSxZQUFZO01BQ1pPLFlBQVksRUFBRVgsS0FBSyxHQUFHO0lBQ3hCLENBQUM7RUFDSDtFQUVBLElBQU1ZLFdBQVcsR0FBRyxFQUFFOztFQUV0QjtFQUNBLElBQUlDLGNBQWMsR0FBRyxDQUFDO0VBQ3RCLEtBQUssSUFBSWxCLEVBQUMsR0FBRyxDQUFDLEVBQUVBLEVBQUMsR0FBR2IsS0FBSyxDQUFDZixNQUFNLEVBQUU0QixFQUFDLEVBQUUsRUFBRTtJQUNyQyxJQUFNbUIsSUFBSSxHQUFHaEMsS0FBSyxDQUFDYSxFQUFDLENBQUM7SUFDckIsSUFBSW9CLFVBQVU7SUFBQTtJQUFBO0lBQUE7SUFBQTtJQUNkLElBQUlDLE9BQU8sR0FBR3BDLEtBQUssQ0FBQ2IsTUFBTSxHQUFHK0MsSUFBSSxDQUFDRyxRQUFRLEdBQUc3QixVQUFVO0lBQ3ZELElBQUlZLEtBQUs7SUFBQTtJQUFBO0lBQUE7SUFBQTtJQUNULEtBQUssSUFBSUMsU0FBUyxHQUFHLENBQUMsRUFBRUEsU0FBUyxJQUFJYixVQUFVLEVBQUVhLFNBQVMsRUFBRSxFQUFFO01BQzVERCxLQUFLLEdBQUdjLElBQUksQ0FBQ0ksUUFBUSxHQUFHTCxjQUFjLEdBQUcsQ0FBQztNQUMxQyxJQUFJTSxRQUFRO01BQUc7TUFBQTtNQUFBO01BQUFDO01BQUFBO01BQUFBO01BQUFBO01BQUFBO01BQUFBO01BQUFBO01BQUFBLENBQWdCLEVBQUNwQixLQUFLLEVBQUVYLE9BQU8sRUFBRTJCLE9BQU8sQ0FBQztNQUN4RCxPQUFPaEIsS0FBSyxLQUFLaEMsU0FBUyxFQUFFZ0MsS0FBSyxHQUFHbUIsUUFBUSxDQUFDLENBQUMsRUFBRTtRQUM5Q0osVUFBVSxHQUFHakIsU0FBUyxDQUFDZ0IsSUFBSSxDQUFDbEMsS0FBSyxFQUFFb0IsS0FBSyxFQUFFQyxTQUFTLENBQUM7UUFDcEQsSUFBSWMsVUFBVSxFQUFFO1VBQ2Q7UUFDRjtNQUNGO01BQ0EsSUFBSUEsVUFBVSxFQUFFO1FBQ2Q7TUFDRjtJQUNGO0lBRUEsSUFBSSxDQUFDQSxVQUFVLEVBQUU7TUFDZixPQUFPLEtBQUs7SUFDZDs7SUFFQTtJQUNBLEtBQUssSUFBSXBCLEdBQUMsR0FBR04sT0FBTyxFQUFFTSxHQUFDLEdBQUdLLEtBQUssRUFBRUwsR0FBQyxFQUFFLEVBQUU7TUFDcENpQixXQUFXLENBQUNmLElBQUksQ0FBQ2pCLEtBQUssQ0FBQ2UsR0FBQyxDQUFDLENBQUM7SUFDNUI7O0lBRUE7SUFDQSxLQUFLLElBQUlBLEdBQUMsR0FBRyxDQUFDLEVBQUVBLEdBQUMsR0FBR29CLFVBQVUsQ0FBQ1gsWUFBWSxDQUFDckMsTUFBTSxFQUFFNEIsR0FBQyxFQUFFLEVBQUU7TUFDdkQsSUFBTVYsS0FBSSxHQUFHOEIsVUFBVSxDQUFDWCxZQUFZLENBQUNULEdBQUMsQ0FBQztNQUN2Q2lCLFdBQVcsQ0FBQ2YsSUFBSSxDQUFDWixLQUFJLENBQUM7SUFDeEI7O0lBRUE7SUFDQTtJQUNBSSxPQUFPLEdBQUcwQixVQUFVLENBQUNKLFlBQVksR0FBRyxDQUFDOztJQUVyQztJQUNBO0lBQ0FFLGNBQWMsR0FBR2IsS0FBSyxHQUFHLENBQUMsR0FBR2MsSUFBSSxDQUFDSSxRQUFRO0VBQzVDOztFQUVBO0VBQ0EsS0FBSyxJQUFJdkIsR0FBQyxHQUFHTixPQUFPLEVBQUVNLEdBQUMsR0FBR2YsS0FBSyxDQUFDYixNQUFNLEVBQUU0QixHQUFDLEVBQUUsRUFBRTtJQUMzQ2lCLFdBQVcsQ0FBQ2YsSUFBSSxDQUFDakIsS0FBSyxDQUFDZSxHQUFDLENBQUMsQ0FBQztFQUM1QjtFQUVBLE9BQU9pQixXQUFXLENBQUNTLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDL0I7O0FBRUE7QUFDTyxTQUFTQyxZQUFZQSxDQUFDMUQsT0FBTyxFQUFFQyxPQUFPLEVBQUU7RUFDN0MsSUFBSSxPQUFPRCxPQUFPLEtBQUssUUFBUSxFQUFFO0lBQy9CQSxPQUFPO0lBQUc7SUFBQTtJQUFBO0lBQUFLO0lBQUFBO0lBQUFBO0lBQUFBO0lBQUFBO0lBQUFBLFVBQVU7SUFBQTtJQUFBLENBQUNMLE9BQU8sQ0FBQztFQUMvQjtFQUVBLElBQUkyRCxZQUFZLEdBQUcsQ0FBQztFQUNwQixTQUFTQyxZQUFZQSxDQUFBLEVBQUc7SUFDdEIsSUFBSUMsS0FBSyxHQUFHN0QsT0FBTyxDQUFDMkQsWUFBWSxFQUFFLENBQUM7SUFDbkMsSUFBSSxDQUFDRSxLQUFLLEVBQUU7TUFDVixPQUFPNUQsT0FBTyxDQUFDNkQsUUFBUSxDQUFDLENBQUM7SUFDM0I7SUFFQTdELE9BQU8sQ0FBQzhELFFBQVEsQ0FBQ0YsS0FBSyxFQUFFLFVBQVNHLEdBQUcsRUFBRUMsSUFBSSxFQUFFO01BQzFDLElBQUlELEdBQUcsRUFBRTtRQUNQLE9BQU8vRCxPQUFPLENBQUM2RCxRQUFRLENBQUNFLEdBQUcsQ0FBQztNQUM5QjtNQUVBLElBQUlFLGNBQWMsR0FBR3BFLFVBQVUsQ0FBQ21FLElBQUksRUFBRUosS0FBSyxFQUFFNUQsT0FBTyxDQUFDO01BQ3JEQSxPQUFPLENBQUNrRSxPQUFPLENBQUNOLEtBQUssRUFBRUssY0FBYyxFQUFFLFVBQVNGLEdBQUcsRUFBRTtRQUNuRCxJQUFJQSxHQUFHLEVBQUU7VUFDUCxPQUFPL0QsT0FBTyxDQUFDNkQsUUFBUSxDQUFDRSxHQUFHLENBQUM7UUFDOUI7UUFFQUosWUFBWSxDQUFDLENBQUM7TUFDaEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0VBQ0o7RUFDQUEsWUFBWSxDQUFDLENBQUM7QUFDaEIiLCJpZ25vcmVMaXN0IjpbXX0=