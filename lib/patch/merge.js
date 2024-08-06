/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcLineCount = calcLineCount;
exports.merge = merge;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_create = require("./create")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_parse = require("./parse")
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_array = require("../util/array")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/*istanbul ignore end*/
function calcLineCount(hunk) {
  var
    /*istanbul ignore start*/
    _calcOldNewLineCount =
    /*istanbul ignore end*/
    calcOldNewLineCount(hunk.lines),
    /*istanbul ignore start*/
    /*istanbul ignore end*/
    oldLines = _calcOldNewLineCount.oldLines,
    /*istanbul ignore start*/
    /*istanbul ignore end*/
    newLines = _calcOldNewLineCount.newLines;
  if (oldLines !== undefined) {
    hunk.oldLines = oldLines;
  } else {
    delete hunk.oldLines;
  }
  if (newLines !== undefined) {
    hunk.newLines = newLines;
  } else {
    delete hunk.newLines;
  }
}
function merge(mine, theirs, base) {
  mine = loadPatch(mine, base);
  theirs = loadPatch(theirs, base);
  var ret = {};

  // For index we just let it pass through as it doesn't have any necessary meaning.
  // Leaving sanity checks on this to the API consumer that may know more about the
  // meaning in their own context.
  if (mine.index || theirs.index) {
    ret.index = mine.index || theirs.index;
  }
  if (mine.newFileName || theirs.newFileName) {
    if (!fileNameChanged(mine)) {
      // No header or no change in ours, use theirs (and ours if theirs does not exist)
      ret.oldFileName = theirs.oldFileName || mine.oldFileName;
      ret.newFileName = theirs.newFileName || mine.newFileName;
      ret.oldHeader = theirs.oldHeader || mine.oldHeader;
      ret.newHeader = theirs.newHeader || mine.newHeader;
    } else if (!fileNameChanged(theirs)) {
      // No header or no change in theirs, use ours
      ret.oldFileName = mine.oldFileName;
      ret.newFileName = mine.newFileName;
      ret.oldHeader = mine.oldHeader;
      ret.newHeader = mine.newHeader;
    } else {
      // Both changed... figure it out
      ret.oldFileName = selectField(ret, mine.oldFileName, theirs.oldFileName);
      ret.newFileName = selectField(ret, mine.newFileName, theirs.newFileName);
      ret.oldHeader = selectField(ret, mine.oldHeader, theirs.oldHeader);
      ret.newHeader = selectField(ret, mine.newHeader, theirs.newHeader);
    }
  }
  ret.hunks = [];
  var mineIndex = 0,
    theirsIndex = 0,
    mineOffset = 0,
    theirsOffset = 0;
  while (mineIndex < mine.hunks.length || theirsIndex < theirs.hunks.length) {
    var mineCurrent = mine.hunks[mineIndex] || {
        oldStart: Infinity
      },
      theirsCurrent = theirs.hunks[theirsIndex] || {
        oldStart: Infinity
      };
    if (hunkBefore(mineCurrent, theirsCurrent)) {
      // This patch does not overlap with any of the others, yay.
      ret.hunks.push(cloneHunk(mineCurrent, mineOffset));
      mineIndex++;
      theirsOffset += mineCurrent.newLines - mineCurrent.oldLines;
    } else if (hunkBefore(theirsCurrent, mineCurrent)) {
      // This patch does not overlap with any of the others, yay.
      ret.hunks.push(cloneHunk(theirsCurrent, theirsOffset));
      theirsIndex++;
      mineOffset += theirsCurrent.newLines - theirsCurrent.oldLines;
    } else {
      // Overlap, merge as best we can
      var mergedHunk = {
        oldStart: Math.min(mineCurrent.oldStart, theirsCurrent.oldStart),
        oldLines: 0,
        newStart: Math.min(mineCurrent.newStart + mineOffset, theirsCurrent.oldStart + theirsOffset),
        newLines: 0,
        lines: []
      };
      mergeLines(mergedHunk, mineCurrent.oldStart, mineCurrent.lines, theirsCurrent.oldStart, theirsCurrent.lines);
      theirsIndex++;
      mineIndex++;
      ret.hunks.push(mergedHunk);
    }
  }
  return ret;
}
function loadPatch(param, base) {
  if (typeof param === 'string') {
    if (/^@@/m.test(param) || /^Index:/m.test(param)) {
      return (
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
        (param)[0]
      );
    }
    if (!base) {
      throw new Error('Must provide a base reference or pass in a patch');
    }
    return (
      /*istanbul ignore start*/
      (0,
      /*istanbul ignore end*/
      /*istanbul ignore start*/
      _create
      /*istanbul ignore end*/
      .
      /*istanbul ignore start*/
      structuredPatch)
      /*istanbul ignore end*/
      (undefined, undefined, base, param)
    );
  }
  return param;
}
function fileNameChanged(patch) {
  return patch.newFileName && patch.newFileName !== patch.oldFileName;
}
function selectField(index, mine, theirs) {
  if (mine === theirs) {
    return mine;
  } else {
    index.conflict = true;
    return {
      mine: mine,
      theirs: theirs
    };
  }
}
function hunkBefore(test, check) {
  return test.oldStart < check.oldStart && test.oldStart + test.oldLines < check.oldStart;
}
function cloneHunk(hunk, offset) {
  return {
    oldStart: hunk.oldStart,
    oldLines: hunk.oldLines,
    newStart: hunk.newStart + offset,
    newLines: hunk.newLines,
    lines: hunk.lines
  };
}
function mergeLines(hunk, mineOffset, mineLines, theirOffset, theirLines) {
  // This will generally result in a conflicted hunk, but there are cases where the context
  // is the only overlap where we can successfully merge the content here.
  var mine = {
      offset: mineOffset,
      lines: mineLines,
      index: 0
    },
    their = {
      offset: theirOffset,
      lines: theirLines,
      index: 0
    };

  // Handle any leading content
  insertLeading(hunk, mine, their);
  insertLeading(hunk, their, mine);

  // Now in the overlap content. Scan through and select the best changes from each.
  while (mine.index < mine.lines.length && their.index < their.lines.length) {
    var mineCurrent = mine.lines[mine.index],
      theirCurrent = their.lines[their.index];
    if ((mineCurrent[0] === '-' || mineCurrent[0] === '+') && (theirCurrent[0] === '-' || theirCurrent[0] === '+')) {
      // Both modified ...
      mutualChange(hunk, mine, their);
    } else if (mineCurrent[0] === '+' && theirCurrent[0] === ' ') {
      /*istanbul ignore start*/
      var _hunk$lines;
      /*istanbul ignore end*/
      // Mine inserted
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      /*istanbul ignore start*/
      (_hunk$lines =
      /*istanbul ignore end*/
      hunk.lines).push.apply(
      /*istanbul ignore start*/
      _hunk$lines
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      collectChange(mine)));
    } else if (theirCurrent[0] === '+' && mineCurrent[0] === ' ') {
      /*istanbul ignore start*/
      var _hunk$lines2;
      /*istanbul ignore end*/
      // Theirs inserted
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      /*istanbul ignore start*/
      (_hunk$lines2 =
      /*istanbul ignore end*/
      hunk.lines).push.apply(
      /*istanbul ignore start*/
      _hunk$lines2
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      collectChange(their)));
    } else if (mineCurrent[0] === '-' && theirCurrent[0] === ' ') {
      // Mine removed or edited
      removal(hunk, mine, their);
    } else if (theirCurrent[0] === '-' && mineCurrent[0] === ' ') {
      // Their removed or edited
      removal(hunk, their, mine, true);
    } else if (mineCurrent === theirCurrent) {
      // Context identity
      hunk.lines.push(mineCurrent);
      mine.index++;
      their.index++;
    } else {
      // Context mismatch
      conflict(hunk, collectChange(mine), collectChange(their));
    }
  }

  // Now push anything that may be remaining
  insertTrailing(hunk, mine);
  insertTrailing(hunk, their);
  calcLineCount(hunk);
}
function mutualChange(hunk, mine, their) {
  var myChanges = collectChange(mine),
    theirChanges = collectChange(their);
  if (allRemoves(myChanges) && allRemoves(theirChanges)) {
    // Special case for remove changes that are supersets of one another
    if (
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _array
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    arrayStartsWith)
    /*istanbul ignore end*/
    (myChanges, theirChanges) && skipRemoveSuperset(their, myChanges, myChanges.length - theirChanges.length)) {
      /*istanbul ignore start*/
      var _hunk$lines3;
      /*istanbul ignore end*/
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      /*istanbul ignore start*/
      (_hunk$lines3 =
      /*istanbul ignore end*/
      hunk.lines).push.apply(
      /*istanbul ignore start*/
      _hunk$lines3
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      myChanges));
      return;
    } else if (
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    _array
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    arrayStartsWith)
    /*istanbul ignore end*/
    (theirChanges, myChanges) && skipRemoveSuperset(mine, theirChanges, theirChanges.length - myChanges.length)) {
      /*istanbul ignore start*/
      var _hunk$lines4;
      /*istanbul ignore end*/
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      /*istanbul ignore start*/
      (_hunk$lines4 =
      /*istanbul ignore end*/
      hunk.lines).push.apply(
      /*istanbul ignore start*/
      _hunk$lines4
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      theirChanges));
      return;
    }
  } else if (
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/
  /*istanbul ignore start*/
  _array
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  arrayEqual)
  /*istanbul ignore end*/
  (myChanges, theirChanges)) {
    /*istanbul ignore start*/
    var _hunk$lines5;
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    (_hunk$lines5 =
    /*istanbul ignore end*/
    hunk.lines).push.apply(
    /*istanbul ignore start*/
    _hunk$lines5
    /*istanbul ignore end*/
    ,
    /*istanbul ignore start*/
    _toConsumableArray(
    /*istanbul ignore end*/
    myChanges));
    return;
  }
  conflict(hunk, myChanges, theirChanges);
}
function removal(hunk, mine, their, swap) {
  var myChanges = collectChange(mine),
    theirChanges = collectContext(their, myChanges);
  if (theirChanges.merged) {
    /*istanbul ignore start*/
    var _hunk$lines6;
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    /*istanbul ignore end*/
    /*istanbul ignore start*/
    (_hunk$lines6 =
    /*istanbul ignore end*/
    hunk.lines).push.apply(
    /*istanbul ignore start*/
    _hunk$lines6
    /*istanbul ignore end*/
    ,
    /*istanbul ignore start*/
    _toConsumableArray(
    /*istanbul ignore end*/
    theirChanges.merged));
  } else {
    conflict(hunk, swap ? theirChanges : myChanges, swap ? myChanges : theirChanges);
  }
}
function conflict(hunk, mine, their) {
  hunk.conflict = true;
  hunk.lines.push({
    conflict: true,
    mine: mine,
    theirs: their
  });
}
function insertLeading(hunk, insert, their) {
  while (insert.offset < their.offset && insert.index < insert.lines.length) {
    var line = insert.lines[insert.index++];
    hunk.lines.push(line);
    insert.offset++;
  }
}
function insertTrailing(hunk, insert) {
  while (insert.index < insert.lines.length) {
    var line = insert.lines[insert.index++];
    hunk.lines.push(line);
  }
}
function collectChange(state) {
  var ret = [],
    operation = state.lines[state.index][0];
  while (state.index < state.lines.length) {
    var line = state.lines[state.index];

    // Group additions that are immediately after subtractions and treat them as one "atomic" modify change.
    if (operation === '-' && line[0] === '+') {
      operation = '+';
    }
    if (operation === line[0]) {
      ret.push(line);
      state.index++;
    } else {
      break;
    }
  }
  return ret;
}
function collectContext(state, matchChanges) {
  var changes = [],
    merged = [],
    matchIndex = 0,
    contextChanges = false,
    conflicted = false;
  while (matchIndex < matchChanges.length && state.index < state.lines.length) {
    var change = state.lines[state.index],
      match = matchChanges[matchIndex];

    // Once we've hit our add, then we are done
    if (match[0] === '+') {
      break;
    }
    contextChanges = contextChanges || change[0] !== ' ';
    merged.push(match);
    matchIndex++;

    // Consume any additions in the other block as a conflict to attempt
    // to pull in the remaining context after this
    if (change[0] === '+') {
      conflicted = true;
      while (change[0] === '+') {
        changes.push(change);
        change = state.lines[++state.index];
      }
    }
    if (match.substr(1) === change.substr(1)) {
      changes.push(change);
      state.index++;
    } else {
      conflicted = true;
    }
  }
  if ((matchChanges[matchIndex] || '')[0] === '+' && contextChanges) {
    conflicted = true;
  }
  if (conflicted) {
    return changes;
  }
  while (matchIndex < matchChanges.length) {
    merged.push(matchChanges[matchIndex++]);
  }
  return {
    merged: merged,
    changes: changes
  };
}
function allRemoves(changes) {
  return changes.reduce(function (prev, change) {
    return prev && change[0] === '-';
  }, true);
}
function skipRemoveSuperset(state, removeChanges, delta) {
  for (var i = 0; i < delta; i++) {
    var changeContent = removeChanges[removeChanges.length - delta + i].substr(1);
    if (state.lines[state.index + i] !== ' ' + changeContent) {
      return false;
    }
  }
  state.index += delta;
  return true;
}
function calcOldNewLineCount(lines) {
  var oldLines = 0;
  var newLines = 0;
  lines.forEach(function (line) {
    if (typeof line !== 'string') {
      var myCount = calcOldNewLineCount(line.mine);
      var theirCount = calcOldNewLineCount(line.theirs);
      if (oldLines !== undefined) {
        if (myCount.oldLines === theirCount.oldLines) {
          oldLines += myCount.oldLines;
        } else {
          oldLines = undefined;
        }
      }
      if (newLines !== undefined) {
        if (myCount.newLines === theirCount.newLines) {
          newLines += myCount.newLines;
        } else {
          newLines = undefined;
        }
      }
    } else {
      if (newLines !== undefined && (line[0] === '+' || line[0] === ' ')) {
        newLines++;
      }
      if (oldLines !== undefined && (line[0] === '-' || line[0] === ' ')) {
        oldLines++;
      }
    }
  });
  return {
    oldLines: oldLines,
    newLines: newLines
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY3JlYXRlIiwicmVxdWlyZSIsIl9wYXJzZSIsIl9hcnJheSIsIl90b0NvbnN1bWFibGVBcnJheSIsInIiLCJfYXJyYXlXaXRob3V0SG9sZXMiLCJfaXRlcmFibGVUb0FycmF5IiwiX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5IiwiX25vbkl0ZXJhYmxlU3ByZWFkIiwiVHlwZUVycm9yIiwiYSIsIl9hcnJheUxpa2VUb0FycmF5IiwidCIsInRvU3RyaW5nIiwiY2FsbCIsInNsaWNlIiwiY29uc3RydWN0b3IiLCJuYW1lIiwiQXJyYXkiLCJmcm9tIiwidGVzdCIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiaXNBcnJheSIsImxlbmd0aCIsImUiLCJuIiwiY2FsY0xpbmVDb3VudCIsImh1bmsiLCJfY2FsY09sZE5ld0xpbmVDb3VudCIsImNhbGNPbGROZXdMaW5lQ291bnQiLCJsaW5lcyIsIm9sZExpbmVzIiwibmV3TGluZXMiLCJ1bmRlZmluZWQiLCJtZXJnZSIsIm1pbmUiLCJ0aGVpcnMiLCJiYXNlIiwibG9hZFBhdGNoIiwicmV0IiwiaW5kZXgiLCJuZXdGaWxlTmFtZSIsImZpbGVOYW1lQ2hhbmdlZCIsIm9sZEZpbGVOYW1lIiwib2xkSGVhZGVyIiwibmV3SGVhZGVyIiwic2VsZWN0RmllbGQiLCJodW5rcyIsIm1pbmVJbmRleCIsInRoZWlyc0luZGV4IiwibWluZU9mZnNldCIsInRoZWlyc09mZnNldCIsIm1pbmVDdXJyZW50Iiwib2xkU3RhcnQiLCJJbmZpbml0eSIsInRoZWlyc0N1cnJlbnQiLCJodW5rQmVmb3JlIiwicHVzaCIsImNsb25lSHVuayIsIm1lcmdlZEh1bmsiLCJNYXRoIiwibWluIiwibmV3U3RhcnQiLCJtZXJnZUxpbmVzIiwicGFyYW0iLCJwYXJzZVBhdGNoIiwiRXJyb3IiLCJzdHJ1Y3R1cmVkUGF0Y2giLCJwYXRjaCIsImNvbmZsaWN0IiwiY2hlY2siLCJvZmZzZXQiLCJtaW5lTGluZXMiLCJ0aGVpck9mZnNldCIsInRoZWlyTGluZXMiLCJ0aGVpciIsImluc2VydExlYWRpbmciLCJ0aGVpckN1cnJlbnQiLCJtdXR1YWxDaGFuZ2UiLCJfaHVuayRsaW5lcyIsImFwcGx5IiwiY29sbGVjdENoYW5nZSIsIl9odW5rJGxpbmVzMiIsInJlbW92YWwiLCJpbnNlcnRUcmFpbGluZyIsIm15Q2hhbmdlcyIsInRoZWlyQ2hhbmdlcyIsImFsbFJlbW92ZXMiLCJhcnJheVN0YXJ0c1dpdGgiLCJza2lwUmVtb3ZlU3VwZXJzZXQiLCJfaHVuayRsaW5lczMiLCJfaHVuayRsaW5lczQiLCJhcnJheUVxdWFsIiwiX2h1bmskbGluZXM1Iiwic3dhcCIsImNvbGxlY3RDb250ZXh0IiwibWVyZ2VkIiwiX2h1bmskbGluZXM2IiwiaW5zZXJ0IiwibGluZSIsInN0YXRlIiwib3BlcmF0aW9uIiwibWF0Y2hDaGFuZ2VzIiwiY2hhbmdlcyIsIm1hdGNoSW5kZXgiLCJjb250ZXh0Q2hhbmdlcyIsImNvbmZsaWN0ZWQiLCJjaGFuZ2UiLCJtYXRjaCIsInN1YnN0ciIsInJlZHVjZSIsInByZXYiLCJyZW1vdmVDaGFuZ2VzIiwiZGVsdGEiLCJpIiwiY2hhbmdlQ29udGVudCIsImZvckVhY2giLCJteUNvdW50IiwidGhlaXJDb3VudCJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXRjaC9tZXJnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3N0cnVjdHVyZWRQYXRjaH0gZnJvbSAnLi9jcmVhdGUnO1xuaW1wb3J0IHtwYXJzZVBhdGNofSBmcm9tICcuL3BhcnNlJztcblxuaW1wb3J0IHthcnJheUVxdWFsLCBhcnJheVN0YXJ0c1dpdGh9IGZyb20gJy4uL3V0aWwvYXJyYXknO1xuXG5leHBvcnQgZnVuY3Rpb24gY2FsY0xpbmVDb3VudChodW5rKSB7XG4gIGNvbnN0IHtvbGRMaW5lcywgbmV3TGluZXN9ID0gY2FsY09sZE5ld0xpbmVDb3VudChodW5rLmxpbmVzKTtcblxuICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGh1bmsub2xkTGluZXMgPSBvbGRMaW5lcztcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgaHVuay5vbGRMaW5lcztcbiAgfVxuXG4gIGlmIChuZXdMaW5lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaHVuay5uZXdMaW5lcyA9IG5ld0xpbmVzO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBodW5rLm5ld0xpbmVzO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZShtaW5lLCB0aGVpcnMsIGJhc2UpIHtcbiAgbWluZSA9IGxvYWRQYXRjaChtaW5lLCBiYXNlKTtcbiAgdGhlaXJzID0gbG9hZFBhdGNoKHRoZWlycywgYmFzZSk7XG5cbiAgbGV0IHJldCA9IHt9O1xuXG4gIC8vIEZvciBpbmRleCB3ZSBqdXN0IGxldCBpdCBwYXNzIHRocm91Z2ggYXMgaXQgZG9lc24ndCBoYXZlIGFueSBuZWNlc3NhcnkgbWVhbmluZy5cbiAgLy8gTGVhdmluZyBzYW5pdHkgY2hlY2tzIG9uIHRoaXMgdG8gdGhlIEFQSSBjb25zdW1lciB0aGF0IG1heSBrbm93IG1vcmUgYWJvdXQgdGhlXG4gIC8vIG1lYW5pbmcgaW4gdGhlaXIgb3duIGNvbnRleHQuXG4gIGlmIChtaW5lLmluZGV4IHx8IHRoZWlycy5pbmRleCkge1xuICAgIHJldC5pbmRleCA9IG1pbmUuaW5kZXggfHwgdGhlaXJzLmluZGV4O1xuICB9XG5cbiAgaWYgKG1pbmUubmV3RmlsZU5hbWUgfHwgdGhlaXJzLm5ld0ZpbGVOYW1lKSB7XG4gICAgaWYgKCFmaWxlTmFtZUNoYW5nZWQobWluZSkpIHtcbiAgICAgIC8vIE5vIGhlYWRlciBvciBubyBjaGFuZ2UgaW4gb3VycywgdXNlIHRoZWlycyAoYW5kIG91cnMgaWYgdGhlaXJzIGRvZXMgbm90IGV4aXN0KVxuICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gdGhlaXJzLm9sZEZpbGVOYW1lIHx8IG1pbmUub2xkRmlsZU5hbWU7XG4gICAgICByZXQubmV3RmlsZU5hbWUgPSB0aGVpcnMubmV3RmlsZU5hbWUgfHwgbWluZS5uZXdGaWxlTmFtZTtcbiAgICAgIHJldC5vbGRIZWFkZXIgPSB0aGVpcnMub2xkSGVhZGVyIHx8IG1pbmUub2xkSGVhZGVyO1xuICAgICAgcmV0Lm5ld0hlYWRlciA9IHRoZWlycy5uZXdIZWFkZXIgfHwgbWluZS5uZXdIZWFkZXI7XG4gICAgfSBlbHNlIGlmICghZmlsZU5hbWVDaGFuZ2VkKHRoZWlycykpIHtcbiAgICAgIC8vIE5vIGhlYWRlciBvciBubyBjaGFuZ2UgaW4gdGhlaXJzLCB1c2Ugb3Vyc1xuICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gbWluZS5vbGRGaWxlTmFtZTtcbiAgICAgIHJldC5uZXdGaWxlTmFtZSA9IG1pbmUubmV3RmlsZU5hbWU7XG4gICAgICByZXQub2xkSGVhZGVyID0gbWluZS5vbGRIZWFkZXI7XG4gICAgICByZXQubmV3SGVhZGVyID0gbWluZS5uZXdIZWFkZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJvdGggY2hhbmdlZC4uLiBmaWd1cmUgaXQgb3V0XG4gICAgICByZXQub2xkRmlsZU5hbWUgPSBzZWxlY3RGaWVsZChyZXQsIG1pbmUub2xkRmlsZU5hbWUsIHRoZWlycy5vbGRGaWxlTmFtZSk7XG4gICAgICByZXQubmV3RmlsZU5hbWUgPSBzZWxlY3RGaWVsZChyZXQsIG1pbmUubmV3RmlsZU5hbWUsIHRoZWlycy5uZXdGaWxlTmFtZSk7XG4gICAgICByZXQub2xkSGVhZGVyID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm9sZEhlYWRlciwgdGhlaXJzLm9sZEhlYWRlcik7XG4gICAgICByZXQubmV3SGVhZGVyID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm5ld0hlYWRlciwgdGhlaXJzLm5ld0hlYWRlcik7XG4gICAgfVxuICB9XG5cbiAgcmV0Lmh1bmtzID0gW107XG5cbiAgbGV0IG1pbmVJbmRleCA9IDAsXG4gICAgICB0aGVpcnNJbmRleCA9IDAsXG4gICAgICBtaW5lT2Zmc2V0ID0gMCxcbiAgICAgIHRoZWlyc09mZnNldCA9IDA7XG5cbiAgd2hpbGUgKG1pbmVJbmRleCA8IG1pbmUuaHVua3MubGVuZ3RoIHx8IHRoZWlyc0luZGV4IDwgdGhlaXJzLmh1bmtzLmxlbmd0aCkge1xuICAgIGxldCBtaW5lQ3VycmVudCA9IG1pbmUuaHVua3NbbWluZUluZGV4XSB8fCB7b2xkU3RhcnQ6IEluZmluaXR5fSxcbiAgICAgICAgdGhlaXJzQ3VycmVudCA9IHRoZWlycy5odW5rc1t0aGVpcnNJbmRleF0gfHwge29sZFN0YXJ0OiBJbmZpbml0eX07XG5cbiAgICBpZiAoaHVua0JlZm9yZShtaW5lQ3VycmVudCwgdGhlaXJzQ3VycmVudCkpIHtcbiAgICAgIC8vIFRoaXMgcGF0Y2ggZG9lcyBub3Qgb3ZlcmxhcCB3aXRoIGFueSBvZiB0aGUgb3RoZXJzLCB5YXkuXG4gICAgICByZXQuaHVua3MucHVzaChjbG9uZUh1bmsobWluZUN1cnJlbnQsIG1pbmVPZmZzZXQpKTtcbiAgICAgIG1pbmVJbmRleCsrO1xuICAgICAgdGhlaXJzT2Zmc2V0ICs9IG1pbmVDdXJyZW50Lm5ld0xpbmVzIC0gbWluZUN1cnJlbnQub2xkTGluZXM7XG4gICAgfSBlbHNlIGlmIChodW5rQmVmb3JlKHRoZWlyc0N1cnJlbnQsIG1pbmVDdXJyZW50KSkge1xuICAgICAgLy8gVGhpcyBwYXRjaCBkb2VzIG5vdCBvdmVybGFwIHdpdGggYW55IG9mIHRoZSBvdGhlcnMsIHlheS5cbiAgICAgIHJldC5odW5rcy5wdXNoKGNsb25lSHVuayh0aGVpcnNDdXJyZW50LCB0aGVpcnNPZmZzZXQpKTtcbiAgICAgIHRoZWlyc0luZGV4Kys7XG4gICAgICBtaW5lT2Zmc2V0ICs9IHRoZWlyc0N1cnJlbnQubmV3TGluZXMgLSB0aGVpcnNDdXJyZW50Lm9sZExpbmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdmVybGFwLCBtZXJnZSBhcyBiZXN0IHdlIGNhblxuICAgICAgbGV0IG1lcmdlZEh1bmsgPSB7XG4gICAgICAgIG9sZFN0YXJ0OiBNYXRoLm1pbihtaW5lQ3VycmVudC5vbGRTdGFydCwgdGhlaXJzQ3VycmVudC5vbGRTdGFydCksXG4gICAgICAgIG9sZExpbmVzOiAwLFxuICAgICAgICBuZXdTdGFydDogTWF0aC5taW4obWluZUN1cnJlbnQubmV3U3RhcnQgKyBtaW5lT2Zmc2V0LCB0aGVpcnNDdXJyZW50Lm9sZFN0YXJ0ICsgdGhlaXJzT2Zmc2V0KSxcbiAgICAgICAgbmV3TGluZXM6IDAsXG4gICAgICAgIGxpbmVzOiBbXVxuICAgICAgfTtcbiAgICAgIG1lcmdlTGluZXMobWVyZ2VkSHVuaywgbWluZUN1cnJlbnQub2xkU3RhcnQsIG1pbmVDdXJyZW50LmxpbmVzLCB0aGVpcnNDdXJyZW50Lm9sZFN0YXJ0LCB0aGVpcnNDdXJyZW50LmxpbmVzKTtcbiAgICAgIHRoZWlyc0luZGV4Kys7XG4gICAgICBtaW5lSW5kZXgrKztcblxuICAgICAgcmV0Lmh1bmtzLnB1c2gobWVyZ2VkSHVuayk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gbG9hZFBhdGNoKHBhcmFtLCBiYXNlKSB7XG4gIGlmICh0eXBlb2YgcGFyYW0gPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKCgvXkBAL20pLnRlc3QocGFyYW0pIHx8ICgoL15JbmRleDovbSkudGVzdChwYXJhbSkpKSB7XG4gICAgICByZXR1cm4gcGFyc2VQYXRjaChwYXJhbSlbMF07XG4gICAgfVxuXG4gICAgaWYgKCFiYXNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3QgcHJvdmlkZSBhIGJhc2UgcmVmZXJlbmNlIG9yIHBhc3MgaW4gYSBwYXRjaCcpO1xuICAgIH1cbiAgICByZXR1cm4gc3RydWN0dXJlZFBhdGNoKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBiYXNlLCBwYXJhbSk7XG4gIH1cblxuICByZXR1cm4gcGFyYW07XG59XG5cbmZ1bmN0aW9uIGZpbGVOYW1lQ2hhbmdlZChwYXRjaCkge1xuICByZXR1cm4gcGF0Y2gubmV3RmlsZU5hbWUgJiYgcGF0Y2gubmV3RmlsZU5hbWUgIT09IHBhdGNoLm9sZEZpbGVOYW1lO1xufVxuXG5mdW5jdGlvbiBzZWxlY3RGaWVsZChpbmRleCwgbWluZSwgdGhlaXJzKSB7XG4gIGlmIChtaW5lID09PSB0aGVpcnMpIHtcbiAgICByZXR1cm4gbWluZTtcbiAgfSBlbHNlIHtcbiAgICBpbmRleC5jb25mbGljdCA9IHRydWU7XG4gICAgcmV0dXJuIHttaW5lLCB0aGVpcnN9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGh1bmtCZWZvcmUodGVzdCwgY2hlY2spIHtcbiAgcmV0dXJuIHRlc3Qub2xkU3RhcnQgPCBjaGVjay5vbGRTdGFydFxuICAgICYmICh0ZXN0Lm9sZFN0YXJ0ICsgdGVzdC5vbGRMaW5lcykgPCBjaGVjay5vbGRTdGFydDtcbn1cblxuZnVuY3Rpb24gY2xvbmVIdW5rKGh1bmssIG9mZnNldCkge1xuICByZXR1cm4ge1xuICAgIG9sZFN0YXJ0OiBodW5rLm9sZFN0YXJ0LCBvbGRMaW5lczogaHVuay5vbGRMaW5lcyxcbiAgICBuZXdTdGFydDogaHVuay5uZXdTdGFydCArIG9mZnNldCwgbmV3TGluZXM6IGh1bmsubmV3TGluZXMsXG4gICAgbGluZXM6IGh1bmsubGluZXNcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VMaW5lcyhodW5rLCBtaW5lT2Zmc2V0LCBtaW5lTGluZXMsIHRoZWlyT2Zmc2V0LCB0aGVpckxpbmVzKSB7XG4gIC8vIFRoaXMgd2lsbCBnZW5lcmFsbHkgcmVzdWx0IGluIGEgY29uZmxpY3RlZCBodW5rLCBidXQgdGhlcmUgYXJlIGNhc2VzIHdoZXJlIHRoZSBjb250ZXh0XG4gIC8vIGlzIHRoZSBvbmx5IG92ZXJsYXAgd2hlcmUgd2UgY2FuIHN1Y2Nlc3NmdWxseSBtZXJnZSB0aGUgY29udGVudCBoZXJlLlxuICBsZXQgbWluZSA9IHtvZmZzZXQ6IG1pbmVPZmZzZXQsIGxpbmVzOiBtaW5lTGluZXMsIGluZGV4OiAwfSxcbiAgICAgIHRoZWlyID0ge29mZnNldDogdGhlaXJPZmZzZXQsIGxpbmVzOiB0aGVpckxpbmVzLCBpbmRleDogMH07XG5cbiAgLy8gSGFuZGxlIGFueSBsZWFkaW5nIGNvbnRlbnRcbiAgaW5zZXJ0TGVhZGluZyhodW5rLCBtaW5lLCB0aGVpcik7XG4gIGluc2VydExlYWRpbmcoaHVuaywgdGhlaXIsIG1pbmUpO1xuXG4gIC8vIE5vdyBpbiB0aGUgb3ZlcmxhcCBjb250ZW50LiBTY2FuIHRocm91Z2ggYW5kIHNlbGVjdCB0aGUgYmVzdCBjaGFuZ2VzIGZyb20gZWFjaC5cbiAgd2hpbGUgKG1pbmUuaW5kZXggPCBtaW5lLmxpbmVzLmxlbmd0aCAmJiB0aGVpci5pbmRleCA8IHRoZWlyLmxpbmVzLmxlbmd0aCkge1xuICAgIGxldCBtaW5lQ3VycmVudCA9IG1pbmUubGluZXNbbWluZS5pbmRleF0sXG4gICAgICAgIHRoZWlyQ3VycmVudCA9IHRoZWlyLmxpbmVzW3RoZWlyLmluZGV4XTtcblxuICAgIGlmICgobWluZUN1cnJlbnRbMF0gPT09ICctJyB8fCBtaW5lQ3VycmVudFswXSA9PT0gJysnKVxuICAgICAgICAmJiAodGhlaXJDdXJyZW50WzBdID09PSAnLScgfHwgdGhlaXJDdXJyZW50WzBdID09PSAnKycpKSB7XG4gICAgICAvLyBCb3RoIG1vZGlmaWVkIC4uLlxuICAgICAgbXV0dWFsQ2hhbmdlKGh1bmssIG1pbmUsIHRoZWlyKTtcbiAgICB9IGVsc2UgaWYgKG1pbmVDdXJyZW50WzBdID09PSAnKycgJiYgdGhlaXJDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgIC8vIE1pbmUgaW5zZXJ0ZWRcbiAgICAgIGh1bmsubGluZXMucHVzaCguLi4gY29sbGVjdENoYW5nZShtaW5lKSk7XG4gICAgfSBlbHNlIGlmICh0aGVpckN1cnJlbnRbMF0gPT09ICcrJyAmJiBtaW5lQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICAvLyBUaGVpcnMgaW5zZXJ0ZWRcbiAgICAgIGh1bmsubGluZXMucHVzaCguLi4gY29sbGVjdENoYW5nZSh0aGVpcikpO1xuICAgIH0gZWxzZSBpZiAobWluZUN1cnJlbnRbMF0gPT09ICctJyAmJiB0aGVpckN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgLy8gTWluZSByZW1vdmVkIG9yIGVkaXRlZFxuICAgICAgcmVtb3ZhbChodW5rLCBtaW5lLCB0aGVpcik7XG4gICAgfSBlbHNlIGlmICh0aGVpckN1cnJlbnRbMF0gPT09ICctJyAmJiBtaW5lQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICAvLyBUaGVpciByZW1vdmVkIG9yIGVkaXRlZFxuICAgICAgcmVtb3ZhbChodW5rLCB0aGVpciwgbWluZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChtaW5lQ3VycmVudCA9PT0gdGhlaXJDdXJyZW50KSB7XG4gICAgICAvLyBDb250ZXh0IGlkZW50aXR5XG4gICAgICBodW5rLmxpbmVzLnB1c2gobWluZUN1cnJlbnQpO1xuICAgICAgbWluZS5pbmRleCsrO1xuICAgICAgdGhlaXIuaW5kZXgrKztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ29udGV4dCBtaXNtYXRjaFxuICAgICAgY29uZmxpY3QoaHVuaywgY29sbGVjdENoYW5nZShtaW5lKSwgY29sbGVjdENoYW5nZSh0aGVpcikpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5vdyBwdXNoIGFueXRoaW5nIHRoYXQgbWF5IGJlIHJlbWFpbmluZ1xuICBpbnNlcnRUcmFpbGluZyhodW5rLCBtaW5lKTtcbiAgaW5zZXJ0VHJhaWxpbmcoaHVuaywgdGhlaXIpO1xuXG4gIGNhbGNMaW5lQ291bnQoaHVuayk7XG59XG5cbmZ1bmN0aW9uIG11dHVhbENoYW5nZShodW5rLCBtaW5lLCB0aGVpcikge1xuICBsZXQgbXlDaGFuZ2VzID0gY29sbGVjdENoYW5nZShtaW5lKSxcbiAgICAgIHRoZWlyQ2hhbmdlcyA9IGNvbGxlY3RDaGFuZ2UodGhlaXIpO1xuXG4gIGlmIChhbGxSZW1vdmVzKG15Q2hhbmdlcykgJiYgYWxsUmVtb3Zlcyh0aGVpckNoYW5nZXMpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlIGZvciByZW1vdmUgY2hhbmdlcyB0aGF0IGFyZSBzdXBlcnNldHMgb2Ygb25lIGFub3RoZXJcbiAgICBpZiAoYXJyYXlTdGFydHNXaXRoKG15Q2hhbmdlcywgdGhlaXJDaGFuZ2VzKVxuICAgICAgICAmJiBza2lwUmVtb3ZlU3VwZXJzZXQodGhlaXIsIG15Q2hhbmdlcywgbXlDaGFuZ2VzLmxlbmd0aCAtIHRoZWlyQ2hhbmdlcy5sZW5ndGgpKSB7XG4gICAgICBodW5rLmxpbmVzLnB1c2goLi4uIG15Q2hhbmdlcyk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChhcnJheVN0YXJ0c1dpdGgodGhlaXJDaGFuZ2VzLCBteUNoYW5nZXMpXG4gICAgICAgICYmIHNraXBSZW1vdmVTdXBlcnNldChtaW5lLCB0aGVpckNoYW5nZXMsIHRoZWlyQ2hhbmdlcy5sZW5ndGggLSBteUNoYW5nZXMubGVuZ3RoKSkge1xuICAgICAgaHVuay5saW5lcy5wdXNoKC4uLiB0aGVpckNoYW5nZXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBlbHNlIGlmIChhcnJheUVxdWFsKG15Q2hhbmdlcywgdGhlaXJDaGFuZ2VzKSkge1xuICAgIGh1bmsubGluZXMucHVzaCguLi4gbXlDaGFuZ2VzKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25mbGljdChodW5rLCBteUNoYW5nZXMsIHRoZWlyQ2hhbmdlcyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92YWwoaHVuaywgbWluZSwgdGhlaXIsIHN3YXApIHtcbiAgbGV0IG15Q2hhbmdlcyA9IGNvbGxlY3RDaGFuZ2UobWluZSksXG4gICAgICB0aGVpckNoYW5nZXMgPSBjb2xsZWN0Q29udGV4dCh0aGVpciwgbXlDaGFuZ2VzKTtcbiAgaWYgKHRoZWlyQ2hhbmdlcy5tZXJnZWQpIHtcbiAgICBodW5rLmxpbmVzLnB1c2goLi4uIHRoZWlyQ2hhbmdlcy5tZXJnZWQpO1xuICB9IGVsc2Uge1xuICAgIGNvbmZsaWN0KGh1bmssIHN3YXAgPyB0aGVpckNoYW5nZXMgOiBteUNoYW5nZXMsIHN3YXAgPyBteUNoYW5nZXMgOiB0aGVpckNoYW5nZXMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbmZsaWN0KGh1bmssIG1pbmUsIHRoZWlyKSB7XG4gIGh1bmsuY29uZmxpY3QgPSB0cnVlO1xuICBodW5rLmxpbmVzLnB1c2goe1xuICAgIGNvbmZsaWN0OiB0cnVlLFxuICAgIG1pbmU6IG1pbmUsXG4gICAgdGhlaXJzOiB0aGVpclxuICB9KTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0TGVhZGluZyhodW5rLCBpbnNlcnQsIHRoZWlyKSB7XG4gIHdoaWxlIChpbnNlcnQub2Zmc2V0IDwgdGhlaXIub2Zmc2V0ICYmIGluc2VydC5pbmRleCA8IGluc2VydC5saW5lcy5sZW5ndGgpIHtcbiAgICBsZXQgbGluZSA9IGluc2VydC5saW5lc1tpbnNlcnQuaW5kZXgrK107XG4gICAgaHVuay5saW5lcy5wdXNoKGxpbmUpO1xuICAgIGluc2VydC5vZmZzZXQrKztcbiAgfVxufVxuZnVuY3Rpb24gaW5zZXJ0VHJhaWxpbmcoaHVuaywgaW5zZXJ0KSB7XG4gIHdoaWxlIChpbnNlcnQuaW5kZXggPCBpbnNlcnQubGluZXMubGVuZ3RoKSB7XG4gICAgbGV0IGxpbmUgPSBpbnNlcnQubGluZXNbaW5zZXJ0LmluZGV4KytdO1xuICAgIGh1bmsubGluZXMucHVzaChsaW5lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb2xsZWN0Q2hhbmdlKHN0YXRlKSB7XG4gIGxldCByZXQgPSBbXSxcbiAgICAgIG9wZXJhdGlvbiA9IHN0YXRlLmxpbmVzW3N0YXRlLmluZGV4XVswXTtcbiAgd2hpbGUgKHN0YXRlLmluZGV4IDwgc3RhdGUubGluZXMubGVuZ3RoKSB7XG4gICAgbGV0IGxpbmUgPSBzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleF07XG5cbiAgICAvLyBHcm91cCBhZGRpdGlvbnMgdGhhdCBhcmUgaW1tZWRpYXRlbHkgYWZ0ZXIgc3VidHJhY3Rpb25zIGFuZCB0cmVhdCB0aGVtIGFzIG9uZSBcImF0b21pY1wiIG1vZGlmeSBjaGFuZ2UuXG4gICAgaWYgKG9wZXJhdGlvbiA9PT0gJy0nICYmIGxpbmVbMF0gPT09ICcrJykge1xuICAgICAgb3BlcmF0aW9uID0gJysnO1xuICAgIH1cblxuICAgIGlmIChvcGVyYXRpb24gPT09IGxpbmVbMF0pIHtcbiAgICAgIHJldC5wdXNoKGxpbmUpO1xuICAgICAgc3RhdGUuaW5kZXgrKztcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cbmZ1bmN0aW9uIGNvbGxlY3RDb250ZXh0KHN0YXRlLCBtYXRjaENoYW5nZXMpIHtcbiAgbGV0IGNoYW5nZXMgPSBbXSxcbiAgICAgIG1lcmdlZCA9IFtdLFxuICAgICAgbWF0Y2hJbmRleCA9IDAsXG4gICAgICBjb250ZXh0Q2hhbmdlcyA9IGZhbHNlLFxuICAgICAgY29uZmxpY3RlZCA9IGZhbHNlO1xuICB3aGlsZSAobWF0Y2hJbmRleCA8IG1hdGNoQ2hhbmdlcy5sZW5ndGhcbiAgICAgICAgJiYgc3RhdGUuaW5kZXggPCBzdGF0ZS5saW5lcy5sZW5ndGgpIHtcbiAgICBsZXQgY2hhbmdlID0gc3RhdGUubGluZXNbc3RhdGUuaW5kZXhdLFxuICAgICAgICBtYXRjaCA9IG1hdGNoQ2hhbmdlc1ttYXRjaEluZGV4XTtcblxuICAgIC8vIE9uY2Ugd2UndmUgaGl0IG91ciBhZGQsIHRoZW4gd2UgYXJlIGRvbmVcbiAgICBpZiAobWF0Y2hbMF0gPT09ICcrJykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29udGV4dENoYW5nZXMgPSBjb250ZXh0Q2hhbmdlcyB8fCBjaGFuZ2VbMF0gIT09ICcgJztcblxuICAgIG1lcmdlZC5wdXNoKG1hdGNoKTtcbiAgICBtYXRjaEluZGV4Kys7XG5cbiAgICAvLyBDb25zdW1lIGFueSBhZGRpdGlvbnMgaW4gdGhlIG90aGVyIGJsb2NrIGFzIGEgY29uZmxpY3QgdG8gYXR0ZW1wdFxuICAgIC8vIHRvIHB1bGwgaW4gdGhlIHJlbWFpbmluZyBjb250ZXh0IGFmdGVyIHRoaXNcbiAgICBpZiAoY2hhbmdlWzBdID09PSAnKycpIHtcbiAgICAgIGNvbmZsaWN0ZWQgPSB0cnVlO1xuXG4gICAgICB3aGlsZSAoY2hhbmdlWzBdID09PSAnKycpIHtcbiAgICAgICAgY2hhbmdlcy5wdXNoKGNoYW5nZSk7XG4gICAgICAgIGNoYW5nZSA9IHN0YXRlLmxpbmVzWysrc3RhdGUuaW5kZXhdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtYXRjaC5zdWJzdHIoMSkgPT09IGNoYW5nZS5zdWJzdHIoMSkpIHtcbiAgICAgIGNoYW5nZXMucHVzaChjaGFuZ2UpO1xuICAgICAgc3RhdGUuaW5kZXgrKztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmxpY3RlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKChtYXRjaENoYW5nZXNbbWF0Y2hJbmRleF0gfHwgJycpWzBdID09PSAnKydcbiAgICAgICYmIGNvbnRleHRDaGFuZ2VzKSB7XG4gICAgY29uZmxpY3RlZCA9IHRydWU7XG4gIH1cblxuICBpZiAoY29uZmxpY3RlZCkge1xuICAgIHJldHVybiBjaGFuZ2VzO1xuICB9XG5cbiAgd2hpbGUgKG1hdGNoSW5kZXggPCBtYXRjaENoYW5nZXMubGVuZ3RoKSB7XG4gICAgbWVyZ2VkLnB1c2gobWF0Y2hDaGFuZ2VzW21hdGNoSW5kZXgrK10pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtZXJnZWQsXG4gICAgY2hhbmdlc1xuICB9O1xufVxuXG5mdW5jdGlvbiBhbGxSZW1vdmVzKGNoYW5nZXMpIHtcbiAgcmV0dXJuIGNoYW5nZXMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGNoYW5nZSkge1xuICAgIHJldHVybiBwcmV2ICYmIGNoYW5nZVswXSA9PT0gJy0nO1xuICB9LCB0cnVlKTtcbn1cbmZ1bmN0aW9uIHNraXBSZW1vdmVTdXBlcnNldChzdGF0ZSwgcmVtb3ZlQ2hhbmdlcywgZGVsdGEpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWx0YTsgaSsrKSB7XG4gICAgbGV0IGNoYW5nZUNvbnRlbnQgPSByZW1vdmVDaGFuZ2VzW3JlbW92ZUNoYW5nZXMubGVuZ3RoIC0gZGVsdGEgKyBpXS5zdWJzdHIoMSk7XG4gICAgaWYgKHN0YXRlLmxpbmVzW3N0YXRlLmluZGV4ICsgaV0gIT09ICcgJyArIGNoYW5nZUNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBzdGF0ZS5pbmRleCArPSBkZWx0YTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNhbGNPbGROZXdMaW5lQ291bnQobGluZXMpIHtcbiAgbGV0IG9sZExpbmVzID0gMDtcbiAgbGV0IG5ld0xpbmVzID0gMDtcblxuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICBpZiAodHlwZW9mIGxpbmUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgbXlDb3VudCA9IGNhbGNPbGROZXdMaW5lQ291bnQobGluZS5taW5lKTtcbiAgICAgIGxldCB0aGVpckNvdW50ID0gY2FsY09sZE5ld0xpbmVDb3VudChsaW5lLnRoZWlycyk7XG5cbiAgICAgIGlmIChvbGRMaW5lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChteUNvdW50Lm9sZExpbmVzID09PSB0aGVpckNvdW50Lm9sZExpbmVzKSB7XG4gICAgICAgICAgb2xkTGluZXMgKz0gbXlDb3VudC5vbGRMaW5lcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvbGRMaW5lcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobmV3TGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAobXlDb3VudC5uZXdMaW5lcyA9PT0gdGhlaXJDb3VudC5uZXdMaW5lcykge1xuICAgICAgICAgIG5ld0xpbmVzICs9IG15Q291bnQubmV3TGluZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3TGluZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG5ld0xpbmVzICE9PSB1bmRlZmluZWQgJiYgKGxpbmVbMF0gPT09ICcrJyB8fCBsaW5lWzBdID09PSAnICcpKSB7XG4gICAgICAgIG5ld0xpbmVzKys7XG4gICAgICB9XG4gICAgICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCAmJiAobGluZVswXSA9PT0gJy0nIHx8IGxpbmVbMF0gPT09ICcgJykpIHtcbiAgICAgICAgb2xkTGluZXMrKztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7b2xkTGluZXMsIG5ld0xpbmVzfTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBQSxPQUFBLEdBQUFDLE9BQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBQyxNQUFBLEdBQUFELE9BQUE7QUFBQTtBQUFBO0FBRUE7QUFBQTtBQUFBRSxNQUFBLEdBQUFGLE9BQUE7QUFBQTtBQUFBO0FBQTBELG1DQUFBRyxtQkFBQUMsQ0FBQSxXQUFBQyxrQkFBQSxDQUFBRCxDQUFBLEtBQUFFLGdCQUFBLENBQUFGLENBQUEsS0FBQUcsMkJBQUEsQ0FBQUgsQ0FBQSxLQUFBSSxrQkFBQTtBQUFBLFNBQUFBLG1CQUFBLGNBQUFDLFNBQUE7QUFBQSxTQUFBRiw0QkFBQUgsQ0FBQSxFQUFBTSxDQUFBLFFBQUFOLENBQUEsMkJBQUFBLENBQUEsU0FBQU8saUJBQUEsQ0FBQVAsQ0FBQSxFQUFBTSxDQUFBLE9BQUFFLENBQUEsTUFBQUMsUUFBQSxDQUFBQyxJQUFBLENBQUFWLENBQUEsRUFBQVcsS0FBQSw2QkFBQUgsQ0FBQSxJQUFBUixDQUFBLENBQUFZLFdBQUEsS0FBQUosQ0FBQSxHQUFBUixDQUFBLENBQUFZLFdBQUEsQ0FBQUMsSUFBQSxhQUFBTCxDQUFBLGNBQUFBLENBQUEsR0FBQU0sS0FBQSxDQUFBQyxJQUFBLENBQUFmLENBQUEsb0JBQUFRLENBQUEsK0NBQUFRLElBQUEsQ0FBQVIsQ0FBQSxJQUFBRCxpQkFBQSxDQUFBUCxDQUFBLEVBQUFNLENBQUE7QUFBQSxTQUFBSixpQkFBQUYsQ0FBQSw4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