/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasOnlyUnixLineEndings = hasOnlyUnixLineEndings;
exports.hasOnlyWinLineEndings = hasOnlyWinLineEndings;
exports.longestCommonPrefix = longestCommonPrefix;
exports.longestCommonSuffix = longestCommonSuffix;
exports.maximumOverlap = maximumOverlap;
exports.removePrefix = removePrefix;
exports.removeSuffix = removeSuffix;
exports.replacePrefix = replacePrefix;
exports.replaceSuffix = replaceSuffix;
/*istanbul ignore end*/
function longestCommonPrefix(str1, str2) {
  var i;
  for (i = 0; i < str1.length && i < str2.length; i++) {
    if (str1[i] != str2[i]) {
      return str1.slice(0, i);
    }
  }
  return str1.slice(0, i);
}
function longestCommonSuffix(str1, str2) {
  var i;

  // Unlike longestCommonPrefix, we need a special case to handle all scenarios
  // where we return the empty string since str1.slice(-0) will return the
  // entire string.
  if (!str1 || !str2 || str1[str1.length - 1] != str2[str2.length - 1]) {
    return '';
  }
  for (i = 0; i < str1.length && i < str2.length; i++) {
    if (str1[str1.length - (i + 1)] != str2[str2.length - (i + 1)]) {
      return str1.slice(-i);
    }
  }
  return str1.slice(-i);
}
function replacePrefix(string, oldPrefix, newPrefix) {
  if (string.slice(0, oldPrefix.length) != oldPrefix) {
    throw Error(
    /*istanbul ignore start*/
    "string ".concat(
    /*istanbul ignore end*/
    JSON.stringify(string), " doesn't start with prefix ").concat(JSON.stringify(oldPrefix), "; this is a bug"));
  }
  return newPrefix + string.slice(oldPrefix.length);
}
function replaceSuffix(string, oldSuffix, newSuffix) {
  if (!oldSuffix) {
    return string + newSuffix;
  }
  if (string.slice(-oldSuffix.length) != oldSuffix) {
    throw Error(
    /*istanbul ignore start*/
    "string ".concat(
    /*istanbul ignore end*/
    JSON.stringify(string), " doesn't end with suffix ").concat(JSON.stringify(oldSuffix), "; this is a bug"));
  }
  return string.slice(0, -oldSuffix.length) + newSuffix;
}
function removePrefix(string, oldPrefix) {
  return replacePrefix(string, oldPrefix, '');
}
function removeSuffix(string, oldSuffix) {
  return replaceSuffix(string, oldSuffix, '');
}
function maximumOverlap(string1, string2) {
  return string2.slice(0, overlapCount(string1, string2));
}

// Nicked from https://stackoverflow.com/a/60422853/1709587
function overlapCount(a, b) {
  // Deal with cases where the strings differ in length
  var startA = 0;
  if (a.length > b.length) {
    startA = a.length - b.length;
  }
  var endB = b.length;
  if (a.length < b.length) {
    endB = a.length;
  }
  // Create a back-reference for each index
  //   that should be followed in case of a mismatch.
  //   We only need B to make these references:
  var map = Array(endB);
  var k = 0; // Index that lags behind j
  map[0] = 0;
  for (var j = 1; j < endB; j++) {
    if (b[j] == b[k]) {
      map[j] = map[k]; // skip over the same character (optional optimisation)
    } else {
      map[j] = k;
    }
    while (k > 0 && b[j] != b[k]) {
      k = map[k];
    }
    if (b[j] == b[k]) {
      k++;
    }
  }
  // Phase 2: use these references while iterating over A
  k = 0;
  for (var i = startA; i < a.length; i++) {
    while (k > 0 && a[i] != b[k]) {
      k = map[k];
    }
    if (a[i] == b[k]) {
      k++;
    }
  }
  return k;
}

/**
 * Returns true if the string consistently uses Windows line endings.
 */
