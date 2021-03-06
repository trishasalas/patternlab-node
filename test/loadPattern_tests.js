'use strict';

const path = require('path');
const tap = require('tap');

const loadPattern = require('../core/lib/loadPattern');
const util = require('./util/test_utils.js');
const patternEngines = require('../core/lib/pattern_engines');
var config = require('./util/patternlab-config.json');

patternEngines.loadAllEngines(config);

const patterns_dir = './test/files/_patterns';

tap.test('loadPattern - returns null if file is not a pattern', function(test) {
  //arrange
  const patternlab = util.fakePatternLab(patterns_dir);
  var patternPath = path.join('00-test', '03-styled-atom.json');

  //act
  var result = loadPattern(patternPath, patternlab);

  //assert
  test.equals(result, null);
  test.end();
});

tap.test('loadPattern - loads pattern sibling json if found', function(test) {
  //arrange
  const patternlab = util.fakePatternLab(patterns_dir);
  var patternPath = path.join('00-test', '03-styled-atom.mustache');

  //act
  var result = loadPattern(patternPath, patternlab);

  //assert
  test.equals(result.jsonFileData.message, 'baseMessage');
  test.end();
});

tap.test(
  'loadPattern - adds the pattern to the patternlab.partials object',
  function(test) {
    //arrange
    const patternlab = util.fakePatternLab(patterns_dir);
    var fooPatternPath = path.join('00-test', '01-bar.mustache');

    //act
    var result = loadPattern(fooPatternPath, patternlab);

    //assert
    test.equals(util.sanitized(patternlab.partials['test-bar']), 'bar');
    test.end();
  }
);

tap.test('loadPattern - returns pattern with template populated', function(
  test
) {
  //arrange
  const patternlab = util.fakePatternLab(patterns_dir);
  var fooPatternPath = path.join('00-test', '01-bar.mustache');

  //act
  var result = loadPattern(fooPatternPath, patternlab);

  //assert
  test.equals(util.sanitized(result.template), util.sanitized('bar'));
  test.end();
});

tap.test('loadPattern - adds a markdown pattern if encountered', function(
  test
) {
  //arrange
  const patternlab = util.fakePatternLab(patterns_dir);
  var colorsMarkDownPath = path.join('patternType1', 'patternSubType1.md');

  //act
  var result = loadPattern(colorsMarkDownPath, patternlab);

  //assert
  const subTypePattern =
    patternlab.subtypePatterns['patternType1-patternSubType1'];
  test.equals(subTypePattern.patternSectionSubtype, true);
  test.equals(subTypePattern.isPattern, false);
  test.equals(subTypePattern.patternDesc, '<p>Colors</p>\n');
  test.equals(subTypePattern.engine, null);
  test.equals(subTypePattern.flatPatternPath, 'patternType1-patternSubType1');
  test.equals(result, subTypePattern);
  test.end();
});