function hasOnlyWinLineEndings(string) {
  return string.includes('\r\n') && !string.match(/(?<!\r)\n/);
}

/**
 * Returns true if the string consistently uses Unix line endings.
 */
function hasOnlyUnixLineEndings(string) {
  return !string.includes('\r\n') && string.includes('\n');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJsb25nZXN0Q29tbW9uUHJlZml4Iiwic3RyMSIsInN0cjIiLCJpIiwibGVuZ3RoIiwic2xpY2UiLCJsb25nZXN0Q29tbW9uU3VmZml4IiwicmVwbGFjZVByZWZpeCIsInN0cmluZyIsIm9sZFByZWZpeCIsIm5ld1ByZWZpeCIsIkVycm9yIiwiY29uY2F0IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlcGxhY2VTdWZmaXgiLCJvbGRTdWZmaXgiLCJuZXdTdWZmaXgiLCJyZW1vdmVQcmVmaXgiLCJyZW1vdmVTdWZmaXgiLCJtYXhpbXVtT3ZlcmxhcCIsInN0cmluZzEiLCJzdHJpbmcyIiwib3ZlcmxhcENvdW50IiwiYSIsImIiLCJzdGFydEEiLCJlbmRCIiwibWFwIiwiQXJyYXkiLCJrIiwiaiIsImhhc09ubHlXaW5MaW5lRW5kaW5ncyIsImluY2x1ZGVzIiwibWF0Y2giLCJoYXNPbmx5VW5peExpbmVFbmRpbmdzIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvc3RyaW5nLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBsb25nZXN0Q29tbW9uUHJlZml4KHN0cjEsIHN0cjIpIHtcbiAgbGV0IGk7XG4gIGZvciAoaSA9IDA7IGkgPCBzdHIxLmxlbmd0aCAmJiBpIDwgc3RyMi5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHIxW2ldICE9IHN0cjJbaV0pIHtcbiAgICAgIHJldHVybiBzdHIxLnNsaWNlKDAsIGkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyMS5zbGljZSgwLCBpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvbmdlc3RDb21tb25TdWZmaXgoc3RyMSwgc3RyMikge1xuICBsZXQgaTtcblxuICAvLyBVbmxpa2UgbG9uZ2VzdENvbW1vblByZWZpeCwgd2UgbmVlZCBhIHNwZWNpYWwgY2FzZSB0byBoYW5kbGUgYWxsIHNjZW5hcmlvc1xuICAvLyB3aGVyZSB3ZSByZXR1cm4gdGhlIGVtcHR5IHN0cmluZyBzaW5jZSBzdHIxLnNsaWNlKC0wKSB3aWxsIHJldHVybiB0aGVcbiAgLy8gZW50aXJlIHN0cmluZy5cbiAgaWYgKCFzdHIxIHx8ICFzdHIyIHx8IHN0cjFbc3RyMS5sZW5ndGggLSAxXSAhPSBzdHIyW3N0cjIubGVuZ3RoIC0gMV0pIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgc3RyMS5sZW5ndGggJiYgaSA8IHN0cjIubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3RyMVtzdHIxLmxlbmd0aCAtIChpICsgMSldICE9IHN0cjJbc3RyMi5sZW5ndGggLSAoaSArIDEpXSkge1xuICAgICAgcmV0dXJuIHN0cjEuc2xpY2UoLWkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyMS5zbGljZSgtaSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlUHJlZml4KHN0cmluZywgb2xkUHJlZml4LCBuZXdQcmVmaXgpIHtcbiAgaWYgKHN0cmluZy5zbGljZSgwLCBvbGRQcmVmaXgubGVuZ3RoKSAhPSBvbGRQcmVmaXgpIHtcbiAgICB0aHJvdyBFcnJvcihgc3RyaW5nICR7SlNPTi5zdHJpbmdpZnkoc3RyaW5nKX0gZG9lc24ndCBzdGFydCB3aXRoIHByZWZpeCAke0pTT04uc3RyaW5naWZ5KG9sZFByZWZpeCl9OyB0aGlzIGlzIGEgYnVnYCk7XG4gIH1cbiAgcmV0dXJuIG5ld1ByZWZpeCArIHN0cmluZy5zbGljZShvbGRQcmVmaXgubGVuZ3RoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VTdWZmaXgoc3RyaW5nLCBvbGRTdWZmaXgsIG5ld1N1ZmZpeCkge1xuICBpZiAoIW9sZFN1ZmZpeCkge1xuICAgIHJldHVybiBzdHJpbmcgKyBuZXdTdWZmaXg7XG4gIH1cblxuICBpZiAoc3RyaW5nLnNsaWNlKC1vbGRTdWZmaXgubGVuZ3RoKSAhPSBvbGRTdWZmaXgpIHtcbiAgICB0aHJvdyBFcnJvcihgc3RyaW5nICR7SlNPTi5zdHJpbmdpZnkoc3RyaW5nKX0gZG9lc24ndCBlbmQgd2l0aCBzdWZmaXggJHtKU09OLnN0cmluZ2lmeShvbGRTdWZmaXgpfTsgdGhpcyBpcyBhIGJ1Z2ApO1xuICB9XG4gIHJldHVybiBzdHJpbmcuc2xpY2UoMCwgLW9sZFN1ZmZpeC5sZW5ndGgpICsgbmV3U3VmZml4O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlUHJlZml4KHN0cmluZywgb2xkUHJlZml4KSB7XG4gIHJldHVybiByZXBsYWNlUHJlZml4KHN0cmluZywgb2xkUHJlZml4LCAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTdWZmaXgoc3RyaW5nLCBvbGRTdWZmaXgpIHtcbiAgcmV0dXJuIHJlcGxhY2VTdWZmaXgoc3RyaW5nLCBvbGRTdWZmaXgsICcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1heGltdW1PdmVybGFwKHN0cmluZzEsIHN0cmluZzIpIHtcbiAgcmV0dXJuIHN0cmluZzIuc2xpY2UoMCwgb3ZlcmxhcENvdW50KHN0cmluZzEsIHN0cmluZzIpKTtcbn1cblxuLy8gTmlja2VkIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzYwNDIyODUzLzE3MDk1ODdcbmZ1bmN0aW9uIG92ZXJsYXBDb3VudChhLCBiKSB7XG4gIC8vIERlYWwgd2l0aCBjYXNlcyB3aGVyZSB0aGUgc3RyaW5ncyBkaWZmZXIgaW4gbGVuZ3RoXG4gIGxldCBzdGFydEEgPSAwO1xuICBpZiAoYS5sZW5ndGggPiBiLmxlbmd0aCkgeyBzdGFydEEgPSBhLmxlbmd0aCAtIGIubGVuZ3RoOyB9XG4gIGxldCBlbmRCID0gYi5sZW5ndGg7XG4gIGlmIChhLmxlbmd0aCA8IGIubGVuZ3RoKSB7IGVuZEIgPSBhLmxlbmd0aDsgfVxuICAvLyBDcmVhdGUgYSBiYWNrLXJlZmVyZW5jZSBmb3IgZWFjaCBpbmRleFxuICAvLyAgIHRoYXQgc2hvdWxkIGJlIGZvbGxvd2VkIGluIGNhc2Ugb2YgYSBtaXNtYXRjaC5cbiAgLy8gICBXZSBvbmx5IG5lZWQgQiB0byBtYWtlIHRoZXNlIHJlZmVyZW5jZXM6XG4gIGxldCBtYXAgPSBBcnJheShlbmRCKTtcbiAgbGV0IGsgPSAwOyAvLyBJbmRleCB0aGF0IGxhZ3MgYmVoaW5kIGpcbiAgbWFwWzBdID0gMDtcbiAgZm9yIChsZXQgaiA9IDE7IGogPCBlbmRCOyBqKyspIHtcbiAgICAgIGlmIChiW2pdID09IGJba10pIHtcbiAgICAgICAgICBtYXBbal0gPSBtYXBba107IC8vIHNraXAgb3ZlciB0aGUgc2FtZSBjaGFyYWN0ZXIgKG9wdGlvbmFsIG9wdGltaXNhdGlvbilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFwW2pdID0gaztcbiAgICAgIH1cbiAgICAgIHdoaWxlIChrID4gMCAmJiBiW2pdICE9IGJba10pIHsgayA9IG1hcFtrXTsgfVxuICAgICAgaWYgKGJbal0gPT0gYltrXSkgeyBrKys7IH1cbiAgfVxuICAvLyBQaGFzZSAyOiB1c2UgdGhlc2UgcmVmZXJlbmNlcyB3aGlsZSBpdGVyYXRpbmcgb3ZlciBBXG4gIGsgPSAwO1xuICBmb3IgKGxldCBpID0gc3RhcnRBOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgd2hpbGUgKGsgPiAwICYmIGFbaV0gIT0gYltrXSkgeyBrID0gbWFwW2tdOyB9XG4gICAgICBpZiAoYVtpXSA9PSBiW2tdKSB7IGsrKzsgfVxuICB9XG4gIHJldHVybiBrO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBzdHJpbmcgY29uc2lzdGVudGx5IHVzZXMgV2luZG93cyBsaW5lIGVuZGluZ3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNPbmx5V2luTGluZUVuZGluZ3Moc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcuaW5jbHVkZXMoJ1xcclxcbicpICYmICFzdHJpbmcubWF0Y2goLyg/PCFcXHIpXFxuLyk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBzdHJpbmcgY29uc2lzdGVudGx5IHVzZXMgVW5peCBsaW5lIGVuZGluZ3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNPbmx5VW5peExpbmVFbmRpbmdzKHN0cmluZykge1xuICByZXR1cm4gIXN0cmluZy5pbmNsdWRlcygnXFxyXFxuJykgJiYgc3RyaW5nLmluY2x1ZGVzKCdcXG4nKTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFPLFNBQVNBLG1CQUFtQkEsQ0FBQ0MsSUFBSSxFQUFFQyxJQUFJLEVBQUU7RUFDOUMsSUFBSUMsQ0FBQztFQUNMLEtBQUtBLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0YsSUFBSSxDQUFDRyxNQUFNLElBQUlELENBQUMsR0FBR0QsSUFBSSxDQUFDRSxNQUFNLEVBQUVELENBQUMsRUFBRSxFQUFFO0lBQ25ELElBQUlGLElBQUksQ0FBQ0UsQ0FBQyxDQUFDLElBQUlELElBQUksQ0FBQ0MsQ0FBQyxDQUFDLEVBQUU7TUFDdEIsT0FBT0YsSUFBSSxDQUFDSSxLQUFLLENBQUMsQ0FBQyxFQUFFRixDQUFDLENBQUM7SUFDekI7RUFDRjtFQUNBLE9BQU9GLElBQUksQ0FBQ0ksS0FBSyxDQUFDLENBQUMsRUFBRUYsQ0FBQyxDQUFDO0FBQ3pCO0FBRU8sU0FBU0csbUJBQW1CQSxDQUFDTCxJQUFJLEVBQUVDLElBQUksRUFBRTtFQUM5QyxJQUFJQyxDQUFDOztFQUVMO0VBQ0E7RUFDQTtFQUNBLElBQUksQ0FBQ0YsSUFBSSxJQUFJLENBQUNDLElBQUksSUFBSUQsSUFBSSxDQUFDQSxJQUFJLENBQUNHLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSUYsSUFBSSxDQUFDQSxJQUFJLENBQUNFLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRTtJQUNwRSxPQUFPLEVBQUU7RUFDWDtFQUVBLEtBQUtELENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0YsSUFBSSxDQUFDRyxNQUFNLElBQUlELENBQUMsR0FBR0QsSUFBSSxDQUFDRSxNQUFNLEVBQUVELENBQUMsRUFBRSxFQUFFO0lBQ25ELElBQUlGLElBQUksQ0FBQ0EsSUFBSSxDQUFDRyxNQUFNLElBQUlELENBQUMsR0FBRyxD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VixLQUFLLElBQUlHLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0osSUFBSSxFQUFFSSxDQUFDLEVBQUUsRUFBRTtJQUMzQixJQUFJTixDQUFDLENBQUNNLENBQUMsQ0FBQyxJQUFJTixDQUFDLENBQUNLLENBQUMsQ0FBQyxFQUFFO01BQ2RGLEdBQUcsQ0FBQ0csQ0FBQyxDQUFDLEdBQUdILEdBQUcsQ0FBQ0UsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQixDQUFDLE1BQU07TUFDSEYsR0FBRyxDQUFDRyxDQUFDLENBQUMsR0FBR0QsQ0FBQztJQUNkO0lBQ0EsT0FBT0EsQ0FBQyxHQUFHLENBQUMsSUFBSUwsQ0FBQyxDQUFDTSxDQUFDLENBQUMsSUFBSU4sQ0FBQyxDQUFDSyxDQUFDLENBQUMsRUFBRTtNQUFFQSxDQUFDLEdBQUdGLEdBQUcsQ0FBQ0UsQ0FBQyxDQUFDO0lBQUU7SUFDNUMsSUFBSUwsQ0FBQyxDQUFDTSxDQUFDLENBQUMsSUFBSU4sQ0FBQyxDQUFDSyxDQUFDLENBQUMsRUFBRTtNQUFFQSxDQUFDLEVBQUU7SUFBRTtFQUM3QjtFQUNBO0VBQ0FBLENBQUMsR0FBRyxDQUFDO0VBQ0wsS0FBSyxJQUFJM0IsQ0FBQyxHQUFHdUIsTUFBTSxFQUFFdkIsQ0FBQyxHQUFHcUIsQ0FBQyxDQUFDcEIsTUFBTSxFQUFFRCxDQUFDLEVBQUUsRUFBRTtJQUNwQyxPQUFPMkIsQ0FBQyxHQUFHLENBQUMsSUFBSU4sQ0FBQyxDQUFDckIsQ0FBQyxDQUFDLElBQUlzQixDQUFDLENBQUNLLENBQUMsQ0FBQyxFQUFFO01BQUVBLENBQUMsR0FBR0YsR0FBRyxDQUFDRSxDQUFDLENBQUM7SUFBRTtJQUM1QyxJQUFJTixDQUFDLENBQUNyQixDQUFDLENBQUMsSUFBSXNCLENBQUMsQ0FBQ0ssQ0FBQyxDQUFDLEVBQUU7TUFBRUEsQ0FBQyxFQUFFO0lBQUU7RUFDN0I7RUFDQSxPQUFPQSxDQUFDO0FBQ1Y7O0FBR0E7QUFDQTtBQUNBO0FBQ08sU0FBU0UscUJBQXFCQSxDQUFDeEIsTUFBTSxFQUFFO0VBQzVDLE9BQU9BLE1BQU0sQ0FBQ3lCLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDekIsTUFBTSxDQUFDMEIsS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7QUFDTyxTQUFTQyxzQkFBc0JBLENBQUMzQixNQUFNLEVBQUU7RUFDN0MsT0FBTyxDQUFDQSxNQUFNLENBQUN5QixRQUFRLENBQUMsTUFBTSxDQUFDLElBQUl6QixNQUFNLENBQUN5QixRQUFRLENBQUMsSUFBSSxDQUFDO0FBQzFEIiwiaWdub3JlTGlzdCI6W119