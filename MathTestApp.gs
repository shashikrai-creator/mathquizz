/**
 * CA Common Core Grades 7-12 Math Practice Test App
 * Google Apps Script — paste into Extensions > Apps Script
 *
 * Menu: Math Practice Test →
 *   Setup App | Refresh Topics | Generate New Test | Submit & Grade | Clear Test
 */

// ─── Menu ────────────────────────────────────────────────────────────────────

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Math Practice Test')
    .addItem('Setup App', 'setupApp')
    .addItem('Refresh Topics', 'refreshSubTopics')
    .addSeparator()
    .addItem('Generate New Test', 'generateNewTest')
    .addItem('Submit & Grade', 'submitAndGrade')
    .addItem('Clear Test', 'clearTest')
    .addToUi();
}

// ─── Constants ───────────────────────────────────────────────────────────────

var GRADES = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

var TOPICS_BY_GRADE = {
  'Grade 7': [
    'Ratios & Proportional Relationships',
    'The Number System',
    'Expressions & Equations',
    'Geometry',
    'Statistics & Probability'
  ],
  'Grade 8': [
    'The Number System',
    'Expressions & Equations',
    'Functions',
    'Geometry',
    'Statistics & Probability'
  ],
  'Grade 9': [
    'Linear Equations',
    'Linear Inequalities',
    'Systems of Equations',
    'Functions & Graphing',
    'Arithmetic & Geometric Sequences',
    'Exponents & Radicals',
    'Polynomials & Factoring',
    'Quadratic Equations',
    'Statistics & Data Analysis',
    'Geometry'
  ],
  'Grade 10': [
    'Congruence & Proofs',
    'Similarity & Transformations',
    'Right Triangles & Trigonometry',
    'Circles',
    'Coordinate Geometry',
    'Area & Volume'
  ],
  'Grade 11': [
    'Complex Numbers',
    'Polynomial Functions',
    'Rational Expressions',
    'Exponential & Logarithmic Functions',
    'Trigonometric Functions',
    'Probability & Combinatorics'
  ],
  'Grade 12': [
    'Advanced Functions',
    'Limits',
    'Sequences & Series',
    'Conic Sections',
    'Probability & Statistics',
    'Matrices'
  ]
};

var SUBTOPICS_BY_GRADE = {
  'Grade 7': {
    'Ratios & Proportional Relationships': ['Mix (All)', 'Unit Rates', 'Proportions', 'Percent Problems', 'Percent Change', 'Scale Drawings', 'Constant of Proportionality'],
    'The Number System': ['Mix (All)', 'Adding Integers', 'Subtracting Integers', 'Multiplying & Dividing Integers', 'Operations with Fractions', 'Operations with Decimals', 'Converting Fractions & Decimals'],
    'Expressions & Equations': ['Mix (All)', 'Combining Like Terms', 'Distributive Property', 'One-Step Equations', 'Two-Step Equations', 'One-Step Inequalities', 'Word Problems'],
    'Geometry': ['Mix (All)', 'Area of Triangles', 'Area of Circles', 'Circumference', 'Angle Relationships', 'Cross-Sections', 'Area of Composite Shapes'],
    'Statistics & Probability': ['Mix (All)', 'Mean, Median & Mode', 'Mean Absolute Deviation', 'Simple Probability', 'Compound Probability', 'Sampling & Predictions']
  },
  'Grade 8': {
    'The Number System': ['Mix (All)', 'Rational vs Irrational', 'Approximating Square Roots', 'Comparing Real Numbers', 'Operations with Radicals', 'Repeating Decimals to Fractions', 'Cube Roots'],
    'Expressions & Equations': ['Mix (All)', 'Solving Linear Equations', 'Equations with No/Infinite Solutions', 'Systems of Equations (Intro)', 'Slope from Two Points', 'Slope-Intercept Form', 'Scientific Notation Operations'],
    'Functions': ['Mix (All)', 'Identify Functions', 'Evaluate Functions', 'Linear vs Nonlinear', 'Rate of Change', 'Compare Functions', 'Function from Table or Graph'],
    'Geometry': ['Mix (All)', 'Pythagorean Theorem', 'Distance Between Points', 'Volume of Cylinders', 'Volume of Cones', 'Volume of Spheres', 'Angle Relationships (Parallel Lines)'],
    'Statistics & Probability': ['Mix (All)', 'Scatter Plot Trends', 'Line of Best Fit', 'Two-Way Tables', 'Relative Frequency', 'Bivariate Data Patterns', 'Outliers & Influence']
  },
  'Grade 9': {
    'Linear Equations': ['Mix (All)', 'One-Step Equations', 'Two-Step Equations', 'Variables on Both Sides', 'Distributive Property', 'Word Problems', 'Absolute Value Equations'],
    'Linear Inequalities': ['Mix (All)', 'One-Step Inequalities', 'Two-Step Inequalities', 'Compound Inequalities', 'Word Problems', 'Absolute Value Inequalities'],
    'Systems of Equations': ['Mix (All)', 'Substitution', 'Elimination', 'Word Problems', 'Number of Solutions', 'Find Both Variables'],
    'Functions & Graphing': ['Mix (All)', 'Evaluate Functions', 'Slope', 'Intercepts', 'Rate of Change', 'Function Composition', 'Linear vs Nonlinear'],
    'Arithmetic & Geometric Sequences': ['Mix (All)', 'Arithmetic Sequences', 'Geometric Sequences', 'Sequence Sums', 'Find Common Difference', 'Find Common Ratio', 'Missing Terms'],
    'Exponents & Radicals': ['Mix (All)', 'Exponent Rules', 'Evaluate Powers', 'Square Roots', 'Negative Exponents', 'Scientific Notation', 'Cube Roots'],
    'Polynomials & Factoring': ['Mix (All)', 'Evaluate Polynomials', 'Multiply Polynomials', 'Factor Polynomials', 'Add & Subtract Polynomials', 'GCF Factoring', 'Degree & Leading Coefficient'],
    'Quadratic Equations': ['Mix (All)', 'Perfect Squares', 'Factoring Quadratics', 'Standard Form', 'Vertex Form', 'Complete the Square', 'Quadratic Word Problems'],
    'Statistics & Data Analysis': ['Mix (All)', 'Mean', 'Median', 'Range', 'Mode', 'Weighted Average', 'Five-Number Summary'],
    'Geometry': ['Mix (All)', 'Area', 'Volume', 'Pythagorean Theorem', 'Perimeter', 'Surface Area', 'Circumference & Circles']
  },
  'Grade 10': {
    'Congruence & Proofs': ['Mix (All)', 'Triangle Angle Sum', 'Exterior Angle Theorem', 'Isosceles Triangle Properties', 'Midsegment Lengths', 'CPCTC Calculations', 'Angle Bisector & Perpendicular Bisector'],
    'Similarity & Transformations': ['Mix (All)', 'Scale Factor', 'Similar Triangle Side Lengths', 'Proportions in Similar Figures', 'Dilations on Coordinates', 'Reflection Coordinates', 'Rotation Coordinates'],
    'Right Triangles & Trigonometry': ['Mix (All)', 'Pythagorean Theorem (Advanced)', 'Special Right Triangles (45-45-90)', 'Special Right Triangles (30-60-90)', 'Sine Ratio', 'Cosine Ratio', 'Tangent Ratio'],
    'Circles': ['Mix (All)', 'Arc Length', 'Sector Area', 'Central Angles', 'Inscribed Angles', 'Tangent Line Lengths', 'Equation of a Circle (Radius)'],
    'Coordinate Geometry': ['Mix (All)', 'Distance Formula', 'Midpoint Formula', 'Slope of Parallel Lines', 'Slope of Perpendicular Lines', 'Partitioning a Segment', 'Perimeter on Coordinate Plane'],
    'Area & Volume': ['Mix (All)', 'Area of Regular Polygons', 'Area of Trapezoids', 'Volume of Prisms', 'Volume of Pyramids', 'Volume of Cylinders & Cones', 'Cross-Section Identification']
  },
  'Grade 11': {
    'Complex Numbers': ['Mix (All)', 'Powers of i', 'Adding & Subtracting Complex Numbers', 'Multiplying Complex Numbers', 'Complex Conjugates', 'Absolute Value (Modulus)', 'Solving Equations with Complex Solutions'],
    'Polynomial Functions': ['Mix (All)', 'Evaluate Polynomials', 'End Behavior', 'Zeros from Factored Form', 'Factor by Grouping', 'Remainder Theorem', 'Degree & Leading Coefficient'],
    'Rational Expressions': ['Mix (All)', 'Simplify Rational Expressions', 'Multiply & Divide', 'Add & Subtract (Like Denominators)', 'Add & Subtract (Unlike Denominators)', 'Solve Rational Equations', 'Find Excluded Values'],
    'Exponential & Logarithmic Functions': ['Mix (All)', 'Evaluate Exponential Functions', 'Growth & Decay', 'Convert Exponential to Log', 'Evaluate Logarithms', 'Log Properties', 'Solve Exponential Equations'],
    'Trigonometric Functions': ['Mix (All)', 'Convert Degrees to Radians', 'Convert Radians to Degrees', 'Unit Circle Values', 'Trig Function Evaluation', 'Amplitude & Period', 'Inverse Trig Values'],
    'Probability & Combinatorics': ['Mix (All)', 'Permutations', 'Combinations', 'Factorial Expressions', 'Independent Events', 'Conditional Probability', 'Binomial Probability']
  },
  'Grade 12': {
    'Advanced Functions': ['Mix (All)', 'Piecewise Function Evaluation', 'Function Composition', 'Inverse Functions', 'Even & Odd Functions', 'Domain Restrictions', 'Asymptotes'],
    'Limits': ['Mix (All)', 'Limits of Polynomials', 'Limits with Factoring', 'One-Sided Limits', 'Limits at Infinity', 'Evaluate Limit from Table', 'Continuity Check'],
    'Sequences & Series': ['Mix (All)', 'Arithmetic Series Sum', 'Geometric Series Sum', 'Infinite Geometric Series', 'Recursive Sequences', 'Sigma Notation Evaluation', 'Convergence & Divergence'],
    'Conic Sections': ['Mix (All)', 'Circle Radius from Equation', 'Circle Center from Equation', 'Ellipse Semi-Axes', 'Parabola Vertex', 'Hyperbola Identification', 'Focus of a Parabola'],
    'Probability & Statistics': ['Mix (All)', 'Normal Distribution (Empirical Rule)', 'Z-Scores', 'Expected Value', 'Standard Deviation (Small Sets)', 'Variance', 'Probability Distributions'],
    'Matrices': ['Mix (All)', 'Matrix Addition', 'Scalar Multiplication', 'Matrix Multiplication (2x2)', 'Determinant (2x2)', 'Inverse of 2x2 Matrix (Element)', 'Solving 2x2 Systems with Matrices']
  }
};

var DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// ─── Setup ───────────────────────────────────────────────────────────────────

function setupApp() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── Dashboard ──
  var dash = getOrCreateSheet(ss, 'Dashboard');
  dash.clear();
  dash.getRange(1, 1, dash.getMaxRows(), dash.getMaxColumns()).clearDataValidations();
  dash.setColumnWidth(1, 200);
  dash.setColumnWidth(2, 320);

  dash.getRange('A1').setValue('Math Practice Test').setFontSize(18).setFontWeight('bold');
  dash.getRange('A2').setValue('CA Common Core — Grades 7-12').setFontSize(11).setFontColor('#555555');

  // Grade dropdown (row 4)
  dash.getRange('A4').setValue('Grade:').setFontWeight('bold');
  var gradeCell = dash.getRange('B4');
  var gradeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(GRADES, true)
    .setAllowInvalid(false)
    .build();
  gradeCell.setDataValidation(gradeRule);
  gradeCell.setValue(GRADES[2]); // Default to Grade 9

  // Topic dropdown (row 5)
  dash.getRange('A5').setValue('Topic:').setFontWeight('bold');
  var grade = GRADES[2];
  var topics = TOPICS_BY_GRADE[grade];
  var topicCell = dash.getRange('B5');
  var topicRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(topics, true)
    .setAllowInvalid(false)
    .build();
  topicCell.setDataValidation(topicRule);
  topicCell.setValue(topics[0]);

  // Sub-Topic dropdown (row 6)
  dash.getRange('A6').setValue('Sub-Topic:').setFontWeight('bold');
  var subCell = dash.getRange('B6');
  var firstSubs = SUBTOPICS_BY_GRADE[grade][topics[0]];
  var subRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(firstSubs, true)
    .setAllowInvalid(false)
    .build();
  subCell.setDataValidation(subRule);
  subCell.setValue(firstSubs[0]);

  // Difficulty dropdown (row 7)
  dash.getRange('A7').setValue('Difficulty:').setFontWeight('bold');
  var diffCell = dash.getRange('B7');
  var diffRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(DIFFICULTIES, true)
    .setAllowInvalid(false)
    .build();
  diffCell.setDataValidation(diffRule);
  diffCell.setValue(DIFFICULTIES[0]);

  dash.getRange('A9').setValue('Instructions').setFontSize(13).setFontWeight('bold');
  dash.getRange('A10').setValue(
    '1. Select a Grade, Topic, Sub-Topic, and Difficulty above.\n' +
    '2. Menu → Math Practice Test → Generate New Test.\n' +
    '3. Go to the "Test" sheet and type your numeric answers in column C.\n' +
    '4. Menu → Math Practice Test → Submit & Grade.\n' +
    '5. View results on the Test sheet and score history on "Score History".\n\n' +
    'Tip: Choose "Mix (All)" for a sub-topic to get a variety of questions within the topic.'
  ).setWrap(true);
  dash.getRange('A10:B15').mergeAcross();

  // ── Test ──
  var test = getOrCreateSheet(ss, 'Test');
  setupTestSheet(test);

  // ── Score History ──
  var hist = getOrCreateSheet(ss, 'Score History');
  hist.clear();
  var histHeader = ['Date', 'Grade', 'Topic', 'Sub-Topic', 'Difficulty', 'Score', 'Percentage', 'Time Taken'];
  hist.getRange(1, 1, 1, histHeader.length).setValues([histHeader]).setFontWeight('bold');
  hist.setColumnWidth(1, 160);
  hist.setColumnWidth(2, 100);
  hist.setColumnWidth(3, 220);
  hist.setColumnWidth(4, 180);
  hist.setColumnWidth(5, 100);
  hist.setColumnWidth(6, 80);
  hist.setColumnWidth(7, 100);
  hist.setColumnWidth(8, 120);
  hist.setFrozenRows(1);

  // Activate Dashboard
  ss.setActiveSheet(dash);
  SpreadsheetApp.getUi().alert('Setup complete! Select a grade, topic, sub-topic, and difficulty on the Dashboard, then use the menu to generate a test.');
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function setupTestSheet(sheet) {
  sheet.clear();
  sheet.setColumnWidth(1, 40);   // Q#
  sheet.setColumnWidth(2, 480);  // Question
  sheet.setColumnWidth(3, 120);  // Your Answer
  sheet.setColumnWidth(4, 120);  // Correct Answer
  sheet.setColumnWidth(5, 100);  // Result

  var headers = ['#', 'Question', 'Your Answer', 'Correct Answer', 'Result'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sheet.setFrozenRows(1);

  for (var i = 1; i <= 10; i++) {
    sheet.getRange(i + 1, 1).setValue(i);
    sheet.getRange(i + 1, 2).setValue('');
    sheet.getRange(i + 1, 3).setValue('');
    sheet.getRange(i + 1, 4).setValue('');
    sheet.getRange(i + 1, 5).setValue('');
  }

  sheet.hideColumns(4);
  sheet.hideColumns(5);

  sheet.getRange(13, 1).setValue('Score:').setFontWeight('bold');
  sheet.getRange(13, 2).setValue('');
  sheet.getRange(14, 1).setValue('Time:').setFontWeight('bold');
  sheet.getRange(14, 2).setValue('');
}

// ─── Dropdown Helpers ────────────────────────────────────────────────────────

/**
 * Reads the current grade from B4 and rebuilds the topic dropdown at B5.
 */
function updateTopicDropdown(dash) {
  var grade = dash.getRange('B4').getValue();
  var topics = TOPICS_BY_GRADE[grade];
  if (!topics) return;
  var topicCell = dash.getRange('B5');
  var currentVal = topicCell.getValue();
  var topicRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(topics, true)
    .setAllowInvalid(false)
    .build();
  topicCell.setDataValidation(topicRule);
  if (topics.indexOf(currentVal) === -1) {
    topicCell.setValue(topics[0]);
  }
}

/**
 * Reads the current grade from B4 and topic from B5, rebuilds the subtopic dropdown at B6.
 */
function updateSubTopicDropdown(dash) {
  var grade = dash.getRange('B4').getValue();
  var topic = dash.getRange('B5').getValue();
  var gradeSubs = SUBTOPICS_BY_GRADE[grade];
  if (!gradeSubs) return;
  var subs = gradeSubs[topic];
  if (!subs) return;
  var subCell = dash.getRange('B6');
  var currentVal = subCell.getValue();
  var subRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(subs, true)
    .setAllowInvalid(false)
    .build();
  subCell.setDataValidation(subRule);
  if (subs.indexOf(currentVal) === -1) {
    subCell.setValue(subs[0]);
  }
}

/**
 * Menu item: manually refresh topics and sub-topics for the selected grade.
 */
function refreshSubTopics() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dash = ss.getSheetByName('Dashboard');
  if (!dash) { SpreadsheetApp.getUi().alert('Run "Setup App" first.'); return; }
  updateTopicDropdown(dash);
  updateSubTopicDropdown(dash);
  SpreadsheetApp.getUi().alert('Topics refreshed for: ' + dash.getRange('B4').getValue());
}

/**
 * onEdit trigger — cascading dropdowns.
 * Grade change (row 4) → refresh Topic + SubTopic
 * Topic change (row 5) → refresh SubTopic
 */
function onEdit(e) {
  try {
    var sheet = e.source.getActiveSheet();
    if (sheet.getName() !== 'Dashboard') return;
    var row = e.range.getRow();
    var col = e.range.getColumn();
    if (col !== 2) return;
    if (row === 4) {
      // Grade changed
      updateTopicDropdown(sheet);
      updateSubTopicDropdown(sheet);
    } else if (row === 5) {
      // Topic changed
      updateSubTopicDropdown(sheet);
    }
  } catch (err) {
    // Simple trigger may silently fail; user can use Refresh Topics menu item
  }
}

// ─── Generate New Test ───────────────────────────────────────────────────────

function generateNewTest() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dash = ss.getSheetByName('Dashboard');
  if (!dash) { SpreadsheetApp.getUi().alert('Run "Setup App" first.'); return; }

  // Ensure dropdowns match current selections
  updateTopicDropdown(dash);
  updateSubTopicDropdown(dash);

  var grade = dash.getRange('B4').getValue();
  var topic = dash.getRange('B5').getValue();
  var subTopic = dash.getRange('B6').getValue();
  var difficulty = dash.getRange('B7').getValue();
  if (!grade || !topic || !subTopic || !difficulty) {
    SpreadsheetApp.getUi().alert('Please select a grade, topic, sub-topic, and difficulty on the Dashboard.');
    return;
  }

  var test = ss.getSheetByName('Test');
  if (!test) { SpreadsheetApp.getUi().alert('Run "Setup App" first.'); return; }

  setupTestSheet(test);

  var questions = generateQuestions(grade, topic, subTopic, difficulty, 10);
  for (var i = 0; i < questions.length; i++) {
    test.getRange(i + 2, 2).setValue(questions[i].question);
    test.getRange(i + 2, 4).setValue(questions[i].answer);
  }

  // Start timer
  PropertiesService.getDocumentProperties().setProperty('testStartTime', new Date().getTime().toString());

  ss.setActiveSheet(test);
  test.getRange('C2').activate();
}

// ─── Submit & Grade ──────────────────────────────────────────────────────────

function submitAndGrade() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var test = ss.getSheetByName('Test');
  var dash = ss.getSheetByName('Dashboard');
  var hist = ss.getSheetByName('Score History');
  if (!test || !dash || !hist) { SpreadsheetApp.getUi().alert('Run "Setup App" first.'); return; }

  if (!test.getRange('B2').getValue()) {
    SpreadsheetApp.getUi().alert('Generate a test first.');
    return;
  }

  var score = 0;
  for (var i = 0; i < 10; i++) {
    var row = i + 2;
    var userAnswer = test.getRange(row, 3).getValue();
    var correctAnswer = test.getRange(row, 4).getValue();
    var result;
    if (userAnswer === '' || userAnswer === null) {
      result = 'Skipped';
    } else {
      var num = parseFloat(userAnswer);
      if (isNaN(num)) {
        result = 'Invalid';
      } else if (Math.abs(num - correctAnswer) <= 0.01) {
        result = 'Correct';
        score++;
      } else {
        result = 'Incorrect';
      }
    }
    test.getRange(row, 5).setValue(result);
    var color = result === 'Correct' ? '#d4edda' : (result === 'Incorrect' ? '#f8d7da' : '#fff3cd');
    test.getRange(row, 5).setBackground(color);
  }

  test.showColumns(4);
  test.showColumns(5);

  var pct = Math.round(score / 10 * 100);
  test.getRange(13, 2).setValue(score + ' / 10  (' + pct + '%)').setFontSize(13).setFontWeight('bold');

  // Calculate elapsed time
  var timeTaken = '';
  var startProp = PropertiesService.getDocumentProperties().getProperty('testStartTime');
  if (startProp) {
    var elapsed = Math.floor((new Date().getTime() - parseInt(startProp, 10)) / 1000);
    var mins = Math.floor(elapsed / 60);
    var secs = elapsed % 60;
    timeTaken = mins + 'm ' + (secs < 10 ? '0' : '') + secs + 's';
    test.getRange(14, 2).setValue(timeTaken).setFontSize(13).setFontWeight('bold');
    PropertiesService.getDocumentProperties().deleteProperty('testStartTime');
  } else {
    test.getRange(14, 2).setValue('N/A');
  }

  var grade = dash.getRange('B4').getValue();
  var topic = dash.getRange('B5').getValue();
  var subTopic = dash.getRange('B6').getValue();
  var difficulty = dash.getRange('B7').getValue();
  hist.appendRow([new Date(), grade, topic, subTopic, difficulty, score + '/10', pct + '%', timeTaken || 'N/A']);

  SpreadsheetApp.getUi().alert('Score: ' + score + '/10 (' + pct + '%)' + (timeTaken ? '\nTime: ' + timeTaken : '') + '\nResults saved to Score History.');
}

// ─── Clear Test ──────────────────────────────────────────────────────────────

function clearTest() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var test = ss.getSheetByName('Test');
  if (!test) { SpreadsheetApp.getUi().alert('Run "Setup App" first.'); return; }
  setupTestSheet(test);
}

// ─── Question Generation ─────────────────────────────────────────────────────

function generateQuestions(grade, topic, subTopic, difficulty, count) {
  var gradeGens = SUB_GENERATORS[grade];
  if (!gradeGens) throw new Error('Unknown grade: ' + grade);
  var topicGens = gradeGens[topic];
  if (!topicGens) throw new Error('Unknown topic: ' + topic + ' for ' + grade);

  var subs = SUBTOPICS_BY_GRADE[grade][topic];
  var questions = [];
  if (subTopic === 'Mix (All)') {
    var subKeys = subs.slice(1);
    for (var i = 0; i < count; i++) {
      var pick = subKeys[randInt(0, subKeys.length - 1)];
      questions.push(topicGens[pick](difficulty));
    }
  } else {
    var gen = topicGens[subTopic];
    if (!gen) throw new Error('Unknown sub-topic: ' + subTopic);
    for (var i = 0; i < count; i++) {
      questions.push(gen(difficulty));
    }
  }
  return questions;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randNonZero(max) {
  var v = randInt(1, max);
  return Math.random() < 0.5 ? -v : v;
}

function fmtTerm(coeff, variable) {
  if (coeff === 1) return variable;
  if (coeff === -1) return '-' + variable;
  return coeff + variable;
}

function paren(n) {
  return n < 0 ? '(' + n + ')' : '' + n;
}

function ordinal(n) {
  var s = ['th','st','nd','rd'];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function factorial(n) {
  if (n <= 1) return 1;
  var result = 1;
  for (var i = 2; i <= n; i++) result *= i;
  return result;
}

function nCr(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function nPr(n, r) {
  return factorial(n) / factorial(n - r);
}
// ═════════════════════════════════════════════════════════════════════════════
//  SUB-TOPIC GENERATORS
//  Structure: SUB_GENERATORS[topic][subTopic] = function(difficulty) → {question, answer}
// ═════════════════════════════════════════════════════════════════════════════

var SUB_GENERATORS = {};
SUB_GENERATORS['Grade 9'] = {};

// ─────────────────────────────────────────────────────────────────────────────
// 1. LINEAR EQUATIONS
// ─────────────────────────────────────────────────────────────────────────────
SUB_GENERATORS['Grade 9']['Linear Equations'] = {};

// One-Step:  ax = c  or  x + b = c
SUB_GENERATORS['Grade 9']['Linear Equations']['One-Step Equations'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(1, 10);
    var a = randInt(2, 5);
    var c = a * x;
    return { question: 'Solve for x:  ' + a + 'x = ' + c, answer: x };
  } else if (diff === 'Medium') {
    var x = randInt(-10, 10);
    var a = randNonZero(6);
    var c = a * x;
    return { question: 'Solve for x:  ' + fmtTerm(a, 'x') + ' = ' + c, answer: x };
  } else {
    var x = randInt(-12, 12);
    var a = randNonZero(8);
    var c = a * x;
    return { question: 'Solve for x:  ' + fmtTerm(a, 'x') + ' = ' + c, answer: x };
  }
};

// Two-Step:  ax + b = c
SUB_GENERATORS['Grade 9']['Linear Equations']['Two-Step Equations'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(1, 10);
    var a = randInt(1, 5);
    var b = randInt(1, 10);
    var c = a * x + b;
    return { question: 'Solve for x:  ' + a + 'x + ' + b + ' = ' + c, answer: x };
  } else if (diff === 'Medium') {
    var x = randInt(-10, 10);
    var a = randNonZero(6);
    var b = randInt(-15, 15);
    var c = a * x + b;
    return { question: 'Solve for x:  ' + fmtTerm(a, 'x') + ' + ' + paren(b) + ' = ' + c, answer: x };
  } else {
    var x = randInt(-15, 15);
    var a = randNonZero(8);
    var b = randInt(-20, 20);
    var c = a * x + b;
    return { question: 'Solve for x:  ' + fmtTerm(a, 'x') + ' + ' + paren(b) + ' = ' + c, answer: x };
  }
};

// Variables on Both Sides:  ax + b = cx + d
SUB_GENERATORS['Grade 9']['Linear Equations']['Variables on Both Sides'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(1, 8);
    var a = randInt(2, 5);
    var cCoeff = randInt(1, a - 1);
    var b = randInt(1, 10);
    var d = a * x + b - cCoeff * x;
    return { question: 'Solve for x:  ' + a + 'x + ' + b + ' = ' + cCoeff + 'x + ' + d, answer: x };
  } else if (diff === 'Medium') {
    var x = randInt(-10, 10);
    var a = randNonZero(5);
    var cCoeff = randNonZero(5);
    while (cCoeff === a) cCoeff = randNonZero(5);
    var b = randInt(-15, 15);
    var d = a * x + b - cCoeff * x;
    return {
      question: 'Solve for x:  ' + fmtTerm(a, 'x') + ' + ' + paren(b) + ' = ' + fmtTerm(cCoeff, 'x') + ' + ' + paren(d),
      answer: x
    };
  } else {
    var x = randInt(-10, 10);
    var a = randNonZero(7);
    var cCoeff = randNonZero(7);
    while (cCoeff === a) cCoeff = randNonZero(7);
    var b = randInt(-25, 25);
    var d = a * x + b - cCoeff * x;
    return {
      question: 'Solve for x:  ' + fmtTerm(a, 'x') + ' + ' + paren(b) + ' = ' + fmtTerm(cCoeff, 'x') + ' + ' + paren(d),
      answer: x
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. LINEAR INEQUALITIES
// ─────────────────────────────────────────────────────────────────────────────
SUB_GENERATORS['Grade 9']['Linear Inequalities'] = {};

SUB_GENERATORS['Grade 9']['Linear Inequalities']['One-Step Inequalities'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(1, 10);
    var a = randInt(2, 5);
    var c = a * x;
    return { question: 'Solve: ' + a + 'x < ' + c + '. What is the boundary value of x?', answer: x };
  } else if (diff === 'Medium') {
    var x = randInt(-10, 10);
    var a = randNonZero(6);
    var c = a * x;
    var op = a > 0 ? '<' : '>';
    return { question: 'Solve: ' + fmtTerm(a, 'x') + ' ' + op + ' ' + c + '. What is the boundary value of x?', answer: x };
  } else {
    var x = randInt(-15, 15);
    var a = randNonZero(9);
    var c = a * x;
    var op = a > 0 ? '≤' : '≥';
    return { question: 'Solve: ' + fmtTerm(a, 'x') + ' ' + op + ' ' + c + '. What is the boundary value of x?', answer: x };
  }
};

SUB_GENERATORS['Grade 9']['Linear Inequalities']['Two-Step Inequalities'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(1, 10);
    var a = randInt(1, 5);
    var b = randInt(1, 10);
    var c = a * x + b;
    return { question: 'Solve: ' + a + 'x + ' + b + ' < ' + c + '. What is the boundary value of x?', answer: x };
  } else if (diff === 'Medium') {
    var x = randInt(-10, 10);
    var a = randNonZero(6);
    var b = randInt(-15, 15);
    var c = a * x + b;
    var op = a > 0 ? '≥' : '≤';
    return { question: 'Solve: ' + fmtTerm(a, 'x') + ' + ' + paren(b) + ' ' + op + ' ' + c + '. What is the boundary value of x?', answer: x };
  } else {
    var x = randInt(-12, 12);
    var a = randNonZero(8);
    var b = randInt(-20, 20);
    var c = a * x + b;
    var op = a > 0 ? '>' : '<';
    return { question: 'Solve: ' + fmtTerm(a, 'x') + ' + ' + paren(b) + ' ' + op + ' ' + c + '. What is the boundary value of x?', answer: x };
  }
};

SUB_GENERATORS['Grade 9']['Linear Inequalities']['Compound Inequalities'] = function(diff) {
  if (diff === 'Easy') {
    // b < x + a < c  →  boundary = lower bound
    var x = randInt(1, 8);
    var a = randInt(1, 5);
    var lo = x + a - randInt(1, 3);
    var hi = x + a + randInt(1, 5);
    return { question: 'Solve: ' + lo + ' < x + ' + a + ' < ' + hi + '. What is the lower bound of x?', answer: lo - a };
  } else if (diff === 'Medium') {
    var x = randInt(-5, 5);
    var a = randNonZero(4);
    var b = randInt(-10, 10);
    var val = a * x + b;
    var lo = val - randInt(1, 5);
    var hi = val + randInt(1, 5);
    return {
      question: 'Solve: ' + lo + ' ≤ ' + fmtTerm(a, 'x') + ' + ' + paren(b) + ' ≤ ' + hi + '. What is the lower bound of x? (Round to nearest integer if needed.)',
      answer: Math.ceil((lo - b) / a) * (a > 0 ? 1 : 1) // For positive a, lower bound = (lo-b)/a
    };
  } else {
    var x = randInt(-8, 8);
    var a = randInt(2, 6);
    var b = randInt(-15, 15);
    var val = a * x + b;
    var lo = val - randInt(1, 10);
    var hi = val + randInt(1, 10);
    // lower bound of x = (lo - b) / a
    var ans = (lo - b) / a;
    // Ensure clean answer
    var lo2 = a * randInt(-10, 0) + b;
    var hi2 = a * randInt(1, 10) + b;
    var ansClean = (lo2 - b) / a;
    return {
      question: 'Solve: ' + lo2 + ' < ' + fmtTerm(a, 'x') + ' + ' + paren(b) + ' < ' + hi2 + '. What is the lower bound of x?',
      answer: ansClean
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. SYSTEMS OF EQUATIONS
// ─────────────────────────────────────────────────────────────────────────────
SUB_GENERATORS['Grade 9']['Systems of Equations'] = {};

SUB_GENERATORS['Grade 9']['Systems of Equations']['Substitution'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(1, 5);
    var y = randInt(1, 5);
    var a = randInt(1, 3);
    return {
      question: 'y = ' + fmtTerm(a, 'x') + ' + ' + (y - a * x) + '  and  x + y = ' + (x + y) + '. What is x?',
      answer: x
    };
  } else if (diff === 'Medium') {
    var x = randInt(-5, 5);
    var y = randInt(-5, 5);
    var m = randNonZero(3);
    var b = y - m * x;
    var a2 = randInt(1, 3);
    var b2 = randNonZero(3);
    var c2 = a2 * x + b2 * y;
    return {
      question: 'y = ' + fmtTerm(m, 'x') + ' + ' + paren(b) + '  and  ' + fmtTerm(a2, 'x') + ' + ' + fmtTerm(b2, 'y') + ' = ' + c2 + '. What is x?',
      answer: x
    };
  } else {
    var x = randInt(-8, 8);
    var y = randInt(-8, 8);
    var m = randNonZero(4);
    var b = y - m * x;
    var a2 = randNonZero(4);
    var b2 = randNonZero(4);
    var c2 = a2 * x + b2 * y;
    return {
      question: 'y = ' + fmtTerm(m, 'x') + ' + ' + paren(b) + '  and  ' + fmtTerm(a2, 'x') + ' + ' + fmtTerm(b2, 'y') + ' = ' + c2 + '. What is x?',
      answer: x
    };
  }
};

SUB_GENERATORS['Grade 9']['Systems of Equations']['Elimination'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(1, 5);
    var y = randInt(1, 5);
    return {
      question: 'x + y = ' + (x + y) + '  and  x − y = ' + (x - y) + '. What is x?',
      answer: x
    };
  } else if (diff === 'Medium') {
    var x = randInt(-5, 5);
    var y = randInt(-5, 5);
    var a1 = randInt(1, 3), b1 = randNonZero(3);
    var c1 = a1 * x + b1 * y;
    var a2 = randNonZero(3), b2 = -b1; // designed so b's cancel when added
    var c2 = a2 * x + b2 * y;
    return {
      question: fmtTerm(a1, 'x') + ' + ' + fmtTerm(b1, 'y') + ' = ' + c1 +
                '  and  ' + fmtTerm(a2, 'x') + ' + ' + fmtTerm(b2, 'y') + ' = ' + c2 + '. What is x?',
      answer: x
    };
  } else {
    var x = randInt(-8, 8);
    var y = randInt(-8, 8);
    var a1 = randNonZero(4), b1 = randNonZero(4);
    var c1 = a1 * x + b1 * y;
    var a2 = randNonZero(4), b2 = randNonZero(4);
    while (a1 * b2 === a2 * b1) { a2 = randNonZero(4); b2 = randNonZero(4); }
    var c2 = a2 * x + b2 * y;
    return {
      question: fmtTerm(a1, 'x') + ' + ' + fmtTerm(b1, 'y') + ' = ' + c1 +
                '  and  ' + fmtTerm(a2, 'x') + ' + ' + fmtTerm(b2, 'y') + ' = ' + c2 + '. What is x?',
      answer: x
    };
  }
};

SUB_GENERATORS['Grade 9']['Systems of Equations']['Word Problems'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(2, 10);
    var y = randInt(2, 10);
    return {
      question: 'Apples cost $' + x + ' and bananas cost $' + y + ' each. You buy 1 apple and 1 banana for $' + (x + y) +
                '. If 2 apples cost $' + (2 * x) + ', what is the cost of one apple?',
      answer: x
    };
  } else if (diff === 'Medium') {
    var x = randInt(3, 15);
    var y = randInt(3, 15);
    var a1 = randInt(2, 4), b1 = randInt(1, 3);
    var c1 = a1 * x + b1 * y;
    var a2 = randInt(1, 3), b2 = randInt(2, 4);
    var c2 = a2 * x + b2 * y;
    return {
      question: a1 + ' notebooks and ' + b1 + ' pens cost $' + c1 + '. ' +
                a2 + ' notebooks and ' + b2 + ' pens cost $' + c2 + '. What is the price of one notebook?',
      answer: x
    };
  } else {
    var x = randInt(5, 20);
    var y = randInt(5, 20);
    var a1 = randInt(2, 5), b1 = randInt(2, 5);
    var c1 = a1 * x + b1 * y;
    var a2 = randInt(2, 5), b2 = randInt(2, 5);
    while (a1 * b2 === a2 * b1) { a2 = randInt(2, 5); b2 = randInt(2, 5); }
    var c2 = a2 * x + b2 * y;
    return {
      question: 'A store sells shirts and hats. ' + a1 + ' shirts and ' + b1 + ' hats cost $' + c1 + '. ' +
                a2 + ' shirts and ' + b2 + ' hats cost $' + c2 + '. What is the price of one shirt?',
      answer: x
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. FUNCTIONS & GRAPHING
// ─────────────────────────────────────────────────────────────────────────────
SUB_GENERATORS['Grade 9']['Functions & Graphing'] = {};

SUB_GENERATORS['Grade 9']['Functions & Graphing']['Evaluate Functions'] = function(diff) {
  if (diff === 'Easy') {
    var m = randInt(1, 5);
    var b = randInt(0, 10);
    var xVal = randInt(1, 5);
    return { question: 'f(x) = ' + fmtTerm(m, 'x') + ' + ' + b + '. Find f(' + xVal + ').', answer: m * xVal + b };
  } else if (diff === 'Medium') {
    var m = randNonZero(6);
    var b = randInt(-10, 10);
    var xVal = randInt(-5, 5);
    return { question: 'f(x) = ' + fmtTerm(m, 'x') + ' + ' + paren(b) + '. Find f(' + xVal + ').', answer: m * xVal + b };
  } else {
    var a = randNonZero(3);
    var bC = randNonZero(5);
    var c = randInt(-10, 10);
    var xVal = randInt(-4, 4);
    return {
      question: 'f(x) = ' + fmtTerm(a, 'x²') + ' + ' + fmtTerm(bC, 'x') + ' + ' + paren(c) + '. Find f(' + xVal + ').',
      answer: a * xVal * xVal + bC * xVal + c
    };
  }
};

SUB_GENERATORS['Grade 9']['Functions & Graphing']['Slope'] = function(diff) {
  if (diff === 'Easy') {
    var m = randInt(1, 5);
    var x1 = randInt(0, 3), x2 = x1 + randInt(1, 4);
    var b = randInt(0, 5);
    var y1 = m * x1 + b, y2 = m * x2 + b;
    return { question: 'Find the slope of the line through (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ').', answer: m };
  } else if (diff === 'Medium') {
    var m = randNonZero(5);
    var x1 = randInt(-5, 0), x2 = x1 + randInt(1, 5);
    var b = randInt(-10, 10);
    var y1 = m * x1 + b, y2 = m * x2 + b;
    return { question: 'Find the slope of the line through (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ').', answer: m };
  } else {
    var m = randNonZero(8);
    var x1 = randInt(-8, -1), x2 = x1 + randInt(1, 4);
    var b = randInt(-15, 15);
    var y1 = m * x1 + b, y2 = m * x2 + b;
    return { question: 'Find the slope of the line through (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ').', answer: m };
  }
};

SUB_GENERATORS['Grade 9']['Functions & Graphing']['Intercepts'] = function(diff) {
  if (diff === 'Easy') {
    // y-intercept of y = mx + b
    var m = randInt(1, 5);
    var b = randInt(1, 10);
    return { question: 'What is the y-intercept of y = ' + fmtTerm(m, 'x') + ' + ' + b + '?', answer: b };
  } else if (diff === 'Medium') {
    // x-intercept: 0 = mx + b  → x = -b/m, ensure integer
    var m = randNonZero(5);
    var x = randInt(-8, 8);
    var b = -m * x;
    return { question: 'What is the x-intercept of y = ' + fmtTerm(m, 'x') + ' + ' + paren(b) + '?', answer: x };
  } else {
    // y-intercept of ax + by = c  → y = c/b when x=0
    var b = randNonZero(4);
    var a = randNonZero(5);
    var yInt = randInt(-8, 8);
    var c = b * yInt;
    return {
      question: 'What is the y-intercept of ' + fmtTerm(a, 'x') + ' + ' + fmtTerm(b, 'y') + ' = ' + c + '?',
      answer: yInt
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. ARITHMETIC & GEOMETRIC SEQUENCES
// ─────────────────────────────────────────────────────────────────────────────
SUB_GENERATORS['Grade 9']['Arithmetic & Geometric Sequences'] = {};

SUB_GENERATORS['Grade 9']['Arithmetic & Geometric Sequences']['Arithmetic Sequences'] = function(diff) {
  if (diff === 'Easy') {
    var a1 = randInt(1, 10);
    var d = randInt(1, 5);
    var n = randInt(5, 10);
    return { question: 'Arithmetic sequence: first term = ' + a1 + ', common difference = ' + d + '. Find the ' + ordinal(n) + ' term.', answer: a1 + (n - 1) * d };
  } else if (diff === 'Medium') {
    var a1 = randInt(-10, 10);
    var d = randNonZero(5);
    var n = randInt(8, 15);
    return { question: 'Arithmetic sequence: first term = ' + a1 + ', common difference = ' + d + '. Find the ' + ordinal(n) + ' term.', answer: a1 + (n - 1) * d };
  } else {
    var a1 = randInt(-15, 15);
    var d = randNonZero(7);
    var n = randInt(10, 25);
    return { question: 'Arithmetic sequence: first term = ' + a1 + ', common difference = ' + d + '. Find the ' + ordinal(n) + ' term.', answer: a1 + (n - 1) * d };
  }
};

SUB_GENERATORS['Grade 9']['Arithmetic & Geometric Sequences']['Geometric Sequences'] = function(diff) {
  if (diff === 'Easy') {
    var a1 = randInt(1, 5);
    var r = randInt(2, 3);
    var n = randInt(3, 5);
    return { question: 'Geometric sequence: first term = ' + a1 + ', common ratio = ' + r + '. Find the ' + ordinal(n) + ' term.', answer: a1 * Math.pow(r, n - 1) };
  } else if (diff === 'Medium') {
    var a1 = randInt(1, 4);
    var r = randInt(2, 4);
    var n = randInt(4, 6);
    return { question: 'Geometric sequence: first term = ' + a1 + ', common ratio = ' + r + '. Find the ' + ordinal(n) + ' term.', answer: a1 * Math.pow(r, n - 1) };
  } else {
    var a1 = randInt(1, 3);
    var r = randNonZero(3);
    while (r === 1 || r === -1) r = randNonZero(3);
    var n = randInt(4, 6);
    return { question: 'Geometric sequence: first term = ' + a1 + ', common ratio = ' + r + '. Find the ' + ordinal(n) + ' term.', answer: a1 * Math.pow(r, n - 1) };
  }
};

SUB_GENERATORS['Grade 9']['Arithmetic & Geometric Sequences']['Sequence Sums'] = function(diff) {
  if (diff === 'Easy') {
    // Sum of first n terms of arithmetic: S = n/2 * (2a1 + (n-1)d)
    var a1 = randInt(1, 5);
    var d = randInt(1, 3);
    var n = randInt(3, 6);
    var s = n * (2 * a1 + (n - 1) * d) / 2;
    return { question: 'Arithmetic sequence: first term = ' + a1 + ', common difference = ' + d + '. Find the sum of the first ' + n + ' terms.', answer: s };
  } else if (diff === 'Medium') {
    var a1 = randInt(1, 8);
    var d = randInt(1, 5);
    var n = randInt(5, 10);
    var s = n * (2 * a1 + (n - 1) * d) / 2;
    return { question: 'Arithmetic sequence: first term = ' + a1 + ', common difference = ' + d + '. Find the sum of the first ' + n + ' terms.', answer: s };
  } else {
    var a1 = randInt(-10, 10);
    var d = randNonZero(5);
    var n = randInt(8, 15);
    var s = n * (2 * a1 + (n - 1) * d) / 2;
    return { question: 'Arithmetic sequence: first term = ' + a1 + ', common difference = ' + d + '. Find the sum of the first ' + n + ' terms.', answer: s };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPONENTS & RADICALS
// ─────────────────────────────────────────────────────────────────────────────
SUB_GENERATORS['Grade 9']['Exponents & Radicals'] = {};

SUB_GENERATORS['Grade 9']['Exponents & Radicals']['Exponent Rules'] = function(diff) {
  if (diff === 'Easy') {
    // a^m * a^n = a^(m+n)
    var base = randInt(2, 4);
    var m = randInt(1, 2);
    var n = randInt(1, 2);
    return { question: 'Simplify and evaluate: ' + base + '^' + m + ' × ' + base + '^' + n, answer: Math.pow(base, m + n) };
  } else if (diff === 'Medium') {
    // (a^m)^n = a^(mn)
    var base = randInt(2, 3);
    var m = randInt(1, 3);
    var n = randInt(1, 2);
    return { question: 'Evaluate: (' + base + '^' + m + ')^' + n, answer: Math.pow(base, m * n) };
  } else {
    // a^m / a^n = a^(m-n)
    var base = randInt(2, 4);
    var m = randInt(3, 6);
    var n = randInt(1, m - 1);
    return { question: 'Evaluate: ' + base + '^' + m + ' ÷ ' + base + '^' + n, answer: Math.pow(base, m - n) };
  }
};

SUB_GENERATORS['Grade 9']['Exponents & Radicals']['Evaluate Powers'] = function(diff) {
  if (diff === 'Easy') {
    var base = randInt(2, 5);
    var exp = randInt(2, 3);
    return { question: 'Evaluate: ' + base + '^' + exp, answer: Math.pow(base, exp) };
  } else if (diff === 'Medium') {
    var base = randInt(2, 6);
    var exp = randInt(2, 4);
    return { question: 'Evaluate: ' + base + '^' + exp, answer: Math.pow(base, exp) };
  } else {
    var base = randNonZero(4);
    var exp = randInt(2, 4);
    return { question: 'Evaluate: ' + paren(base) + '^' + exp, answer: Math.pow(base, exp) };
  }
};

SUB_GENERATORS['Grade 9']['Exponents & Radicals']['Square Roots'] = function(diff) {
  if (diff === 'Easy') {
    var root = randInt(1, 10);
    return { question: 'Evaluate: √' + (root * root), answer: root };
  } else if (diff === 'Medium') {
    var root = randInt(2, 15);
    return { question: 'Evaluate: √' + (root * root), answer: root };
  } else {
    // √(a²·b) simplified: a√b → just ask for √(perfect square)
    var root = randInt(10, 25);
    return { question: 'Evaluate: √' + (root * root), answer: root };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. POLYNOMIALS & FACTORING
// ─────────────────────────────────────────────────────────────────────────────
SUB_GENERATORS['Grade 9']['Polynomials & Factoring'] = {};

SUB_GENERATORS['Grade 9']['Polynomials & Factoring']['Evaluate Polynomials'] = function(diff) {
  if (diff === 'Easy') {
    var a = randInt(1, 3);
    var b = randInt(1, 5);
    var xVal = randInt(1, 4);
    return { question: 'Evaluate ' + fmtTerm(a, 'x') + ' + ' + b + ' when x = ' + xVal + '.', answer: a * xVal + b };
  } else if (diff === 'Medium') {
    var a = randNonZero(3);
    var b = randInt(-8, 8);
    var c = randInt(-5, 5);
    var xVal = randInt(-3, 3);
    return { question: 'Evaluate ' + fmtTerm(a, 'x²') + ' + ' + fmtTerm(b, 'x') + ' + ' + paren(c) + ' when x = ' + xVal + '.', answer: a * xVal * xVal + b * xVal + c };
  } else {
    var a = randNonZero(2);
    var b = randNonZero(4);
    var c = randInt(-8, 8);
    var d = randInt(-5, 5);
    var xVal = randInt(-3, 3);
    return {
      question: 'Evaluate ' + fmtTerm(a, 'x³') + ' + ' + fmtTerm(b, 'x²') + ' + ' + fmtTerm(c, 'x') + ' + ' + paren(d) + ' when x = ' + xVal + '.',
      answer: a * xVal * xVal * xVal + b * xVal * xVal + c * xVal + d
    };
  }
};

SUB_GENERATORS['Grade 9']['Polynomials & Factoring']['Multiply Polynomials'] = function(diff) {
  if (diff === 'Easy') {
    // (x + a)(x + b) → what is the constant term?
    var a = randInt(1, 6);
    var b = randInt(1, 6);
    return { question: 'Expand (x + ' + a + ')(x + ' + b + '). What is the constant term?', answer: a * b };
  } else if (diff === 'Medium') {
    // (x + a)(x + b) → what is the coefficient of x?
    var a = randInt(-6, 6);
    var b = randInt(-6, 6);
    return { question: 'Expand (x + ' + paren(a) + ')(x + ' + paren(b) + '). What is the coefficient of x?', answer: a + b };
  } else {
    // Full evaluation
    var p = randNonZero(3);
    var q = randInt(-5, 5);
    var r = randNonZero(3);
    var s = randInt(-5, 5);
    var xVal = randInt(-3, 3);
    var A = p * r;
    var B = p * s + q * r;
    var C = q * s;
    return {
      question: 'Evaluate (' + fmtTerm(p, 'x') + ' + ' + paren(q) + ')(' + fmtTerm(r, 'x') + ' + ' + paren(s) + ') when x = ' + xVal + '.',
      answer: (p * xVal + q) * (r * xVal + s)
    };
  }
};

SUB_GENERATORS['Grade 9']['Polynomials & Factoring']['Factor Polynomials'] = function(diff) {
  if (diff === 'Easy') {
    // x² - a² = (x+a)(x-a), what is a?
    var a = randInt(1, 10);
    return { question: 'Factor: x² − ' + (a * a) + '. This equals (x + a)(x − a). What is a?', answer: a };
  } else if (diff === 'Medium') {
    var r = randInt(1, 8);
    var s = randInt(1, 8);
    var bCoeff = -(r + s);
    var c = r * s;
    return { question: 'Solve x² + ' + paren(bCoeff) + 'x + ' + c + ' = 0. What is the smaller root?', answer: Math.min(r, s) };
  } else {
    var r = randInt(-8, 8);
    var s = randInt(-8, 8);
    while (s === r) s = randInt(-8, 8);
    var bCoeff = -(r + s);
    var c = r * s;
    return { question: 'Solve x² + ' + paren(bCoeff) + 'x + ' + paren(c) + ' = 0. What is the smaller root?', answer: Math.min(r, s) };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. QUADRATIC EQUATIONS
// ─────────────────────────────────────────────────────────────────────────────
SUB_GENERATORS['Grade 9']['Quadratic Equations'] = {};

SUB_GENERATORS['Grade 9']['Quadratic Equations']['Perfect Squares'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(1, 10);
    return { question: 'Solve: x² = ' + (x * x) + '. Give the positive root.', answer: x };
  } else if (diff === 'Medium') {
    var x = randInt(1, 12);
    var c = randInt(1, 20);
    return { question: 'Solve: x² + ' + c + ' = ' + (x * x + c) + '. Give the positive root.', answer: x };
  } else {
    var x = randInt(1, 15);
    var a = randInt(2, 4);
    return { question: 'Solve: ' + a + 'x² = ' + (a * x * x) + '. Give the positive root.', answer: x };
  }
};

SUB_GENERATORS['Grade 9']['Quadratic Equations']['Factoring Quadratics'] = function(diff) {
  if (diff === 'Easy') {
    // x(x - a) = 0 → roots 0, a
    var a = randInt(1, 10);
    return { question: 'Solve: x² − ' + a + 'x = 0. Give the non-zero root.', answer: a };
  } else if (diff === 'Medium') {
    var r = randInt(-5, 5);
    var s = randInt(-5, 5);
    while (s === r) s = randInt(-5, 5);
    var bCoeff = -(r + s);
    var c = r * s;
    return { question: 'Solve: x² + ' + paren(bCoeff) + 'x + ' + paren(c) + ' = 0. Give the larger root.', answer: Math.max(r, s) };
  } else {
    var r = randInt(-8, 8);
    var s = randInt(-8, 8);
    while (s === r) s = randInt(-8, 8);
    var a = randInt(1, 3);
    var bCoeff = -a * (r + s);
    var c = a * r * s;
    return { question: 'Solve: ' + fmtTerm(a, 'x²') + ' + ' + fmtTerm(bCoeff, 'x') + ' + ' + paren(c) + ' = 0. Give the larger root.', answer: Math.max(r, s) };
  }
};

SUB_GENERATORS['Grade 9']['Quadratic Equations']['Standard Form'] = function(diff) {
  if (diff === 'Easy') {
    // Identify a, b, or c from ax² + bx + c
    var a = randInt(1, 5);
    var b = randInt(-10, 10);
    var c = randInt(-10, 10);
    var ask = ['a', 'b', 'c'][randInt(0, 2)];
    var ans = ask === 'a' ? a : (ask === 'b' ? b : c);
    return { question: 'In the equation ' + fmtTerm(a, 'x²') + ' + ' + fmtTerm(b, 'x') + ' + ' + paren(c) + ' = 0, what is the value of ' + ask + '?', answer: ans };
  } else if (diff === 'Medium') {
    // Vertex x = -b/(2a), integer result
    var a = randInt(1, 3);
    var xv = randInt(-5, 5);
    var b = -2 * a * xv;
    var c = randInt(-10, 10);
    return { question: 'For f(x) = ' + fmtTerm(a, 'x²') + ' + ' + fmtTerm(b, 'x') + ' + ' + paren(c) + ', find the x-coordinate of the vertex.', answer: xv };
  } else {
    // Discriminant b²-4ac
    var a = randInt(1, 3);
    var b = randInt(-6, 6);
    var c = randInt(-6, 6);
    var disc = b * b - 4 * a * c;
    return { question: 'Find the discriminant of ' + fmtTerm(a, 'x²') + ' + ' + fmtTerm(b, 'x') + ' + ' + paren(c) + ' = 0.', answer: disc };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. STATISTICS & DATA ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────
SUB_GENERATORS['Grade 9']['Statistics & Data Analysis'] = {};

SUB_GENERATORS['Grade 9']['Statistics & Data Analysis']['Mean'] = function(diff) {
  if (diff === 'Easy') {
    var nums = [];
    for (var i = 0; i < 5; i++) nums.push(randInt(1, 20));
    var sum = nums.reduce(function(a, b) { return a + b; }, 0);
    var rem = sum % 5;
    nums[0] += (5 - rem) % 5;
    sum = nums.reduce(function(a, b) { return a + b; }, 0);
    return { question: 'Find the mean of: ' + nums.join(', '), answer: sum / 5 };
  } else if (diff === 'Medium') {
    var count = 6;
    var nums = [];
    for (var i = 0; i < count; i++) nums.push(randInt(1, 30));
    var sum = nums.reduce(function(a, b) { return a + b; }, 0);
    var rem = sum % count;
    nums[0] += (count - rem) % count;
    sum = nums.reduce(function(a, b) { return a + b; }, 0);
    return { question: 'Find the mean of: ' + shuffleArray(nums).join(', '), answer: sum / count };
  } else {
    var count = 8;
    var nums = [];
    for (var i = 0; i < count; i++) nums.push(randInt(-20, 40));
    var sum = nums.reduce(function(a, b) { return a + b; }, 0);
    var rem = ((sum % count) + count) % count;
    nums[0] += (count - rem) % count;
    sum = nums.reduce(function(a, b) { return a + b; }, 0);
    return { question: 'Find the mean of: ' + shuffleArray(nums).join(', '), answer: sum / count };
  }
};

SUB_GENERATORS['Grade 9']['Statistics & Data Analysis']['Median'] = function(diff) {
  if (diff === 'Easy') {
    var nums = [];
    for (var i = 0; i < 5; i++) nums.push(randInt(1, 20));
    nums.sort(function(a, b) { return a - b; });
    var ans = nums[2];
    return { question: 'Find the median of: ' + shuffleArray(nums).join(', '), answer: ans };
  } else if (diff === 'Medium') {
    var nums = [];
    for (var i = 0; i < 7; i++) nums.push(randInt(1, 30));
    nums.sort(function(a, b) { return a - b; });
    var ans = nums[3];
    return { question: 'Find the median of: ' + shuffleArray(nums).join(', '), answer: ans };
  } else {
    var nums = [];
    for (var i = 0; i < 9; i++) nums.push(randInt(-15, 40));
    nums.sort(function(a, b) { return a - b; });
    var ans = nums[4];
    return { question: 'Find the median of: ' + shuffleArray(nums).join(', '), answer: ans };
  }
};

SUB_GENERATORS['Grade 9']['Statistics & Data Analysis']['Range'] = function(diff) {
  if (diff === 'Easy') {
    var nums = [];
    for (var i = 0; i < 5; i++) nums.push(randInt(1, 20));
    return { question: 'Find the range of: ' + shuffleArray(nums).join(', '), answer: Math.max.apply(null, nums) - Math.min.apply(null, nums) };
  } else if (diff === 'Medium') {
    var nums = [];
    for (var i = 0; i < 7; i++) nums.push(randInt(-10, 30));
    return { question: 'Find the range of: ' + shuffleArray(nums).join(', '), answer: Math.max.apply(null, nums) - Math.min.apply(null, nums) };
  } else {
    var nums = [];
    for (var i = 0; i < 10; i++) nums.push(randInt(-30, 50));
    return { question: 'Find the range of: ' + shuffleArray(nums).join(', '), answer: Math.max.apply(null, nums) - Math.min.apply(null, nums) };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. GEOMETRY
// ─────────────────────────────────────────────────────────────────────────────
SUB_GENERATORS['Grade 9']['Geometry'] = {};

SUB_GENERATORS['Grade 9']['Geometry']['Area'] = function(diff) {
  if (diff === 'Easy') {
    var l = randInt(2, 10);
    var w = randInt(2, 10);
    return { question: 'Find the area of a rectangle with length ' + l + ' and width ' + w + '.', answer: l * w };
  } else if (diff === 'Medium') {
    var shapes = ['triangle', 'parallelogram'];
    var pick = shapes[randInt(0, shapes.length - 1)];
    if (pick === 'triangle') {
      var b = randInt(2, 12);
      var h = randInt(2, 12);
      // ensure even product for clean answer
      if ((b * h) % 2 !== 0) b++;
      return { question: 'Find the area of a triangle with base ' + b + ' and height ' + h + '.', answer: b * h / 2 };
    } else {
      var b = randInt(2, 12);
      var h = randInt(2, 10);
      return { question: 'Find the area of a parallelogram with base ' + b + ' and height ' + h + '.', answer: b * h };
    }
  } else {
    var shapes = ['trapezoid', 'circle'];
    var pick = shapes[randInt(0, shapes.length - 1)];
    if (pick === 'trapezoid') {
      var a = randInt(3, 10);
      var b = randInt(3, 10);
      var h = randInt(2, 8);
      if (((a + b) * h) % 2 !== 0) h = h + 1;
      return { question: 'Find the area of a trapezoid with bases ' + a + ' and ' + b + ' and height ' + h + '.', answer: (a + b) * h / 2 };
    } else {
      var r = randInt(1, 10);
      var area = Math.round(Math.PI * r * r * 100) / 100;
      return { question: 'Find the area of a circle with radius ' + r + '. (Use π ≈ 3.14, round to nearest hundredth.)', answer: Math.round(3.14 * r * r * 100) / 100 };
    }
  }
};

SUB_GENERATORS['Grade 9']['Geometry']['Volume'] = function(diff) {
  if (diff === 'Easy') {
    var s = randInt(2, 8);
    return { question: 'Find the volume of a cube with side length ' + s + '.', answer: s * s * s };
  } else if (diff === 'Medium') {
    var l = randInt(2, 8);
    var w = randInt(2, 8);
    var h = randInt(2, 8);
    return { question: 'Find the volume of a rectangular prism with length ' + l + ', width ' + w + ', and height ' + h + '.', answer: l * w * h };
  } else {
    var shapes = ['cylinder', 'prism'];
    var pick = shapes[randInt(0, shapes.length - 1)];
    if (pick === 'cylinder') {
      var r = randInt(1, 6);
      var h = randInt(2, 10);
      return { question: 'Find the volume of a cylinder with radius ' + r + ' and height ' + h + '. (Use π ≈ 3.14, round to nearest hundredth.)', answer: Math.round(3.14 * r * r * h * 100) / 100 };
    } else {
      var l = randInt(3, 10);
      var w = randInt(3, 10);
      var h = randInt(3, 10);
      return { question: 'Find the volume of a rectangular prism with length ' + l + ', width ' + w + ', and height ' + h + '.', answer: l * w * h };
    }
  }
};

SUB_GENERATORS['Grade 9']['Geometry']['Pythagorean Theorem'] = function(diff) {
  if (diff === 'Easy') {
    var triples = [[3,4,5],[6,8,10],[5,12,13]];
    var t = triples[randInt(0, triples.length - 1)];
    return { question: 'A right triangle has legs ' + t[0] + ' and ' + t[1] + '. Find the hypotenuse.', answer: t[2] };
  } else if (diff === 'Medium') {
    var triples = [[3,4,5],[5,12,13],[8,15,17],[7,24,25]];
    var t = triples[randInt(0, triples.length - 1)];
    var k = randInt(1, 3);
    return { question: 'A right triangle has legs ' + (t[0]*k) + ' and ' + (t[1]*k) + '. Find the hypotenuse.', answer: t[2] * k };
  } else {
    // Given hypotenuse and one leg, find other leg
    var triples = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[9,40,41]];
    var t = triples[randInt(0, triples.length - 1)];
    var k = randInt(1, 2);
    var legIdx = randInt(0, 1);
    var knownLeg = t[legIdx] * k;
    var hyp = t[2] * k;
    var ans = t[1 - legIdx] * k;
    return { question: 'A right triangle has hypotenuse ' + hyp + ' and one leg ' + knownLeg + '. Find the other leg.', answer: ans };
  }
};

// ═════════════════════════════════════════════════════════════════════════════
//  NEW SUB-TOPIC GENERATORS
// ═════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 1. LINEAR EQUATIONS — new sub-topics
// ─────────────────────────────────────────────────────────────────────────────

// Distributive Property:  a(bx + c) = d
SUB_GENERATORS['Grade 9']['Linear Equations']['Distributive Property'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(1, 8);
    var a = randInt(2, 4);
    var b = 1;
    var c = randInt(1, 5);
    var d = a * (b * x + c);
    return { question: 'Solve for x:  ' + a + '(x + ' + c + ') = ' + d, answer: x };
  } else if (diff === 'Medium') {
    var x = randInt(-8, 8);
    var a = randNonZero(4);
    var b = randInt(1, 3);
    var c = randInt(-8, 8);
    var d = a * (b * x + c);
    return { question: 'Solve for x:  ' + a + '(' + fmtTerm(b, 'x') + ' + ' + paren(c) + ') = ' + d, answer: x };
  } else {
    // a(bx + c) + d = e(fx + g)
    var x = randInt(-6, 6);
    var a = randNonZero(3);
    var b = randInt(1, 3);
    var c = randInt(-5, 5);
    var e = randNonZero(3);
    var f = randInt(1, 3);
    while (a * b === e * f) f = randInt(1, 3);
    var g = randInt(-5, 5);
    var left = a * (b * x + c);
    var right = e * (f * x + g);
    var d = right - left + randInt(-10, 10);
    // recalc: a(bx+c) + d2 = e(fx+g), solve: a*b*x + a*c + d2 = e*f*x + e*g
    // d2 = e*f*x + e*g - a*b*x - a*c  →  pick x, compute d2
    var d2 = (e * f - a * b) * x + e * g - a * c;
    // But we need a*b != e*f ensured above
    // rephrase: a(bx+c) + d2 = e(fx+g)
    // Actually let's keep it simpler
    var lhs = a * (b * x + c);
    var extraD = randInt(-10, 10);
    var rhs = lhs + extraD;
    return {
      question: 'Solve for x:  ' + a + '(' + fmtTerm(b, 'x') + ' + ' + paren(c) + ') + ' + paren(extraD) + ' = ' + (lhs + extraD),
      answer: x
    };
  }
};

// Word Problems (Linear Equations)
SUB_GENERATORS['Grade 9']['Linear Equations']['Word Problems'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(2, 15);
    var extra = randInt(1, 10);
    var total = x + (x + extra);
    return { question: 'Two numbers differ by ' + extra + ' and their sum is ' + total + '. What is the smaller number?', answer: x };
  } else if (diff === 'Medium') {
    var age = randInt(5, 15);
    var parentExtra = randInt(20, 30);
    var years = randInt(2, 8);
    var futureSum = (age + years) + (age + parentExtra + years);
    return {
      question: 'A child is ' + age + ' years old and their parent is ' + (age + parentExtra) + ' years old. In how many years will their ages sum to ' + futureSum + '?',
      answer: years
    };
  } else {
    var x = randInt(5, 30);
    var rate1 = randInt(2, 6);
    var rate2 = randInt(2, 6);
    while (rate2 === rate1) rate2 = randInt(2, 6);
    var start = randInt(10, 50);
    var total = start + rate1 * x;
    return {
      question: 'A tank has ' + start + ' gallons. Water flows in at ' + rate1 + ' gallons/min. After how many minutes will it have ' + total + ' gallons?',
      answer: x
    };
  }
};

// Absolute Value Equations:  |ax + b| = c
SUB_GENERATORS['Grade 9']['Linear Equations']['Absolute Value Equations'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(1, 10);
    var c = x;
    return { question: 'Solve: |x| = ' + c + '. Give the positive solution.', answer: x };
  } else if (diff === 'Medium') {
    var x = randInt(1, 10);
    var b = randInt(-8, 8);
    var c = Math.abs(x + b);
    // |x + b| = c → x + b = c → x = c - b (positive solution)
    return { question: 'Solve: |x + ' + paren(b) + '| = ' + c + '. Give the larger solution.', answer: c - b };
  } else {
    var x = randInt(1, 12);
    var a = randInt(2, 5);
    var b = randInt(-10, 10);
    var c = Math.abs(a * x + b);
    // |ax + b| = c → ax + b = c → x = (c - b)/a  (larger solution)
    var sol1 = (c - b) / a;
    var sol2 = (-c - b) / a;
    var ans = Math.max(sol1, sol2);
    // Ensure clean answer
    if (ans !== Math.round(ans)) {
      x = randInt(1, 8);
      a = 2;
      b = randInt(-6, 6);
      if (b % 2 !== 0) b++;
      c = Math.abs(a * x + b);
      sol1 = (c - b) / a;
      sol2 = (-c - b) / a;
      ans = Math.max(sol1, sol2);
    }
    return { question: 'Solve: |' + fmtTerm(a, 'x') + ' + ' + paren(b) + '| = ' + c + '. Give the larger solution.', answer: ans };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. LINEAR INEQUALITIES — new sub-topics
// ─────────────────────────────────────────────────────────────────────────────

// Word Problems (Linear Inequalities)
SUB_GENERATORS['Grade 9']['Linear Inequalities']['Word Problems'] = function(diff) {
  if (diff === 'Easy') {
    var pricePerItem = randInt(2, 5);
    var budget = pricePerItem * randInt(3, 10);
    var maxItems = budget / pricePerItem;
    return { question: 'Each toy costs $' + pricePerItem + '. You have $' + budget + '. What is the maximum number of toys you can buy?', answer: maxItems };
  } else if (diff === 'Medium') {
    var base = randInt(10, 30);
    var perUnit = randInt(2, 8);
    var limit = randInt(50, 100);
    // base + perUnit * x ≤ limit → x ≤ (limit - base)/perUnit
    var x = Math.floor((limit - base) / perUnit);
    return {
      question: 'A phone plan costs $' + base + '/month plus $' + perUnit + '/GB of data. Your budget is $' + limit + '/month. What is the max whole GB you can use?',
      answer: x
    };
  } else {
    var fixed = randInt(50, 200);
    var perItem = randInt(5, 20);
    var sellPrice = perItem + randInt(5, 15);
    // To profit: sellPrice * x > fixed + perItem * x → (sellPrice - perItem) * x > fixed → x > fixed/(sellPrice - perItem)
    var margin = sellPrice - perItem;
    // Ensure clean division
    var remainder = fixed % margin;
    if (remainder !== 0) fixed = fixed - remainder + margin;
    var breakEven = fixed / margin;
    return {
      question: 'Making widgets costs $' + fixed + ' fixed + $' + perItem + ' each. You sell them for $' + sellPrice + ' each. How many must you sell to break even? (Minimum whole number)',
      answer: breakEven + 1
    };
  }
};

// Absolute Value Inequalities
SUB_GENERATORS['Grade 9']['Linear Inequalities']['Absolute Value Inequalities'] = function(diff) {
  if (diff === 'Easy') {
    var c = randInt(2, 10);
    return { question: 'Solve: |x| < ' + c + '. What is the upper bound of x?', answer: c };
  } else if (diff === 'Medium') {
    var b = randInt(-8, 8);
    var c = randInt(2, 10);
    // |x + b| ≤ c → -c ≤ x + b ≤ c → -c - b ≤ x ≤ c - b
    return { question: 'Solve: |x + ' + paren(b) + '| ≤ ' + c + '. What is the upper bound of x?', answer: c - b };
  } else {
    var a = randInt(2, 5);
    var b = randInt(-10, 10);
    var c = randInt(5, 20);
    // |ax + b| < c → -c < ax + b < c → (-c-b)/a < x < (c-b)/a
    // Ensure clean answer: c - b must be divisible by a
    while ((c - b) % a !== 0) c++;
    return { question: 'Solve: |' + fmtTerm(a, 'x') + ' + ' + paren(b) + '| < ' + c + '. What is the upper bound of x?', answer: (c - b) / a };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. SYSTEMS OF EQUATIONS — new sub-topics
// ─────────────────────────────────────────────────────────────────────────────

// Number of Solutions (0, 1, or infinite — answer 0, 1, or -1 for infinite)
SUB_GENERATORS['Grade 9']['Systems of Equations']['Number of Solutions'] = function(diff) {
  if (diff === 'Easy') {
    // Always one solution (intersecting lines)
    var m1 = randInt(1, 5);
    var m2 = randInt(1, 5);
    while (m2 === m1) m2 = randInt(1, 5);
    var b1 = randInt(0, 5);
    var b2 = randInt(0, 5);
    return { question: 'How many solutions?  y = ' + fmtTerm(m1, 'x') + ' + ' + b1 + '  and  y = ' + fmtTerm(m2, 'x') + ' + ' + b2 + '  (Answer 0, 1, or -1 for infinite)', answer: 1 };
  } else if (diff === 'Medium') {
    var type = randInt(0, 2); // 0 = one, 1 = none, 2 = infinite
    var m = randInt(1, 5);
    var b1 = randInt(1, 10);
    if (type === 0) {
      var m2 = randInt(1, 5);
      while (m2 === m) m2 = randInt(1, 5);
      return { question: 'How many solutions?  y = ' + fmtTerm(m, 'x') + ' + ' + b1 + '  and  y = ' + fmtTerm(m2, 'x') + ' + ' + randInt(1, 10) + '  (Answer 0, 1, or -1 for infinite)', answer: 1 };
    } else if (type === 1) {
      var b2 = b1 + randInt(1, 5);
      return { question: 'How many solutions?  y = ' + fmtTerm(m, 'x') + ' + ' + b1 + '  and  y = ' + fmtTerm(m, 'x') + ' + ' + b2 + '  (Answer 0, 1, or -1 for infinite)', answer: 0 };
    } else {
      return { question: 'How many solutions?  y = ' + fmtTerm(m, 'x') + ' + ' + b1 + '  and  2y = ' + fmtTerm(2 * m, 'x') + ' + ' + (2 * b1) + '  (Answer 0, 1, or -1 for infinite)', answer: -1 };
    }
  } else {
    var type = randInt(0, 2);
    var a1 = randInt(1, 4), b1v = randNonZero(4), c1 = randInt(-10, 10);
    if (type === 0) {
      var a2 = randNonZero(4), b2v = randNonZero(4);
      while (a1 * b2v === a2 * b1v) { a2 = randNonZero(4); b2v = randNonZero(4); }
      var c2 = randInt(-10, 10);
      return { question: 'How many solutions?  ' + fmtTerm(a1, 'x') + ' + ' + fmtTerm(b1v, 'y') + ' = ' + c1 + '  and  ' + fmtTerm(a2, 'x') + ' + ' + fmtTerm(b2v, 'y') + ' = ' + c2 + '  (Answer 0, 1, or -1 for infinite)', answer: 1 };
    } else if (type === 1) {
      var k = randInt(2, 3);
      var c2 = c1 * k + randNonZero(5);
      return { question: 'How many solutions?  ' + fmtTerm(a1, 'x') + ' + ' + fmtTerm(b1v, 'y') + ' = ' + c1 + '  and  ' + fmtTerm(a1 * k, 'x') + ' + ' + fmtTerm(b1v * k, 'y') + ' = ' + c2 + '  (Answer 0, 1, or -1 for infinite)', answer: 0 };
    } else {
      var k = randInt(2, 3);
      return { question: 'How many solutions?  ' + fmtTerm(a1, 'x') + ' + ' + fmtTerm(b1v, 'y') + ' = ' + c1 + '  and  ' + fmtTerm(a1 * k, 'x') + ' + ' + fmtTerm(b1v * k, 'y') + ' = ' + (c1 * k) + '  (Answer 0, 1, or -1 for infinite)', answer: -1 };
    }
  }
};

// Find Both Variables — asks for x + y
SUB_GENERATORS['Grade 9']['Systems of Equations']['Find Both Variables'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(1, 8);
    var y = randInt(1, 8);
    return {
      question: 'x + y = ' + (x + y) + '  and  x − y = ' + (x - y) + '. What is x + 2y?',
      answer: x + 2 * y
    };
  } else if (diff === 'Medium') {
    var x = randInt(-5, 5);
    var y = randInt(-5, 5);
    var a1 = randInt(1, 3), b1 = randNonZero(3);
    var c1 = a1 * x + b1 * y;
    var a2 = randNonZero(3), b2 = randInt(1, 3);
    var c2 = a2 * x + b2 * y;
    return {
      question: fmtTerm(a1, 'x') + ' + ' + fmtTerm(b1, 'y') + ' = ' + c1 + '  and  ' + fmtTerm(a2, 'x') + ' + ' + fmtTerm(b2, 'y') + ' = ' + c2 + '. What is x · y (x times y)?',
      answer: x * y
    };
  } else {
    var x = randInt(-6, 6);
    var y = randInt(-6, 6);
    var a1 = randNonZero(4), b1 = randNonZero(4);
    var c1 = a1 * x + b1 * y;
    var a2 = randNonZero(4), b2 = randNonZero(4);
    while (a1 * b2 === a2 * b1) { a2 = randNonZero(4); b2 = randNonZero(4); }
    var c2 = a2 * x + b2 * y;
    return {
      question: fmtTerm(a1, 'x') + ' + ' + fmtTerm(b1, 'y') + ' = ' + c1 + '  and  ' + fmtTerm(a2, 'x') + ' + ' + fmtTerm(b2, 'y') + ' = ' + c2 + '. What is x² + y²?',
      answer: x * x + y * y
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. FUNCTIONS & GRAPHING — new sub-topics
// ─────────────────────────────────────────────────────────────────────────────

// Rate of Change
SUB_GENERATORS['Grade 9']['Functions & Graphing']['Rate of Change'] = function(diff) {
  if (diff === 'Easy') {
    var rate = randInt(2, 8);
    var x1 = randInt(0, 3), x2 = x1 + randInt(1, 4);
    var b = randInt(0, 10);
    var y1 = rate * x1 + b, y2 = rate * x2 + b;
    return { question: 'A plant was ' + y1 + ' cm at week ' + x1 + ' and ' + y2 + ' cm at week ' + x2 + '. What is the rate of change (cm/week)?', answer: rate };
  } else if (diff === 'Medium') {
    var rate = randNonZero(6);
    var x1 = randInt(1, 5), x2 = x1 + randInt(2, 5);
    var b = randInt(-10, 20);
    var y1 = rate * x1 + b, y2 = rate * x2 + b;
    return { question: 'Temperature was ' + y1 + '°F at hour ' + x1 + ' and ' + y2 + '°F at hour ' + x2 + '. What is the rate of change (°F/hour)?', answer: rate };
  } else {
    var rate = randNonZero(8);
    var x1 = randInt(-3, 3), x2 = x1 + randInt(1, 4);
    var b = randInt(-20, 20);
    var y1 = rate * x1 + b, y2 = rate * x2 + b;
    return { question: 'f(' + x1 + ') = ' + y1 + ' and f(' + x2 + ') = ' + y2 + '. What is the average rate of change?', answer: rate };
  }
};

// Function Composition: f(g(x))
SUB_GENERATORS['Grade 9']['Functions & Graphing']['Function Composition'] = function(diff) {
  if (diff === 'Easy') {
    var a = randInt(1, 3), b = randInt(1, 5);
    var c = randInt(1, 3), d = randInt(1, 5);
    var xVal = randInt(1, 4);
    var gx = c * xVal + d;
    var fgx = a * gx + b;
    return { question: 'f(x) = ' + fmtTerm(a, 'x') + ' + ' + b + '  and  g(x) = ' + fmtTerm(c, 'x') + ' + ' + d + '. Find f(g(' + xVal + ')).', answer: fgx };
  } else if (diff === 'Medium') {
    var a = randNonZero(4), b = randInt(-5, 5);
    var c = randNonZero(3), d = randInt(-5, 5);
    var xVal = randInt(-3, 3);
    var gx = c * xVal + d;
    var fgx = a * gx + b;
    return { question: 'f(x) = ' + fmtTerm(a, 'x') + ' + ' + paren(b) + '  and  g(x) = ' + fmtTerm(c, 'x') + ' + ' + paren(d) + '. Find f(g(' + xVal + ')).', answer: fgx };
  } else {
    var a = randInt(1, 3), b = randInt(-5, 5);
    var c = randNonZero(3), d = randInt(-5, 5);
    var xVal = randInt(-3, 3);
    var gx = c * xVal + d;
    var fgx = a * gx * gx + b;
    return { question: 'f(x) = ' + fmtTerm(a, 'x²') + ' + ' + paren(b) + '  and  g(x) = ' + fmtTerm(c, 'x') + ' + ' + paren(d) + '. Find f(g(' + xVal + ')).', answer: fgx };
  }
};

// Linear vs Nonlinear — given table or equation, is it linear? (1 = yes, 0 = no)
SUB_GENERATORS['Grade 9']['Functions & Graphing']['Linear vs Nonlinear'] = function(diff) {
  if (diff === 'Easy') {
    var isLinear = randInt(0, 1);
    if (isLinear) {
      var m = randInt(1, 5), b = randInt(0, 5);
      return { question: 'Is y = ' + fmtTerm(m, 'x') + ' + ' + b + ' a linear function? (1 = yes, 0 = no)', answer: 1 };
    } else {
      var a = randInt(1, 3), b = randInt(0, 5);
      return { question: 'Is y = ' + fmtTerm(a, 'x²') + ' + ' + b + ' a linear function? (1 = yes, 0 = no)', answer: 0 };
    }
  } else if (diff === 'Medium') {
    var isLinear = randInt(0, 1);
    if (isLinear) {
      var m = randNonZero(5), b = randInt(-5, 5);
      var vals = [];
      for (var i = 0; i < 4; i++) vals.push(m * i + b);
      return { question: 'x: 0, 1, 2, 3  →  y: ' + vals.join(', ') + '. Is this linear? (1 = yes, 0 = no)', answer: 1 };
    } else {
      var a = randInt(1, 3);
      var vals = [];
      for (var i = 0; i < 4; i++) vals.push(a * i * i);
      return { question: 'x: 0, 1, 2, 3  →  y: ' + vals.join(', ') + '. Is this linear? (1 = yes, 0 = no)', answer: 0 };
    }
  } else {
    var isLinear = randInt(0, 1);
    if (isLinear) {
      var a = randNonZero(4), b = randNonZero(3), c = randInt(-5, 5);
      return { question: 'Is ' + fmtTerm(a, 'x') + ' + ' + fmtTerm(b, 'y') + ' = ' + c + ' a linear equation? (1 = yes, 0 = no)', answer: 1 };
    } else {
      var choices = [
        { eq: 'xy = ' + randInt(2, 20), ans: 0 },
        { eq: 'y = ' + randInt(2, 4) + '^x', ans: 0 },
        { eq: 'y = √x + ' + randInt(1, 5), ans: 0 }
      ];
      var pick = choices[randInt(0, choices.length - 1)];
      return { question: 'Is ' + pick.eq + ' a linear equation? (1 = yes, 0 = no)', answer: pick.ans };
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. SEQUENCES — new sub-topics
// ─────────────────────────────────────────────────────────────────────────────

// Find Common Difference
SUB_GENERATORS['Grade 9']['Arithmetic & Geometric Sequences']['Find Common Difference'] = function(diff) {
  if (diff === 'Easy') {
    var a1 = randInt(1, 10);
    var d = randInt(1, 8);
    return { question: 'Arithmetic sequence: ' + a1 + ', ' + (a1 + d) + ', ' + (a1 + 2 * d) + ', ' + (a1 + 3 * d) + ', ... What is the common difference?', answer: d };
  } else if (diff === 'Medium') {
    var a1 = randInt(-10, 10);
    var d = randNonZero(6);
    return { question: 'Arithmetic sequence: ' + a1 + ', ' + (a1 + d) + ', ' + (a1 + 2 * d) + ', ... What is the common difference?', answer: d };
  } else {
    var a1 = randInt(-15, 15);
    var d = randNonZero(8);
    var n = randInt(6, 12);
    var an = a1 + (n - 1) * d;
    return { question: 'An arithmetic sequence has a₁ = ' + a1 + ' and a' + n + ' = ' + an + '. What is the common difference?', answer: d };
  }
};

// Find Common Ratio
SUB_GENERATORS['Grade 9']['Arithmetic & Geometric Sequences']['Find Common Ratio'] = function(diff) {
  if (diff === 'Easy') {
    var a1 = randInt(1, 5);
    var r = randInt(2, 4);
    return { question: 'Geometric sequence: ' + a1 + ', ' + (a1 * r) + ', ' + (a1 * r * r) + ', ... What is the common ratio?', answer: r };
  } else if (diff === 'Medium') {
    var a1 = randInt(1, 4);
    var r = randNonZero(3);
    while (r === 1 || r === -1) r = randNonZero(3);
    return { question: 'Geometric sequence: ' + a1 + ', ' + (a1 * r) + ', ' + (a1 * r * r) + ', ' + (a1 * r * r * r) + ', ... What is the common ratio?', answer: r };
  } else {
    var a1 = randInt(1, 3);
    var r = randInt(2, 5);
    var n = randInt(3, 5);
    var an = a1 * Math.pow(r, n - 1);
    return { question: 'A geometric sequence has a₁ = ' + a1 + ' and a' + n + ' = ' + an + '. What is the common ratio?', answer: r };
  }
};

// Missing Terms
SUB_GENERATORS['Grade 9']['Arithmetic & Geometric Sequences']['Missing Terms'] = function(diff) {
  if (diff === 'Easy') {
    var a1 = randInt(1, 10);
    var d = randInt(1, 5);
    // ___, a2, a3 → find a1
    return { question: 'Arithmetic sequence: ___, ' + (a1 + d) + ', ' + (a1 + 2 * d) + ', ' + (a1 + 3 * d) + '. What is the missing first term?', answer: a1 };
  } else if (diff === 'Medium') {
    var a1 = randInt(1, 5);
    var r = randInt(2, 3);
    // a1, ___, a3 → find a2
    var a2 = a1 * r;
    return { question: 'Geometric sequence: ' + a1 + ', ___, ' + (a1 * r * r) + ', ' + (a1 * r * r * r) + '. What is the missing second term?', answer: a2 };
  } else {
    var a1 = randInt(-8, 8);
    var d = randNonZero(5);
    // a1, a2, ___, a4, a5 → find a3
    var a3 = a1 + 2 * d;
    return {
      question: 'Arithmetic sequence: ' + a1 + ', ' + (a1 + d) + ', ___, ' + (a1 + 3 * d) + ', ' + (a1 + 4 * d) + '. What is the missing term?',
      answer: a3
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPONENTS & RADICALS — new sub-topics
// ─────────────────────────────────────────────────────────────────────────────

// Negative Exponents
SUB_GENERATORS['Grade 9']['Exponents & Radicals']['Negative Exponents'] = function(diff) {
  if (diff === 'Easy') {
    // a^(-1) = 1/a → express as fraction: answer = a (we ask "what is the denominator")
    var a = randInt(2, 10);
    return { question: a + '^(−1) = 1/?. What goes in place of the question mark?', answer: a };
  } else if (diff === 'Medium') {
    // a^(-2) = 1/a² → answer is a²
    var a = randInt(2, 5);
    return { question: a + '^(−2) = 1/?. What goes in place of the question mark?', answer: a * a };
  } else {
    // (a/b)^(-1) = b/a → answer is b when asked "what is the numerator?"
    var a = randInt(2, 6);
    var b = randInt(2, 6);
    while (b === a) b = randInt(2, 6);
    return { question: '(' + a + '/' + b + ')^(−1) = ?/' + a + '. What is the numerator?', answer: b };
  }
};

// Scientific Notation
SUB_GENERATORS['Grade 9']['Exponents & Radicals']['Scientific Notation'] = function(diff) {
  if (diff === 'Easy') {
    // What power of 10? e.g., 3000 = 3 × 10^?
    var coeff = randInt(1, 9);
    var exp = randInt(1, 4);
    var num = coeff * Math.pow(10, exp);
    return { question: num + ' = ' + coeff + ' × 10^?. What is the exponent?', answer: exp };
  } else if (diff === 'Medium') {
    var coeff = randInt(1, 9);
    var exp1 = randInt(2, 5);
    var exp2 = randInt(2, 5);
    // (coeff × 10^exp1) × 10^exp2 = coeff × 10^(exp1+exp2)
    return { question: '(' + coeff + ' × 10^' + exp1 + ') × 10^' + exp2 + ' = ' + coeff + ' × 10^?. What is the exponent?', answer: exp1 + exp2 };
  } else {
    // Multiply two sci-notation numbers, find exponent
    var c1 = randInt(1, 9), e1 = randInt(2, 5);
    var c2 = randInt(1, 9), e2 = randInt(2, 5);
    var product = c1 * c2;
    var expSum = e1 + e2;
    // Adjust if product ≥ 10
    if (product >= 10) expSum++;
    return {
      question: '(' + c1 + ' × 10^' + e1 + ') × (' + c2 + ' × 10^' + e2 + '). What is the exponent in scientific notation? (Product coefficient adjusted to be 1-9)',
      answer: expSum
    };
  }
};

// Cube Roots
SUB_GENERATORS['Grade 9']['Exponents & Radicals']['Cube Roots'] = function(diff) {
  if (diff === 'Easy') {
    var n = randInt(1, 5);
    return { question: 'Evaluate: ∛' + (n * n * n), answer: n };
  } else if (diff === 'Medium') {
    var n = randInt(2, 8);
    return { question: 'Evaluate: ∛' + (n * n * n), answer: n };
  } else {
    var n = randInt(2, 10);
    return { question: 'Evaluate: ∛' + (n * n * n), answer: n };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. POLYNOMIALS & FACTORING — new sub-topics
// ─────────────────────────────────────────────────────────────────────────────

// Add & Subtract Polynomials
SUB_GENERATORS['Grade 9']['Polynomials & Factoring']['Add & Subtract Polynomials'] = function(diff) {
  if (diff === 'Easy') {
    // (ax + b) + (cx + d) → coefficient of x
    var a = randInt(1, 5), b = randInt(1, 5);
    var c = randInt(1, 5), d = randInt(1, 5);
    return { question: '(' + fmtTerm(a, 'x') + ' + ' + b + ') + (' + fmtTerm(c, 'x') + ' + ' + d + '). What is the coefficient of x?', answer: a + c };
  } else if (diff === 'Medium') {
    // (ax² + bx + c) + (dx² + ex + f) → coefficient of x²
    var a = randNonZero(4), b = randInt(-5, 5), c = randInt(-5, 5);
    var d = randNonZero(4), e = randInt(-5, 5), f = randInt(-5, 5);
    return {
      question: '(' + fmtTerm(a, 'x²') + ' + ' + fmtTerm(b, 'x') + ' + ' + paren(c) + ') + (' + fmtTerm(d, 'x²') + ' + ' + fmtTerm(e, 'x') + ' + ' + paren(f) + '). What is the coefficient of x²?',
      answer: a + d
    };
  } else {
    // Subtraction: (ax² + bx + c) − (dx² + ex + f) → coefficient of x
    var a = randNonZero(5), b = randNonZero(6), c = randInt(-8, 8);
    var d = randNonZero(5), e = randNonZero(6), f = randInt(-8, 8);
    return {
      question: '(' + fmtTerm(a, 'x²') + ' + ' + fmtTerm(b, 'x') + ' + ' + paren(c) + ') − (' + fmtTerm(d, 'x²') + ' + ' + fmtTerm(e, 'x') + ' + ' + paren(f) + '). What is the coefficient of x?',
      answer: b - e
    };
  }
};

// GCF Factoring
SUB_GENERATORS['Grade 9']['Polynomials & Factoring']['GCF Factoring'] = function(diff) {
  if (diff === 'Easy') {
    // ax + ab = a(x + b), what is the GCF?
    var a = randInt(2, 6);
    var b = randInt(1, 8);
    return { question: 'Factor out the GCF from ' + (a) + 'x + ' + (a * b) + '. What is the GCF?', answer: a };
  } else if (diff === 'Medium') {
    var gcf = randInt(2, 5);
    var a = randInt(1, 4);
    var b = randInt(1, 6);
    return { question: 'Factor out the GCF from ' + (gcf * a) + 'x² + ' + (gcf * b) + 'x. What is the GCF?', answer: gcf };
  } else {
    var gcf = randInt(2, 6);
    var a = randInt(1, 5);
    var b = randInt(1, 5);
    var c = randInt(1, 5);
    return {
      question: 'Factor out the GCF from ' + (gcf * a) + 'x³ + ' + (gcf * b) + 'x² + ' + (gcf * c) + 'x. What is the GCF?',
      answer: gcf
    };
  }
};

// Degree & Leading Coefficient
SUB_GENERATORS['Grade 9']['Polynomials & Factoring']['Degree & Leading Coefficient'] = function(diff) {
  if (diff === 'Easy') {
    var a = randInt(1, 5), b = randInt(-5, 5);
    var deg = 1;
    return { question: 'What is the degree of ' + fmtTerm(a, 'x') + ' + ' + paren(b) + '?', answer: deg };
  } else if (diff === 'Medium') {
    var a = randNonZero(4), b = randInt(-8, 8), c = randInt(-8, 8);
    return { question: 'What is the leading coefficient of ' + fmtTerm(a, 'x²') + ' + ' + fmtTerm(b, 'x') + ' + ' + paren(c) + '?', answer: a };
  } else {
    var a = randNonZero(3), b = randNonZero(4), c = randInt(-8, 8), d = randInt(-5, 5);
    var deg = 3;
    var askDeg = randInt(0, 1);
    if (askDeg) {
      return { question: 'What is the degree of ' + fmtTerm(a, 'x³') + ' + ' + fmtTerm(b, 'x²') + ' + ' + fmtTerm(c, 'x') + ' + ' + paren(d) + '?', answer: deg };
    } else {
      return { question: 'What is the leading coefficient of ' + fmtTerm(a, 'x³') + ' + ' + fmtTerm(b, 'x²') + ' + ' + fmtTerm(c, 'x') + ' + ' + paren(d) + '?', answer: a };
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. QUADRATIC EQUATIONS — new sub-topics
// ─────────────────────────────────────────────────────────────────────────────

// Vertex Form: y = a(x-h)² + k
SUB_GENERATORS['Grade 9']['Quadratic Equations']['Vertex Form'] = function(diff) {
  if (diff === 'Easy') {
    var h = randInt(0, 5);
    var k = randInt(0, 10);
    return { question: 'In y = (x − ' + h + ')² + ' + k + ', what is the y-coordinate of the vertex?', answer: k };
  } else if (diff === 'Medium') {
    var a = randNonZero(3);
    var h = randInt(-5, 5);
    var k = randInt(-10, 10);
    return { question: 'In y = ' + fmtTerm(a, '(x − ' + paren(h) + ')²') + ' + ' + paren(k) + ', what is the x-coordinate of the vertex?', answer: h };
  } else {
    // Convert vertex form to standard, find constant
    var a = randInt(1, 3);
    var h = randInt(-4, 4);
    var k = randInt(-10, 10);
    // y = a(x-h)² + k = ax² - 2ahx + ah² + k
    var c = a * h * h + k;
    return { question: 'Expand y = ' + a + '(x − ' + paren(h) + ')² + ' + paren(k) + ' to standard form ax² + bx + c. What is c?', answer: c };
  }
};

// Complete the Square
SUB_GENERATORS['Grade 9']['Quadratic Equations']['Complete the Square'] = function(diff) {
  if (diff === 'Easy') {
    // x² + bx + ? is a perfect square when ? = (b/2)²
    var half = randInt(1, 6);
    var b = 2 * half;
    return { question: 'x² + ' + b + 'x + ? is a perfect square trinomial. What is ??', answer: half * half };
  } else if (diff === 'Medium') {
    var half = randInt(-6, 6);
    while (half === 0) half = randInt(-6, 6);
    var b = 2 * half;
    return { question: 'x² + ' + paren(b) + 'x + ? is a perfect square trinomial. What is ??', answer: half * half };
  } else {
    // Solve by completing the square: x² + bx + c = 0 → give larger root
    var r = randInt(-8, 8);
    var s = randInt(-8, 8);
    while (s === r) s = randInt(-8, 8);
    // Make sure (r+s) is even for clean half
    if ((r + s) % 2 !== 0) s++;
    while (s === r) s++;
    var bCoeff = -(r + s);
    var c = r * s;
    return {
      question: 'Complete the square to solve: x² + ' + paren(bCoeff) + 'x + ' + paren(c) + ' = 0. Give the larger root.',
      answer: Math.max(r, s)
    };
  }
};

// Quadratic Word Problems
SUB_GENERATORS['Grade 9']['Quadratic Equations']['Quadratic Word Problems'] = function(diff) {
  if (diff === 'Easy') {
    var side = randInt(2, 10);
    return { question: 'A square has area ' + (side * side) + '. What is the side length?', answer: side };
  } else if (diff === 'Medium') {
    // Rectangle: length = width + k, area = A
    var w = randInt(3, 10);
    var k = randInt(1, 5);
    var l = w + k;
    var area = w * l;
    return { question: 'A rectangle\'s length is ' + k + ' more than its width. Its area is ' + area + '. What is the width?', answer: w };
  } else {
    // Projectile: h = -16t² + vt + h0 → when h = 0 (positive time)
    var t = randInt(1, 5);
    // h = -16t² + v*t → at t, h = 0 → v = 16t
    var v = 16 * t;
    return {
      question: 'A ball is thrown upward with h(t) = −16t² + ' + v + 't. At what positive time t does it hit the ground (h = 0)?',
      answer: t
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. STATISTICS & DATA ANALYSIS — new sub-topics
// ─────────────────────────────────────────────────────────────────────────────

// Mode
SUB_GENERATORS['Grade 9']['Statistics & Data Analysis']['Mode'] = function(diff) {
  if (diff === 'Easy') {
    var mode = randInt(1, 10);
    var nums = [mode, mode];
    for (var i = 0; i < 3; i++) {
      var v = randInt(1, 15);
      while (v === mode) v = randInt(1, 15);
      nums.push(v);
    }
    return { question: 'Find the mode of: ' + shuffleArray(nums).join(', '), answer: mode };
  } else if (diff === 'Medium') {
    var mode = randInt(1, 20);
    var nums = [mode, mode, mode];
    for (var i = 0; i < 4; i++) {
      var v = randInt(1, 25);
      while (v === mode) v = randInt(1, 25);
      nums.push(v);
    }
    return { question: 'Find the mode of: ' + shuffleArray(nums).join(', '), answer: mode };
  } else {
    var mode = randInt(-10, 20);
    var nums = [mode, mode, mode];
    for (var i = 0; i < 5; i++) {
      var v = randInt(-10, 30);
      while (v === mode) v = randInt(-10, 30);
      nums.push(v);
    }
    return { question: 'Find the mode of: ' + shuffleArray(nums).join(', '), answer: mode };
  }
};

// Weighted Average
SUB_GENERATORS['Grade 9']['Statistics & Data Analysis']['Weighted Average'] = function(diff) {
  if (diff === 'Easy') {
    // Two tests with equal weight
    var s1 = randInt(60, 100);
    var s2 = randInt(60, 100);
    if ((s1 + s2) % 2 !== 0) s2++;
    return { question: 'You scored ' + s1 + ' and ' + s2 + ' on two equally weighted tests. What is your average?', answer: (s1 + s2) / 2 };
  } else if (diff === 'Medium') {
    // Weighted: test 60%, quiz 40%
    var test = randInt(5, 10) * 10;
    var quiz = randInt(5, 10) * 10;
    var avg = test * 0.6 + quiz * 0.4;
    return { question: 'Test score: ' + test + ' (weight 60%). Quiz score: ' + quiz + ' (weight 40%). What is the weighted average?', answer: avg };
  } else {
    // Three categories
    var hw = randInt(7, 10) * 10;    // 20%
    var quiz = randInt(6, 10) * 10;  // 30%
    var exam = randInt(5, 10) * 10;  // 50%
    var avg = hw * 0.2 + quiz * 0.3 + exam * 0.5;
    return {
      question: 'Homework: ' + hw + ' (20%), Quizzes: ' + quiz + ' (30%), Exam: ' + exam + ' (50%). What is the weighted average?',
      answer: avg
    };
  }
};

// Five-Number Summary — find Q1, Q3, or IQR
SUB_GENERATORS['Grade 9']['Statistics & Data Analysis']['Five-Number Summary'] = function(diff) {
  if (diff === 'Easy') {
    // Give sorted data, ask for min
    var nums = [];
    for (var i = 0; i < 5; i++) nums.push(randInt(1, 20));
    nums.sort(function(a, b) { return a - b; });
    return { question: 'Data: ' + nums.join(', ') + '. What is the minimum value?', answer: nums[0] };
  } else if (diff === 'Medium') {
    // 7 values → Q1 is median of lower half
    var nums = [];
    for (var i = 0; i < 7; i++) nums.push(randInt(1, 30));
    nums.sort(function(a, b) { return a - b; });
    // Lower half: [0,1,2], Q1 = nums[1]; Upper half: [4,5,6], Q3 = nums[5]
    var askQ1 = randInt(0, 1);
    if (askQ1) {
      return { question: 'Data: ' + shuffleArray(nums).join(', ') + '. What is Q1 (first quartile)?', answer: nums[1] };
    } else {
      return { question: 'Data: ' + shuffleArray(nums).join(', ') + '. What is Q3 (third quartile)?', answer: nums[5] };
    }
  } else {
    // IQR = Q3 - Q1
    var nums = [];
    for (var i = 0; i < 7; i++) nums.push(randInt(1, 40));
    nums.sort(function(a, b) { return a - b; });
    var q1 = nums[1], q3 = nums[5];
    return { question: 'Data: ' + shuffleArray(nums).join(', ') + '. What is the IQR (interquartile range)?', answer: q3 - q1 };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. GEOMETRY — new sub-topics
// ─────────────────────────────────────────────────────────────────────────────

// Perimeter
SUB_GENERATORS['Grade 9']['Geometry']['Perimeter'] = function(diff) {
  if (diff === 'Easy') {
    var l = randInt(2, 12);
    var w = randInt(2, 12);
    return { question: 'Find the perimeter of a rectangle with length ' + l + ' and width ' + w + '.', answer: 2 * (l + w) };
  } else if (diff === 'Medium') {
    var shapes = ['triangle', 'square'];
    var pick = shapes[randInt(0, shapes.length - 1)];
    if (pick === 'triangle') {
      var a = randInt(3, 12), b = randInt(3, 12), c = randInt(3, 12);
      // ensure valid triangle
      while (a + b <= c || a + c <= b || b + c <= a) c = randInt(3, 12);
      return { question: 'Find the perimeter of a triangle with sides ' + a + ', ' + b + ', and ' + c + '.', answer: a + b + c };
    } else {
      var s = randInt(2, 15);
      return { question: 'Find the perimeter of a square with side length ' + s + '.', answer: 4 * s };
    }
  } else {
    // Composite shape: rectangle with a triangle on top
    var l = randInt(4, 10);
    var w = randInt(3, 8);
    var triSide = randInt(3, 8);
    // Perimeter = 2w + l + 2*triSide (rectangle base is covered by triangle base)
    // Actually let's keep it simpler: regular polygon
    var sides = [5, 6, 8][randInt(0, 2)];
    var sideLen = randInt(3, 10);
    return { question: 'Find the perimeter of a regular ' + sides + '-sided polygon with side length ' + sideLen + '.', answer: sides * sideLen };
  }
};

// Surface Area
SUB_GENERATORS['Grade 9']['Geometry']['Surface Area'] = function(diff) {
  if (diff === 'Easy') {
    var s = randInt(2, 8);
    return { question: 'Find the surface area of a cube with side length ' + s + '.', answer: 6 * s * s };
  } else if (diff === 'Medium') {
    var l = randInt(2, 8);
    var w = randInt(2, 8);
    var h = randInt(2, 8);
    var sa = 2 * (l * w + l * h + w * h);
    return { question: 'Find the surface area of a rectangular prism with length ' + l + ', width ' + w + ', and height ' + h + '.', answer: sa };
  } else {
    // Sphere: SA = 4πr²
    var r = randInt(1, 8);
    var sa = Math.round(4 * 3.14 * r * r * 100) / 100;
    return { question: 'Find the surface area of a sphere with radius ' + r + '. (Use π ≈ 3.14, round to nearest hundredth.)', answer: sa };
  }
};

// Circumference & Circles
SUB_GENERATORS['Grade 9']['Geometry']['Circumference & Circles'] = function(diff) {
  if (diff === 'Easy') {
    // C = 2πr
    var r = randInt(1, 10);
    var c = Math.round(2 * 3.14 * r * 100) / 100;
    return { question: 'Find the circumference of a circle with radius ' + r + '. (Use π ≈ 3.14)', answer: c };
  } else if (diff === 'Medium') {
    // C = πd
    var d = randInt(2, 20);
    var c = Math.round(3.14 * d * 100) / 100;
    return { question: 'Find the circumference of a circle with diameter ' + d + '. (Use π ≈ 3.14)', answer: c };
  } else {
    // Given circumference, find radius: r = C / (2π)
    var r = randInt(2, 12);
    var circ = Math.round(2 * 3.14 * r * 100) / 100;
    return { question: 'A circle has circumference ' + circ + '. What is its radius? (Use π ≈ 3.14)', answer: r };
  }
};
// ═══════════════════════════════════════════════════════════════════════════
//  GRADE 7 GENERATORS
// ═══════════════════════════════════════════════════════════════════════════
SUB_GENERATORS['Grade 7'] = {};

// ═══════════════════════════════════════════════════════════════════════════
//  Ratios & Proportional Relationships
// ═══════════════════════════════════════════════════════════════════════════
SUB_GENERATORS['Grade 7']['Ratios & Proportional Relationships'] = {};

SUB_GENERATORS['Grade 7']['Ratios & Proportional Relationships']['Unit Rates'] = function(diff) {
  if (diff === 'Easy') {
    var answer = randInt(2, 8);
    var items = randInt(2, 6);
    var totalPrice = answer * items;
    return { question: 'If ' + items + ' items cost $' + totalPrice + ', what is the cost per item?', answer: answer };
  } else if (diff === 'Medium') {
    var answer = randInt(3, 15);
    var miles = answer * randInt(4, 8);
    var hours = miles / answer;
    return { question: 'A car travels ' + miles + ' miles in ' + hours + ' hours. What is the speed in miles per hour?', answer: answer };
  } else {
    var answer = Math.round(randInt(8, 25) * 100) / 100;
    var pounds = randInt(3, 7);
    var totalCost = Math.round(answer * pounds * 100) / 100;
    return { question: 'If ' + pounds + ' pounds of apples cost $' + totalCost + ', what is the price per pound?', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Ratios & Proportional Relationships']['Proportions'] = function(diff) {
  if (diff === 'Easy') {
    var answer = randInt(4, 12);
    var a = randInt(2, 5);
    var b = a * randInt(2, 4);
    var c = answer;
    var d = b * c / a;
    return { question: 'Solve for x: ' + a + '/' + b + ' = x/' + d, answer: answer };
  } else if (diff === 'Medium') {
    var answer = randInt(6, 20);
    var a = randInt(3, 8);
    var b = answer;
    var c = a * randInt(3, 6);
    var d = c * b / a;
    return { question: 'If ' + a + ' notebooks cost $' + c + ', how many notebooks can you buy for $' + d + '?', answer: answer };
  } else {
    var answer = randInt(15, 35);
    var ratio1 = randInt(2, 5);
    var ratio2 = randInt(3, 7);
    var total = answer;
    var part1 = ratio1 * total / (ratio1 + ratio2);
    return { question: 'Two numbers are in the ratio ' + ratio1 + ':' + ratio2 + '. If their sum is ' + (ratio1 + ratio2) * (total / (ratio1 + ratio2)) + ', find the smaller number.', answer: Math.round(part1 * 100) / 100 };
  }
};

SUB_GENERATORS['Grade 7']['Ratios & Proportional Relationships']['Percent Problems'] = function(diff) {
  if (diff === 'Easy') {
    var whole = randInt(20, 100);
    var percent = randInt(2, 5) * 10;
    var answer = Math.round(whole * percent / 100 * 100) / 100;
    return { question: 'What is ' + percent + '% of ' + whole + '?', answer: answer };
  } else if (diff === 'Medium') {
    var answer = randInt(40, 80);
    var percent = randInt(4, 8) * 10;
    var whole = Math.round(answer * 100 / percent);
    return { question: percent + '% of what number is ' + answer + '?', answer: whole };
  } else {
    var part = randInt(15, 45);
    var whole = randInt(50, 120);
    var answer = Math.round(part / whole * 100 * 100) / 100;
    return { question: part + ' is what percent of ' + whole + '?', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Ratios & Proportional Relationships']['Percent Change'] = function(diff) {
  if (diff === 'Easy') {
    var original = randInt(20, 60);
    var percentIncrease = randInt(2, 5) * 10;
    var answer = Math.round(original * (1 + percentIncrease / 100) * 100) / 100;
    return { question: 'A shirt costs $' + original + '. After a ' + percentIncrease + '% price increase, what is the new price?', answer: answer };
  } else if (diff === 'Medium') {
    var original = randInt(40, 100);
    var percentDecrease = randInt(15, 35);
    var answer = Math.round(original * (1 - percentDecrease / 100) * 100) / 100;
    return { question: 'A $' + original + ' item is on sale for ' + percentDecrease + '% off. What is the sale price?', answer: answer };
  } else {
    var original = randInt(80, 150);
    var newPrice = randInt(100, 200);
    var answer = Math.round(Math.abs(newPrice - original) / original * 100 * 100) / 100;
    return { question: 'A price changed from $' + original + ' to $' + newPrice + '. What is the percent change?', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Ratios & Proportional Relationships']['Scale Drawings'] = function(diff) {
  if (diff === 'Easy') {
    var scale = randInt(2, 5);
    var drawingLength = randInt(3, 8);
    var answer = drawingLength * scale;
    return { question: 'On a scale drawing, 1 inch represents ' + scale + ' feet. If a wall is ' + drawingLength + ' inches on the drawing, what is the actual length in feet?', answer: answer };
  } else if (diff === 'Medium') {
    var answer = randInt(4, 12);
    var scale = randInt(5, 10);
    var actualLength = answer * scale;
    return { question: 'A map uses a scale of 1 cm = ' + scale + ' km. If two cities are ' + actualLength + ' km apart, how far apart are they on the map in cm?', answer: answer };
  } else {
    var scaleNum = randInt(1, 3);
    var scaleDenom = randInt(20, 50);
    var drawingInches = randInt(4, 10);
    var answer = Math.round(drawingInches * scaleDenom / scaleNum * 100) / 100;
    return { question: 'A blueprint has a scale of ' + scaleNum + ':' + scaleDenom + '. If a room measures ' + drawingInches + ' inches on the blueprint, what is the actual length in inches?', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Ratios & Proportional Relationships']['Constant of Proportionality'] = function(diff) {
  if (diff === 'Easy') {
    var answer = randInt(3, 9);
    var x = randInt(2, 5);
    var y = answer * x;
    return { question: 'If y = ' + y + ' when x = ' + x + ' in the equation y = kx, what is k?', answer: answer };
  } else if (diff === 'Medium') {
    var answer = Math.round(randInt(5, 15) / 2 * 100) / 100;
    var hours = randInt(4, 8);
    var earnings = Math.round(answer * hours * 100) / 100;
    return { question: 'A worker earns $' + earnings + ' for ' + hours + ' hours of work. What is the hourly rate (constant of proportionality)?', answer: answer };
  } else {
    var answer = Math.round(randInt(10, 30) / 3 * 100) / 100;
    var gallons = randInt(5, 12);
    var miles = Math.round(answer * gallons * 100) / 100;
    return { question: 'A car travels ' + miles + ' miles using ' + gallons + ' gallons of gas. What is the constant of proportionality (miles per gallon)?', answer: answer };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  The Number System
// ═══════════════════════════════════════════════════════════════════════════
SUB_GENERATORS['Grade 7']['The Number System'] = {};

SUB_GENERATORS['Grade 7']['The Number System']['Adding Integers'] = function(diff) {
  if (diff === 'Easy') {
    var a = randInt(1, 15);
    var b = randInt(1, 15);
    var answer = a + b;
    return { question: 'Calculate: ' + a + ' + ' + b, answer: answer };
  } else if (diff === 'Medium') {
    var a = randInt(5, 25);
    var b = -randInt(5, 25);
    var answer = a + b;
    return { question: 'Calculate: ' + a + ' + ' + paren(b), answer: answer };
  } else {
    var a = -randInt(10, 40);
    var b = -randInt(10, 40);
    var answer = a + b;
    return { question: 'Calculate: ' + paren(a) + ' + ' + paren(b), answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['The Number System']['Subtracting Integers'] = function(diff) {
  if (diff === 'Easy') {
    var a = randInt(10, 25);
    var b = randInt(1, 10);
    var answer = a - b;
    return { question: 'Calculate: ' + a + ' - ' + b, answer: answer };
  } else if (diff === 'Medium') {
    var a = randInt(5, 20);
    var b = randInt(15, 35);
    var answer = a - b;
    return { question: 'Calculate: ' + a + ' - ' + b, answer: answer };
  } else {
    var a = -randInt(10, 30);
    var b = randInt(10, 30);
    var answer = a - b;
    return { question: 'Calculate: ' + paren(a) + ' - ' + b, answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['The Number System']['Multiplying & Dividing Integers'] = function(diff) {
  if (diff === 'Easy') {
    var a = randInt(2, 9);
    var b = randInt(2, 9);
    var answer = a * b;
    return { question: 'Calculate: ' + a + ' × ' + b, answer: answer };
  } else if (diff === 'Medium') {
    var a = randInt(3, 12);
    var b = -randInt(3, 12);
    var answer = a * b;
    return { question: 'Calculate: ' + a + ' × ' + paren(b), answer: answer };
  } else {
    var answer = randInt(4, 15);
    var b = -randInt(3, 9);
    var a = answer * b;
    return { question: 'Calculate: ' + a + ' ÷ ' + paren(b), answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['The Number System']['Operations with Fractions'] = function(diff) {
  if (diff === 'Easy') {
    var denom = randInt(2, 6) * 2;
    var num1 = randInt(1, denom - 1);
    var num2 = randInt(1, denom - 1);
    var answer = Math.round((num1 + num2) / denom * 100) / 100;
    return { question: 'Calculate: ' + num1 + '/' + denom + ' + ' + num2 + '/' + denom, answer: answer };
  } else if (diff === 'Medium') {
    var a = randInt(1, 4);
    var b = randInt(2, 6);
    var c = randInt(1, 4);
    var d = randInt(2, 6);
    var answer = Math.round((a * d + c * b) / (b * d) * 100) / 100;
    return { question: 'Calculate: ' + a + '/' + b + ' + ' + c + '/' + d, answer: answer };
  } else {
    var a = randInt(2, 5);
    var b = randInt(2, 6);
    var c = randInt(2, 5);
    var d = randInt(2, 6);
    var answer = Math.round((a * c) / (b * d) * 100) / 100;
    return { question: 'Calculate: ' + a + '/' + b + ' × ' + c + '/' + d, answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['The Number System']['Operations with Decimals'] = function(diff) {
  if (diff === 'Easy') {
    var a = Math.round(randInt(10, 50) / 10 * 100) / 100;
    var b = Math.round(randInt(10, 50) / 10 * 100) / 100;
    var answer = Math.round((a + b) * 100) / 100;
    return { question: 'Calculate: ' + a + ' + ' + b, answer: answer };
  } else if (diff === 'Medium') {
    var a = Math.round(randInt(20, 80) / 10 * 100) / 100;
    var b = Math.round(randInt(10, 40) / 10 * 100) / 100;
    var answer = Math.round((a * b) * 100) / 100;
    return { question: 'Calculate: ' + a + ' × ' + b, answer: answer };
  } else {
    var answer = Math.round(randInt(15, 45) / 10 * 100) / 100;
    var b = Math.round(randInt(20, 60) / 10 * 100) / 100;
    var a = Math.round(answer * b * 100) / 100;
    return { question: 'Calculate: ' + a + ' ÷ ' + b, answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['The Number System']['Converting Fractions & Decimals'] = function(diff) {
  if (diff === 'Easy') {
    var denom = [2, 4, 5, 10][randInt(0, 3)];
    var num = randInt(1, denom - 1);
    var answer = Math.round(num / denom * 100) / 100;
    return { question: 'Convert ' + num + '/' + denom + ' to a decimal.', answer: answer };
  } else if (diff === 'Medium') {
    var denom = [8, 20, 25][randInt(0, 2)];
    var num = randInt(1, denom - 1);
    var answer = Math.round(num / denom * 100) / 100;
    return { question: 'Convert ' + num + '/' + denom + ' to a decimal.', answer: answer };
  } else {
    var decimals = [0.125, 0.375, 0.625, 0.875, 0.05, 0.15, 0.35, 0.45];
    var fractions = [1/8, 3/8, 5/8, 7/8, 1/20, 3/20, 7/20, 9/20];
    var denominators = [8, 8, 8, 8, 20, 20, 20, 20];
    var numerators = [1, 3, 5, 7, 1, 3, 7, 9];
    var idx = randInt(0, decimals.length - 1);
    var answer = numerators[idx];
    return { question: 'Convert ' + decimals[idx] + ' to a fraction in lowest terms. What is the numerator?', answer: answer };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  Expressions & Equations
// ═══════════════════════════════════════════════════════════════════════════
SUB_GENERATORS['Grade 7']['Expressions & Equations'] = {};

SUB_GENERATORS['Grade 7']['Expressions & Equations']['Combining Like Terms'] = function(diff) {
  if (diff === 'Easy') {
    var a = randInt(2, 8);
    var b = randInt(2, 8);
    var answer = a + b;
    return { question: 'Simplify: ' + a + 'x + ' + b + 'x. What is the coefficient of x?', answer: answer };
  } else if (diff === 'Medium') {
    var a = randInt(3, 10);
    var b = randInt(2, 8);
    var c = randInt(2, 9);
    var answer = a - b;
    return { question: 'Simplify: ' + a + 'x - ' + b + 'x + ' + c + '. What is the coefficient of x?', answer: answer };
  } else {
    var a = randInt(5, 12);
    var b = -randInt(3, 8);
    var c = randInt(2, 7);
    var answer = a + b + c;
    return { question: 'Simplify: ' + a + 'y + ' + paren(b) + 'y + ' + c + 'y. What is the coefficient of y?', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Expressions & Equations']['Distributive Property'] = function(diff) {
  if (diff === 'Easy') {
    var a = randInt(2, 6);
    var b = randInt(2, 8);
    var answer = a * b;
    return { question: 'Expand: ' + a + '(' + b + ' + x). What is the constant term?', answer: answer };
  } else if (diff === 'Medium') {
    var a = randInt(3, 8);
    var b = randInt(2, 7);
    var c = randInt(2, 6);
    var answer = a * b;
    return { question: 'Expand: ' + a + '(' + b + 'x + ' + c + '). What is the coefficient of x?', answer: answer };
  } else {
    var a = -randInt(2, 6);
    var b = randInt(3, 9);
    var c = randInt(2, 8);
    var answer = a * c;
    return { question: 'Expand: ' + paren(a) + '(' + b + 'x + ' + c + '). What is the constant term?', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Expressions & Equations']['One-Step Equations'] = function(diff) {
  if (diff === 'Easy') {
    var answer = randInt(3, 15);
    var b = randInt(5, 20);
    var c = answer + b;
    return { question: 'Solve for x: x + ' + b + ' = ' + c, answer: answer };
  } else if (diff === 'Medium') {
    var answer = randInt(4, 20);
    var a = randInt(2, 8);
    var product = a * answer;
    return { question: 'Solve for x: ' + a + 'x = ' + product, answer: answer };
  } else {
    var answer = randInt(5, 25);
    var b = randInt(10, 30);
    var c = answer - b;
    return { question: 'Solve for x: x - ' + b + ' = ' + c, answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Expressions & Equations']['Two-Step Equations'] = function(diff) {
  if (diff === 'Easy') {
    var answer = randInt(3, 12);
    var a = randInt(2, 5);
    var b = randInt(3, 10);
    var c = a * answer + b;
    return { question: 'Solve for x: ' + a + 'x + ' + b + ' = ' + c, answer: answer };
  } else if (diff === 'Medium') {
    var answer = randInt(5, 18);
    var a = randInt(3, 7);
    var b = randInt(5, 15);
    var c = a * answer - b;
    return { question: 'Solve for x: ' + a + 'x - ' + b + ' = ' + c, answer: answer };
  } else {
    var answer = -randInt(2, 10);
    var a = randInt(2, 6);
    var b = randInt(4, 12);
    var c = a * answer + b;
    return { question: 'Solve for x: ' + a + 'x + ' + b + ' = ' + c, answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Expressions & Equations']['One-Step Inequalities'] = function(diff) {
  if (diff === 'Easy') {
    var answer = randInt(5, 20);
    var b = randInt(3, 15);
    var c = answer + b;
    return { question: 'Solve for x: x + ' + b + ' < ' + c + '. What is the boundary value?', answer: answer };
  } else if (diff === 'Medium') {
    var answer = randInt(6, 24);
    var a = randInt(2, 6);
    var product = a * answer;
    return { question: 'Solve for x: ' + a + 'x ≥ ' + product + '. What is the boundary value?', answer: answer };
  } else {
    var answer = randInt(8, 30);
    var b = randInt(5, 20);
    var c = answer - b;
    return { question: 'Solve for x: x - ' + b + ' > ' + c + '. What is the boundary value?', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Expressions & Equations']['Word Problems'] = function(diff) {
  if (diff === 'Easy') {
    var answer = randInt(8, 25);
    var cost = randInt(3, 8);
    var total = answer * cost;
    return { question: 'Sarah bought some pencils for $' + cost + ' each and spent $' + total + ' total. How many pencils did she buy?', answer: answer };
  } else if (diff === 'Medium') {
    var answer = randInt(12, 35);
    var initial = randInt(50, 100);
    var final = initial + answer;
    return { question: 'Tom had ' + initial + ' marbles. After receiving some more, he has ' + final + ' marbles. How many did he receive?', answer: answer };
  } else {
    var answer = randInt(15, 40);
    var multiplier = randInt(2, 5);
    var total = answer + multiplier * answer;
    return { question: 'The sum of a number and ' + multiplier + ' times that number is ' + total + '. What is the number?', answer: answer };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  Geometry
// ═══════════════════════════════════════════════════════════════════════════
SUB_GENERATORS['Grade 7']['Geometry'] = {};

SUB_GENERATORS['Grade 7']['Geometry']['Area of Triangles'] = function(diff) {
  if (diff === 'Easy') {
    var base = randInt(4, 12);
    var height = randInt(4, 10);
    var answer = Math.round(base * height / 2 * 100) / 100;
    return { question: 'Find the area of a triangle with base ' + base + ' cm and height ' + height + ' cm.', answer: answer };
  } else if (diff === 'Medium') {
    var base = randInt(8, 20);
    var height = randInt(6, 15);
    var answer = Math.round(base * height / 2 * 100) / 100;
    return { question: 'A triangle has a base of ' + base + ' inches and a height of ' + height + ' inches. What is its area?', answer: answer };
  } else {
    var answer = randInt(40, 100);
    var base = randInt(8, 16);
    var height = Math.round(2 * answer / base * 100) / 100;
    return { question: 'A triangle has an area of ' + answer + ' square units and a base of ' + base + ' units. What is its height?', answer: height };
  }
};

SUB_GENERATORS['Grade 7']['Geometry']['Area of Circles'] = function(diff) {
  if (diff === 'Easy') {
    var radius = randInt(3, 8);
    var answer = Math.round(3.14 * radius * radius * 100) / 100;
    return { question: 'Find the area of a circle with radius ' + radius + ' cm. (Use π = 3.14)', answer: answer };
  } else if (diff === 'Medium') {
    var radius = randInt(5, 12);
    var answer = Math.round(3.14 * radius * radius * 100) / 100;
    return { question: 'A circle has a radius of ' + radius + ' meters. What is its area? (Use π = 3.14)', answer: answer };
  } else {
    var diameter = randInt(10, 20);
    var radius = diameter / 2;
    var answer = Math.round(3.14 * radius * radius * 100) / 100;
    return { question: 'Find the area of a circle with diameter ' + diameter + ' inches. (Use π = 3.14)', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Geometry']['Circumference'] = function(diff) {
  if (diff === 'Easy') {
    var radius = randInt(4, 10);
    var answer = Math.round(2 * 3.14 * radius * 100) / 100;
    return { question: 'Find the circumference of a circle with radius ' + radius + ' cm. (Use π = 3.14)', answer: answer };
  } else if (diff === 'Medium') {
    var diameter = randInt(8, 16);
    var answer = Math.round(3.14 * diameter * 100) / 100;
    return { question: 'A circle has a diameter of ' + diameter + ' meters. What is its circumference? (Use π = 3.14)', answer: answer };
  } else {
    var answer = randInt(5, 15);
    var circumference = Math.round(2 * 3.14 * answer * 100) / 100;
    return { question: 'A circle has a circumference of ' + circumference + ' cm. What is its radius? (Use π = 3.14)', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Geometry']['Angle Relationships'] = function(diff) {
  if (diff === 'Easy') {
    var answer = randInt(30, 80);
    var complement = 90 - answer;
    return { question: 'Two angles are complementary. If one angle is ' + complement + '°, what is the other angle?', answer: answer };
  } else if (diff === 'Medium') {
    var answer = randInt(45, 135);
    var supplement = 180 - answer;
    return { question: 'Two angles are supplementary. If one angle is ' + supplement + '°, what is the other angle?', answer: answer };
  } else {
    var answer = randInt(25, 75);
    var vertical = answer;
    return { question: 'Two lines intersect forming vertical angles. If one angle is ' + vertical + '°, what is its vertical angle?', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Geometry']['Cross-Sections'] = function(diff) {
  if (diff === 'Easy') {
    var answer = 4;
    return { question: 'A cube is sliced parallel to one of its faces. How many sides does the cross-section have?', answer: answer };
  } else if (diff === 'Medium') {
    var answer = 3;
    return { question: 'A triangular prism is sliced perpendicular to its triangular base. How many sides does the cross-section have?', answer: answer };
  } else {
    var answer = randInt(5, 8);
    return { question: 'A pyramid with a ' + answer + '-sided base is sliced parallel to the base. How many sides does the cross-section have?', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Geometry']['Area of Composite Shapes'] = function(diff) {
  if (diff === 'Easy') {
    var l1 = randInt(5, 10);
    var w1 = randInt(4, 8);
    var l2 = randInt(3, 7);
    var w2 = randInt(3, 6);
    var answer = l1 * w1 + l2 * w2;
    return { question: 'A composite shape consists of two rectangles: one with dimensions ' + l1 + ' × ' + w1 + ' and another with dimensions ' + l2 + ' × ' + w2 + '. What is the total area?', answer: answer };
  } else if (diff === 'Medium') {
    var length = randInt(10, 18);
    var width = randInt(8, 14);
    var radius = randInt(2, 4);
    var answer = Math.round((length * width - 3.14 * radius * radius) * 100) / 100;
    return { question: 'A ' + length + ' × ' + width + ' rectangle has a circular hole with radius ' + radius + ' cut out. What is the remaining area? (Use π = 3.14)', answer: answer };
  } else {
    var rectLength = randInt(12, 20);
    var rectWidth = randInt(8, 14);
    var triBase = randInt(6, 10);
    var triHeight = randInt(5, 9);
    var answer = Math.round(rectLength * rectWidth + triBase * triHeight / 2 * 100) / 100;
    return { question: 'A shape consists of a rectangle (' + rectLength + ' × ' + rectWidth + ') with a triangle (base ' + triBase + ', height ' + triHeight + ') attached. What is the total area?', answer: answer };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  Statistics & Probability
// ═══════════════════════════════════════════════════════════════════════════
SUB_GENERATORS['Grade 7']['Statistics & Probability'] = {};

SUB_GENERATORS['Grade 7']['Statistics & Probability']['Mean, Median & Mode'] = function(diff) {
  if (diff === 'Easy') {
    var values = [randInt(5, 15), randInt(5, 15), randInt(5, 15), randInt(5, 15), randInt(5, 15)];
    var sum = values.reduce(function(a, b) { return a + b; }, 0);
    var answer = Math.round(sum / values.length * 100) / 100;
    return { question: 'Find the mean of: ' + values.join(', '), answer: answer };
  } else if (diff === 'Medium') {
    var v1 = randInt(10, 30);
    var v2 = randInt(10, 30);
    var v3 = randInt(10, 30);
    var v4 = randInt(10, 30);
    var v5 = randInt(10, 30);
    var values = [v1, v2, v3, v4, v5].sort(function(a, b) { return a - b; });
    var answer = values[2];
    return { question: 'Find the median of: ' + values.join(', '), answer: answer };
  } else {
    var mode = randInt(15, 35);
    var v1 = randInt(10, 25);
    var v2 = randInt(20, 40);
    var answer = mode;
    return { question: 'Find the mode of: ' + v1 + ', ' + mode + ', ' + v2 + ', ' + mode + ', ' + (mode + 5), answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Statistics & Probability']['Mean Absolute Deviation'] = function(diff) {
  if (diff === 'Easy') {
    var mean = randInt(10, 20);
    var values = [mean - 2, mean - 1, mean, mean + 1, mean + 2];
    var deviations = values.map(function(v) { return Math.abs(v - mean); });
    var answer = Math.round(deviations.reduce(function(a, b) { return a + b; }, 0) / values.length * 100) / 100;
    return { question: 'Find the mean absolute deviation of: ' + values.join(', '), answer: answer };
  } else if (diff === 'Medium') {
    var values = [10, 12, 15, 18, 20];
    var mean = 15;
    var deviations = values.map(function(v) { return Math.abs(v - mean); });
    var answer = Math.round(deviations.reduce(function(a, b) { return a + b; }, 0) / values.length * 100) / 100;
    return { question: 'Find the mean absolute deviation of: ' + values.join(', '), answer: answer };
  } else {
    var values = [5, 10, 15, 20, 25, 30];
    var sum = values.reduce(function(a, b) { return a + b; }, 0);
    var mean = Math.round(sum / values.length * 100) / 100;
    var deviations = values.map(function(v) { return Math.abs(v - mean); });
    var answer = Math.round(deviations.reduce(function(a, b) { return a + b; }, 0) / values.length * 100) / 100;
    return { question: 'Find the mean absolute deviation of: ' + values.join(', '), answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Statistics & Probability']['Simple Probability'] = function(diff) {
  if (diff === 'Easy') {
    var favorable = randInt(1, 4);
    var total = randInt(6, 10);
    var answer = Math.round(favorable / total * 100) / 100;
    return { question: 'A bag contains ' + total + ' marbles, ' + favorable + ' are red. What is the probability of drawing a red marble?', answer: answer };
  } else if (diff === 'Medium') {
    var red = randInt(3, 7);
    var blue = randInt(4, 8);
    var total = red + blue;
    var answer = Math.round(red / total * 100) / 100;
    return { question: 'A bag has ' + red + ' red marbles and ' + blue + ' blue marbles. What is the probability of drawing a red marble?', answer: answer };
  } else {
    var sides = randInt(8, 12);
    var answer = Math.round(1 / sides * 100) / 100;
    return { question: 'What is the probability of rolling a specific number on a ' + sides + '-sided die?', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Statistics & Probability']['Compound Probability'] = function(diff) {
  if (diff === 'Easy') {
    var p1 = 1 / 2;
    var p2 = 1 / 2;
    var answer = Math.round(p1 * p2 * 100) / 100;
    return { question: 'What is the probability of flipping heads twice in a row?', answer: answer };
  } else if (diff === 'Medium') {
    var sides = 6;
    var p1 = 1 / sides;
    var p2 = 1 / sides;
    var answer = Math.round(p1 * p2 * 100) / 100;
    return { question: 'What is the probability of rolling a 3 twice in a row on a standard die?', answer: answer };
  } else {
    var red1 = randInt(2, 5);
    var total1 = randInt(8, 12);
    var red2 = red1 - 1;
    var total2 = total1 - 1;
    var answer = Math.round((red1 / total1) * (red2 / total2) * 100) / 100;
    return { question: 'A bag has ' + red1 + ' red marbles and ' + (total1 - red1) + ' blue marbles. What is the probability of drawing 2 red marbles without replacement?', answer: answer };
  }
};

SUB_GENERATORS['Grade 7']['Statistics & Probability']['Sampling & Predictions'] = function(diff) {
  if (diff === 'Easy') {
    var sampleSize = randInt(20, 40);
    var favorable = randInt(5, 15);
    var population = randInt(100, 200);
    var answer = Math.round(favorable / sampleSize * population * 100) / 100;
    return { question: 'In a sample of ' + sampleSize + ' students, ' + favorable + ' prefer pizza. Predict how many in a population of ' + population + ' prefer pizza.', answer: answer };
  } else if (diff === 'Medium') {
    var sampleSize = randInt(50, 100);
    var favorable = randInt(15, 35);
    var population = randInt(300, 500);
    var answer = Math.round(favorable / sampleSize * population * 100) / 100;
    return { question: 'A survey of ' + sampleSize + ' people found ' + favorable + ' like a product. Predict how many in ' + population + ' people would like it.', answer: answer };
  } else {
    var sampleSize = randInt(80, 150);
    var percent = randInt(20, 60);
    var favorable = Math.round(sampleSize * percent / 100);
    var population = randInt(500, 1000);
    var answer = Math.round(favorable / sampleSize * population * 100) / 100;
    return { question: 'In a sample of ' + sampleSize + ' voters, ' + favorable + ' support a candidate. Predict support in a population of ' + population + '.', answer: answer };
  }
};
SUB_GENERATORS['Grade 8'] = {};

// ============================================================================
// THE NUMBER SYSTEM
// ============================================================================
SUB_GENERATORS['Grade 8']['The Number System'] = {};

SUB_GENERATORS['Grade 8']['The Number System']['Rational vs Irrational'] = function(diff) {
  var types = ['rational', 'irrational'];
  var type = types[randInt(0, 1)];
  var question, answer;

  if (type === 'rational') {
    answer = 1;
    var choices = [
      randInt(1, 100) + '',
      randInt(1, 20) + '/' + randInt(2, 20),
      '0.' + randInt(1, 9),
      '-' + randInt(1, 50)
    ];
    var num = choices[randInt(0, 3)];
    question = 'Is ' + num + ' rational or irrational? (1=rational, 0=irrational)';
  } else {
    answer = 0;
    var sqrts = ['√2', '√3', '√5', '√7', '√11', '√13'];
    var num = sqrts[randInt(0, 5)];
    question = 'Is ' + num + ' rational or irrational? (1=rational, 0=irrational)';
  }

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['The Number System']['Approximating Square Roots'] = function(diff) {
  var maxNum = diff === 'Easy' ? 50 : diff === 'Medium' ? 100 : 200;
  var n = randInt(2, maxNum);

  // Make sure n is not a perfect square
  var sqrt = Math.sqrt(n);
  while (sqrt === Math.floor(sqrt)) {
    n = randInt(2, maxNum);
    sqrt = Math.sqrt(n);
  }

  var answer = Math.floor(sqrt);
  var question = 'What is the greatest integer less than √' + n + '? (Answer with the integer only)';

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['The Number System']['Comparing Real Numbers'] = function(diff) {
  var nums = [];

  if (diff === 'Easy') {
    nums = [randInt(1, 20), randInt(1, 20), randInt(1, 20)];
  } else if (diff === 'Medium') {
    nums = [
      randInt(1, 10),
      Math.sqrt(randInt(2, 100)),
      randInt(1, 10) + 0.5
    ];
  } else {
    nums = [
      Math.sqrt(randInt(10, 50)),
      randInt(5, 15) / 3,
      Math.PI * randInt(1, 3)
    ];
  }

  var sorted = nums.slice().sort(function(a, b) { return a - b; });
  var answer = sorted[0];
  answer = Math.round(answer * 100) / 100;

  var numStrs = [];
  for (var i = 0; i < nums.length; i++) {
    numStrs.push(Math.round(nums[i] * 100) / 100);
  }

  var question = 'Which is the smallest number among: ' + numStrs.join(', ') + '?';

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['The Number System']['Operations with Radicals'] = function(diff) {
  var ops = ['+', '-', '*'];
  var op = ops[randInt(0, 2)];
  var answer;

  if (op === '+' || op === '-') {
    var coeff1 = randInt(1, 5);
    var coeff2 = randInt(1, 5);
    var radical = randInt(2, 10);

    if (op === '+') {
      answer = coeff1 + coeff2;
    } else {
      answer = coeff1 - coeff2;
    }

    var question = 'Simplify: ' + coeff1 + '√' + radical + ' ' + op + ' ' + coeff2 + '√' + radical + '. What is the coefficient of √' + radical + '?';
  } else {
    // Multiplication: √a * √b = √(a*b)
    var a = randInt(2, 8);
    var b = randInt(2, 8);
    answer = a * b;
    var question = 'Simplify: √' + a + ' × √' + b + ' = √?';
  }

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['The Number System']['Repeating Decimals to Fractions'] = function(diff) {
  var denominators = [9, 99, 3, 9];
  var denom = denominators[randInt(0, 3)];
  var numer = randInt(1, denom - 1);

  // Simplify fraction
  var gcd = function(a, b) {
    while (b !== 0) {
      var temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  var g = gcd(numer, denom);
  numer = numer / g;
  denom = denom / g;

  var decimal = numer / denom;
  var decStr = decimal.toFixed(4);

  var question = 'The repeating decimal 0.' + decStr.substring(2) + '... equals the fraction n/' + denom + '. What is n?';
  var answer = numer;

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['The Number System']['Cube Roots'] = function(diff) {
  var base = diff === 'Easy' ? randInt(1, 5) : diff === 'Medium' ? randInt(1, 8) : randInt(1, 10);
  var cubed = base * base * base;
  var answer = base;

  var question = 'What is the cube root of ' + cubed + '?';

  return { question: question, answer: answer };
};

// ============================================================================
// EXPRESSIONS & EQUATIONS
// ============================================================================
SUB_GENERATORS['Grade 8']['Expressions & Equations'] = {};

SUB_GENERATORS['Grade 8']['Expressions & Equations']['Solving Linear Equations'] = function(diff) {
  var x = randInt(-10, 10);
  var a = randNonZero(10);
  var b = randInt(-20, 20);

  var left = a * x + b;

  var question = 'Solve for x: ' + a + 'x + ' + paren(b) + ' = ' + left;
  var answer = x;

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Expressions & Equations']['Equations with No/Infinite Solutions'] = function(diff) {
  var type = randInt(0, 1);
  var answer = type;
  var question;

  if (type === 1) {
    // Infinite solutions: same coefficients
    var a = randNonZero(5);
    var b = randInt(1, 10);
    question = 'How many solutions: ' + a + 'x + ' + b + ' = ' + a + 'x + ' + b + '? (1=infinite, 0=no solution)';
  } else {
    // No solution: same x coefficient, different constant
    var a = randNonZero(5);
    var b1 = randInt(1, 10);
    var b2 = b1 + randInt(1, 5);
    question = 'How many solutions: ' + a + 'x + ' + b1 + ' = ' + a + 'x + ' + b2 + '? (1=infinite, 0=no solution)';
  }

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Expressions & Equations']['Systems of Equations'] = function(diff) {
  var x = randInt(1, 10);
  var y = randInt(1, 10);

  var a1 = randNonZero(5);
  var b1 = randNonZero(5);
  var c1 = a1 * x + b1 * y;

  var a2 = randNonZero(5);
  var b2 = randNonZero(5);
  var c2 = a2 * x + b2 * y;

  var question = 'Solve the system: ' + a1 + 'x + ' + paren(b1) + 'y = ' + c1 + ' and ' + a2 + 'x + ' + paren(b2) + 'y = ' + c2 + '. What is x?';
  var answer = x;

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Expressions & Equations']['Slope from Two Points'] = function(diff) {
  var x1 = randInt(-10, 10);
  var y1 = randInt(-10, 10);
  var m = randInt(-5, 5);
  var dx = randInt(1, 5);
  var x2 = x1 + dx;
  var y2 = y1 + m * dx;

  var question = 'Find the slope between (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ')';
  var answer = m;

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Expressions & Equations']['Slope-Intercept Form'] = function(diff) {
  var m = randInt(-5, 5);
  var b = randInt(-10, 10);

  var choose = randInt(0, 1);
  var question, answer;

  if (choose === 0) {
    question = 'In the equation y = ' + m + 'x + ' + paren(b) + ', what is the slope?';
    answer = m;
  } else {
    question = 'In the equation y = ' + m + 'x + ' + paren(b) + ', what is the y-intercept?';
    answer = b;
  }

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Expressions & Equations']['Scientific Notation Operations'] = function(diff) {
  var a1 = randInt(1, 9);
  var e1 = randInt(1, 6);
  var a2 = randInt(1, 9);
  var e2 = randInt(1, 6);

  var op = randInt(0, 1) === 0 ? '*' : '/';
  var answer;

  if (op === '*') {
    var num1 = a1 * Math.pow(10, e1);
    var num2 = a2 * Math.pow(10, e2);
    var result = num1 * num2;
    var expAnswer = Math.floor(Math.log10(result));
    answer = expAnswer;
    question = '(' + a1 + ' × 10^' + e1 + ') × (' + a2 + ' × 10^' + e2 + '). What is the exponent in scientific notation?';
  } else {
    var num1 = a1 * Math.pow(10, e1);
    var num2 = a2 * Math.pow(10, e2);
    var result = num1 / num2;
    var expAnswer = result >= 1 ? Math.floor(Math.log10(result)) : Math.ceil(Math.log10(result));
    answer = expAnswer;
    question = '(' + a1 + ' × 10^' + e1 + ') ÷ (' + a2 + ' × 10^' + e2 + '). What is the exponent in scientific notation?';
  }

  return { question: question, answer: answer };
};

// ============================================================================
// FUNCTIONS
// ============================================================================
SUB_GENERATORS['Grade 8']['Functions'] = {};

SUB_GENERATORS['Grade 8']['Functions']['Identify Functions'] = function(diff) {
  var isFunction = randInt(0, 1);
  var answer = isFunction;
  var question;

  if (isFunction === 1) {
    var pairs = [];
    for (var i = 0; i < 4; i++) {
      pairs.push('(' + i + ', ' + randInt(1, 10) + ')');
    }
    question = 'Is this a function? ' + pairs.join(', ') + ' (1=yes, 0=no)';
  } else {
    var x = randInt(1, 5);
    var y1 = randInt(1, 10);
    var y2 = randInt(1, 10);
    while (y2 === y1) {
      y2 = randInt(1, 10);
    }
    question = 'Is this a function? (1, 2), (' + x + ', ' + y1 + '), (' + x + ', ' + y2 + '), (3, 4) (1=yes, 0=no)';
  }

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Functions']['Evaluate Functions'] = function(diff) {
  var a = randInt(-5, 5);
  var b = randInt(-10, 10);
  var x = randInt(1, 10);

  var answer = a * x + b;
  var question = 'If f(x) = ' + a + 'x + ' + paren(b) + ', what is f(' + x + ')?';

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Functions']['Linear vs Nonlinear'] = function(diff) {
  var isLinear = randInt(0, 1);
  var answer = isLinear;
  var question;

  if (isLinear === 1) {
    var m = randInt(-5, 5);
    var b = randInt(-10, 10);
    question = 'Is y = ' + m + 'x + ' + paren(b) + ' linear or nonlinear? (1=linear, 0=nonlinear)';
  } else {
    var types = ['y = x^2 + ' + randInt(1, 5), 'y = ' + randInt(2, 5) + 'x^2', 'y = 1/x'];
    question = 'Is ' + types[randInt(0, 2)] + ' linear or nonlinear? (1=linear, 0=nonlinear)';
  }

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Functions']['Rate of Change'] = function(diff) {
  var x1 = randInt(0, 10);
  var y1 = randInt(0, 20);
  var rate = randInt(1, 5);
  var dx = randInt(1, 5);
  var x2 = x1 + dx;
  var y2 = y1 + rate * dx;

  var answer = rate;
  var question = 'A linear function passes through (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + '). What is the rate of change?';

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Functions']['Compare Functions'] = function(diff) {
  var m1 = randInt(1, 5);
  var b1 = randInt(0, 10);

  var m2 = randInt(1, 5);
  while (m2 === m1) {
    m2 = randInt(1, 5);
  }
  var b2 = randInt(0, 10);

  var question = 'Function A: y = ' + m1 + 'x + ' + b1 + '. Function B: y = ' + m2 + 'x + ' + b2 + '. Which has a greater slope? (Answer with the slope value)';
  var answer = m1 > m2 ? m1 : m2;

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Functions']['Function from Table'] = function(diff) {
  var m = randInt(2, 5);
  var b = randInt(0, 5);

  var x1 = randInt(1, 3);
  var y1 = m * x1 + b;
  var x2 = x1 + 1;
  var y2 = m * x2 + b;
  var x3 = x2 + 1;
  var y3 = m * x3 + b;

  var question = 'A table shows: x=' + x1 + ',y=' + y1 + '; x=' + x2 + ',y=' + y2 + '; x=' + x3 + ',y=' + y3 + '. What is the slope?';
  var answer = m;

  return { question: question, answer: answer };
};

// ============================================================================
// GEOMETRY
// ============================================================================
SUB_GENERATORS['Grade 8']['Geometry'] = {};

SUB_GENERATORS['Grade 8']['Geometry']['Pythagorean Theorem'] = function(diff) {
  var triples = [
    [3, 4, 5],
    [5, 12, 13],
    [8, 15, 17],
    [7, 24, 25]
  ];

  var triple = triples[randInt(0, 3)];
  var mult = diff === 'Easy' ? 1 : diff === 'Medium' ? randInt(1, 2) : randInt(1, 3);

  var a = triple[0] * mult;
  var b = triple[1] * mult;
  var c = triple[2] * mult;

  var whichSide = randInt(0, 2);
  var question, answer;

  if (whichSide === 0) {
    question = 'A right triangle has legs ' + b + ' and ' + a + '. What is the hypotenuse?';
    answer = c;
  } else if (whichSide === 1) {
    question = 'A right triangle has hypotenuse ' + c + ' and one leg ' + a + '. What is the other leg?';
    answer = b;
  } else {
    question = 'A right triangle has hypotenuse ' + c + ' and one leg ' + b + '. What is the other leg?';
    answer = a;
  }

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Geometry']['Distance Between Points'] = function(diff) {
  var triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17]];
  var triple = triples[randInt(0, 2)];

  var x1 = randInt(0, 10);
  var y1 = randInt(0, 10);
  var x2 = x1 + triple[0];
  var y2 = y1 + triple[1];

  var answer = triple[2];
  var question = 'What is the distance between (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ')?';

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Geometry']['Volume of Cylinders'] = function(diff) {
  var r = randInt(2, 5);
  var h = randInt(3, 10);

  var volume = 3.14 * r * r * h;
  var answer = Math.round(volume * 100) / 100;

  var question = 'Find the volume of a cylinder with radius ' + r + ' and height ' + h + '. (Use π = 3.14)';

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Geometry']['Volume of Cones'] = function(diff) {
  var r = randInt(2, 6);
  var h = randInt(3, 12);

  var volume = (1/3) * 3.14 * r * r * h;
  var answer = Math.round(volume * 100) / 100;

  var question = 'Find the volume of a cone with radius ' + r + ' and height ' + h + '. (Use π = 3.14)';

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Geometry']['Volume of Spheres'] = function(diff) {
  var r = randInt(2, 5);

  var volume = (4/3) * 3.14 * r * r * r;
  var answer = Math.round(volume * 100) / 100;

  var question = 'Find the volume of a sphere with radius ' + r + '. (Use π = 3.14)';

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Geometry']['Angle Relationships'] = function(diff) {
  var angle1 = randInt(30, 150);
  var answer;
  var question;

  var type = randInt(0, 2);

  if (type === 0) {
    // Supplementary angles
    answer = 180 - angle1;
    question = 'Two angles are supplementary. One angle is ' + angle1 + '°. What is the other angle?';
  } else if (type === 1) {
    // Complementary angles
    angle1 = randInt(20, 70);
    answer = 90 - angle1;
    question = 'Two angles are complementary. One angle is ' + angle1 + '°. What is the other angle?';
  } else {
    // Vertical angles
    answer = angle1;
    question = 'Two lines intersect. One angle measures ' + angle1 + '°. What is the measure of the vertical angle?';
  }

  return { question: question, answer: answer };
};

// ============================================================================
// STATISTICS & PROBABILITY
// ============================================================================
SUB_GENERATORS['Grade 8']['Statistics & Probability'] = {};

SUB_GENERATORS['Grade 8']['Statistics & Probability']['Scatter Plot Trends'] = function(diff) {
  var trend = [-1, 0, 1][randInt(0, 2)];
  var answer = trend;
  var question;

  if (trend === 1) {
    question = 'A scatter plot shows as x increases, y increases. What is the trend? (1=positive, -1=negative, 0=none)';
  } else if (trend === -1) {
    question = 'A scatter plot shows as x increases, y decreases. What is the trend? (1=positive, -1=negative, 0=none)';
  } else {
    question = 'A scatter plot shows no clear pattern between x and y. What is the trend? (1=positive, -1=negative, 0=none)';
  }

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Statistics & Probability']['Line of Best Fit'] = function(diff) {
  var m = randInt(1, 5);
  var b = randInt(0, 10);
  var x = randInt(5, 15);

  var answer = m * x + b;
  var question = 'A line of best fit is y = ' + m + 'x + ' + b + '. Predict y when x = ' + x;

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Statistics & Probability']['Two-Way Tables'] = function(diff) {
  var a = randInt(10, 30);
  var b = randInt(10, 30);
  var c = randInt(10, 30);
  var d = randInt(10, 30);

  var total = a + b + c + d;
  var rowTotal = randInt(0, 1) === 0 ? a + b : c + d;
  var colTotal = randInt(0, 1) === 0 ? a + c : b + d;

  var choose = randInt(0, 2);
  var answer;

  if (choose === 0) {
    answer = total;
    question = 'A two-way table has values: ' + a + ', ' + b + ', ' + c + ', ' + d + '. What is the total?';
  } else if (choose === 1) {
    answer = a + b;
    question = 'A two-way table row has values: ' + a + ' and ' + b + '. What is the row total?';
  } else {
    answer = a + c;
    question = 'A two-way table column has values: ' + a + ' and ' + c + '. What is the column total?';
  }

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Statistics & Probability']['Relative Frequency'] = function(diff) {
  var part = randInt(5, 25);
  var total = part * randInt(2, 5);

  var percent = Math.round((part / total) * 100);
  var answer = percent;

  var question = 'In a survey of ' + total + ' people, ' + part + ' chose option A. What is the relative frequency as a percentage?';

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Statistics & Probability']['Bivariate Data Patterns'] = function(diff) {
  var pattern = [-1, 0, 1][randInt(0, 2)];
  var answer = pattern;
  var question;

  if (pattern === 1) {
    question = 'Study time and test scores both increase together. What is the association? (1=positive, -1=negative, 0=none)';
  } else if (pattern === -1) {
    question = 'As TV watching time increases, grades decrease. What is the association? (1=positive, -1=negative, 0=none)';
  } else {
    question = 'Shoe size and math scores show no pattern. What is the association? (1=positive, -1=negative, 0=none)';
  }

  return { question: question, answer: answer };
};

SUB_GENERATORS['Grade 8']['Statistics & Probability']['Outliers & Influence'] = function(diff) {
  var data = [];
  var base = randInt(10, 20);

  for (var i = 0; i < 5; i++) {
    data.push(base + randInt(-2, 2));
  }

  var outlier = base + randInt(20, 40);
  data.push(outlier);

  var answer = outlier;
  var question = 'In the data set: ' + data.join(', ') + ', which value is the outlier?';

  return { question: question, answer: answer };
};
SUB_GENERATORS['Grade 10'] = {};

// ===== Congruence & Proofs =====
SUB_GENERATORS['Grade 10']['Congruence & Proofs'] = {};

SUB_GENERATORS['Grade 10']['Congruence & Proofs']['Triangle Angle Sum'] = function(diff) {
  var a = randInt(30, 80);
  var b = randInt(30, 80);
  var c = 180 - a - b;

  if (diff === 'Easy') {
    var answer = c;
    return {
      answer: answer,
      question: 'A triangle has angles measuring ' + a + '° and ' + b + '°. What is the measure of the third angle in degrees?'
    };
  } else if (diff === 'Medium') {
    var x = randInt(5, 20);
    var angle1 = a;
    var angle2 = b;
    var angle3_expr = c - x;
    var answer = x;
    return {
      answer: answer,
      question: 'In a triangle, two angles measure ' + angle1 + '° and ' + angle2 + '°. The third angle is (x + ' + angle3_expr + ')°. Find x.'
    };
  } else {
    var x = randInt(5, 15);
    var coeff1 = randInt(2, 4);
    var const1 = randInt(5, 15);
    var angle1_total = coeff1 * x + const1;
    var angle2 = randInt(40, 70);
    var angle3 = 180 - angle1_total - angle2;
    var answer = x;
    return {
      answer: answer,
      question: 'A triangle has angles measuring ' + coeff1 + 'x + ' + const1 + ', ' + angle2 + '°, and ' + angle3 + '°. Find x.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Congruence & Proofs']['Exterior Angle Theorem'] = function(diff) {
  if (diff === 'Easy') {
    var remote1 = randInt(40, 70);
    var remote2 = randInt(40, 70);
    var answer = remote1 + remote2;
    return {
      answer: answer,
      question: 'An exterior angle of a triangle measures equal to the sum of two non-adjacent interior angles. If the two remote interior angles are ' + remote1 + '° and ' + remote2 + '°, what is the exterior angle in degrees?'
    };
  } else if (diff === 'Medium') {
    var remote1 = randInt(45, 75);
    var exterior = randInt(100, 140);
    var answer = exterior - remote1;
    return {
      answer: answer,
      question: 'An exterior angle of a triangle is ' + exterior + '°. One remote interior angle is ' + remote1 + '°. What is the other remote interior angle in degrees?'
    };
  } else {
    var x = randInt(10, 20);
    var remote1 = randInt(50, 70);
    var exterior_expr_const = remote1 + x;
    var answer = x;
    return {
      answer: answer,
      question: 'An exterior angle is (2x + ' + exterior_expr_const + ')° and equals the sum of remote interior angles ' + remote1 + '° and (x + ' + x + ')°. Find x.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Congruence & Proofs']['Isosceles Triangle Properties'] = function(diff) {
  if (diff === 'Easy') {
    var baseAngle = randInt(50, 70);
    var answer = 180 - 2 * baseAngle;
    return {
      answer: answer,
      question: 'In an isosceles triangle, the two base angles each measure ' + baseAngle + '°. What is the vertex angle in degrees?'
    };
  } else if (diff === 'Medium') {
    var vertex = randInt(40, 80);
    var answer = Math.floor((180 - vertex) / 2);
    return {
      answer: answer,
      question: 'An isosceles triangle has a vertex angle of ' + vertex + '°. What is the measure of each base angle in degrees?'
    };
  } else {
    var x = randInt(10, 25);
    var baseAngle = randInt(55, 75);
    var vertex = 180 - 2 * baseAngle;
    var answer = x;
    return {
      answer: answer,
      question: 'In an isosceles triangle, each base angle is ' + baseAngle + '° and the vertex angle is (2x + ' + (vertex - 2*x) + ')°. Find x.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Congruence & Proofs']['Midsegment Lengths'] = function(diff) {
  if (diff === 'Easy') {
    var base = randInt(12, 40);
    var answer = Math.floor(base / 2);
    return {
      answer: answer,
      question: 'A triangle has a base of length ' + base + ' units. What is the length of the midsegment parallel to this base?'
    };
  } else if (diff === 'Medium') {
    var midsegment = randInt(8, 24);
    var answer = 2 * midsegment;
    return {
      answer: answer,
      question: 'The midsegment of a triangle parallel to one side is ' + midsegment + ' units long. What is the length of that side?'
    };
  } else {
    var x = randInt(3, 10);
    var base = randInt(20, 50);
    var midseg_const = base / 2 - x;
    var answer = x;
    return {
      answer: answer,
      question: 'A triangle has a base of ' + base + ' units. The midsegment parallel to it is (x + ' + midseg_const + ') units. Find x.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Congruence & Proofs']['CPCTC Calculations'] = function(diff) {
  if (diff === 'Easy') {
    var side = randInt(15, 35);
    var answer = side;
    return {
      answer: answer,
      question: 'Two triangles are congruent. If one side of the first triangle is ' + side + ' units, what is the length of the corresponding side in the second triangle?'
    };
  } else if (diff === 'Medium') {
    var angle = randInt(45, 85);
    var x = randInt(5, 15);
    var expr_const = angle - x;
    var answer = x;
    return {
      answer: answer,
      question: 'Two congruent triangles have corresponding angles of ' + angle + '° and (x + ' + expr_const + ')°. Find x.'
    };
  } else {
    var side = randInt(20, 40);
    var x = randInt(4, 12);
    var coeff = randInt(2, 3);
    var const_term = side - coeff * x;
    var answer = x;
    return {
      answer: answer,
      question: 'In congruent triangles, corresponding sides measure ' + side + ' and (' + coeff + 'x + ' + const_term + '). Find x.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Congruence & Proofs']['Angle Bisector & Perpendicular Bisector'] = function(diff) {
  if (diff === 'Easy') {
    var fullAngle = randInt(60, 120);
    if (fullAngle % 2 !== 0) fullAngle++;
    var answer = fullAngle / 2;
    return {
      answer: answer,
      question: 'An angle bisector divides an angle of ' + fullAngle + '° into two equal parts. What is the measure of each part in degrees?'
    };
  } else if (diff === 'Medium') {
    var halfAngle = randInt(30, 60);
    var answer = 2 * halfAngle;
    return {
      answer: answer,
      question: 'An angle bisector creates two angles of ' + halfAngle + '° each. What was the original angle in degrees?'
    };
  } else {
    var x = randInt(8, 20);
    var halfAngle = randInt(35, 55);
    var fullAngle = 2 * halfAngle;
    var const_term = fullAngle - x;
    var answer = x;
    return {
      answer: answer,
      question: 'An angle bisector creates two ' + halfAngle + '° angles. The original angle was (x + ' + const_term + ')°. Find x.'
    };
  }
};

// ===== Similarity & Transformations =====
SUB_GENERATORS['Grade 10']['Similarity & Transformations'] = {};

SUB_GENERATORS['Grade 10']['Similarity & Transformations']['Scale Factor'] = function(diff) {
  if (diff === 'Easy') {
    var original = randInt(5, 15);
    var scale = randInt(2, 4);
    var answer = original * scale;
    return {
      answer: answer,
      question: 'A figure with side length ' + original + ' is dilated by a scale factor of ' + scale + '. What is the new side length?'
    };
  } else if (diff === 'Medium') {
    var original = randInt(6, 12);
    var scale = randInt(2, 5);
    var newLength = original * scale;
    var answer = scale;
    return {
      answer: answer,
      question: 'A side of length ' + original + ' becomes ' + newLength + ' after dilation. What is the scale factor?'
    };
  } else {
    var scale = randInt(3, 5);
    var newLength = randInt(30, 60);
    var answer = Math.floor(newLength / scale);
    return {
      answer: answer,
      question: 'After dilation by scale factor ' + scale + ', a side measures ' + newLength + '. What was the original length?'
    };
  }
};

SUB_GENERATORS['Grade 10']['Similarity & Transformations']['Similar Triangle Side Lengths'] = function(diff) {
  if (diff === 'Easy') {
    var side1 = randInt(6, 12);
    var side2 = randInt(8, 16);
    var scale = randInt(2, 3);
    var answer = side1 * scale;
    return {
      answer: answer,
      question: 'Two similar triangles have corresponding sides ' + side1 + ' and x, and another pair ' + side2 + ' and ' + (side2 * scale) + '. Find x.'
    };
  } else if (diff === 'Medium') {
    var side1 = randInt(5, 10);
    var side2 = randInt(8, 15);
    var ratio_num = randInt(2, 4);
    var ratio_den = randInt(ratio_num + 1, ratio_num + 3);
    var answer = Math.floor(side1 * ratio_den / ratio_num);
    return {
      answer: answer,
      question: 'Similar triangles have sides in ratio ' + ratio_num + ':' + ratio_den + '. If one side is ' + side1 + ', what is the corresponding side?'
    };
  } else {
    var a = randInt(4, 8);
    var b = randInt(6, 10);
    var c = randInt(10, 15);
    var scale = 2;
    var d = c * scale;
    var answer = b * scale;
    return {
      answer: answer,
      question: 'Two similar triangles have sides ' + a + ', ' + b + ', ' + c + ' and ' + (a*scale) + ', x, ' + d + '. Find x.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Similarity & Transformations']['Proportions in Similar Figures'] = function(diff) {
  if (diff === 'Easy') {
    var a = randInt(3, 8);
    var b = randInt(6, 12);
    var c = randInt(4, 9);
    var answer = Math.floor(b * c / a);
    return {
      answer: answer,
      question: 'In similar figures, ' + a + '/' + b + ' = ' + c + '/x. Find x.'
    };
  } else if (diff === 'Medium') {
    var a = randInt(5, 10);
    var c = randInt(7, 14);
    var d = randInt(10, 20);
    var answer = Math.floor(a * d / c);
    return {
      answer: answer,
      question: 'Similar figures have proportion x/' + c + ' = ' + a + '/' + d + '. Find x (round to nearest whole number).'
    };
  } else {
    var a = randInt(4, 8);
    var b = randInt(8, 16);
    var scale = randInt(2, 3);
    var c = a * scale;
    var x = randInt(3, 10);
    var d_value = b * scale;
    var d_const = d_value - x;
    var answer = x;
    return {
      answer: answer,
      question: 'In similar figures, ' + a + '/' + b + ' = ' + c + '/(x + ' + d_const + '). Find x.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Similarity & Transformations']['Dilations on Coordinates'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(2, 8);
    var y = randInt(2, 8);
    var scale = randInt(2, 4);
    var answer = x * scale;
    return {
      answer: answer,
      question: 'Point (' + x + ', ' + y + ') is dilated by scale factor ' + scale + ' from the origin. What is the x-coordinate of the new point?'
    };
  } else if (diff === 'Medium') {
    var x = randInt(3, 9);
    var y = randInt(3, 9);
    var scale = randInt(2, 3);
    var answer = y * scale;
    return {
      answer: answer,
      question: 'Point (' + x + ', ' + y + ') undergoes dilation by factor ' + scale + ' centered at origin. What is the y-coordinate?'
    };
  } else {
    var x = randInt(-6, -2);
    var y = randInt(2, 8);
    var scale = randInt(2, 3);
    var answer = x * scale;
    return {
      answer: answer,
      question: 'Point (' + x + ', ' + y + ') is dilated by scale factor ' + scale + ' from origin. Find the x-coordinate.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Similarity & Transformations']['Reflection Coordinates'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(2, 10);
    var y = randInt(2, 10);
    var answer = -y;
    return {
      answer: answer,
      question: 'Point (' + x + ', ' + y + ') is reflected over the x-axis. What is the y-coordinate of the reflected point?'
    };
  } else if (diff === 'Medium') {
    var x = randInt(3, 10);
    var y = randInt(2, 10);
    var answer = -x;
    return {
      answer: answer,
      question: 'Point (' + x + ', ' + y + ') is reflected over the y-axis. What is the x-coordinate?'
    };
  } else {
    var x = randInt(-8, -2);
    var y = randInt(3, 10);
    var answer = -x;
    return {
      answer: answer,
      question: 'Point (' + x + ', ' + y + ') is reflected over the y-axis. Find the x-coordinate.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Similarity & Transformations']['Rotation Coordinates'] = function(diff) {
  if (diff === 'Easy') {
    var x = randInt(3, 10);
    var y = randInt(2, 8);
    var answer = -x;
    return {
      answer: answer,
      question: 'Point (' + x + ', ' + y + ') is rotated 90° counterclockwise about the origin. The new point is (-y, x) = (' + (-y) + ', ' + x + '). What is the x-coordinate of the new point?'
    };
  } else if (diff === 'Medium') {
    var x = randInt(2, 10);
    var y = randInt(3, 10);
    var answer = -y;
    return {
      answer: answer,
      question: 'Point (' + x + ', ' + y + ') rotates 180° counterclockwise about origin to (-x, -y). What is the y-coordinate?'
    };
  } else {
    var x = randInt(2, 9);
    var y = randInt(3, 10);
    var answer = -x;
    return {
      answer: answer,
      question: 'Point (' + x + ', ' + y + ') rotates 270° CCW about origin to (y, -x). What is the y-coordinate of the result?'
    };
  }
};

// ===== Right Triangles & Trigonometry =====
SUB_GENERATORS['Grade 10']['Right Triangles & Trigonometry'] = {};

SUB_GENERATORS['Grade 10']['Right Triangles & Trigonometry']['Pythagorean Theorem (Advanced)'] = function(diff) {
  if (diff === 'Easy') {
    var a = 3;
    var b = 4;
    var answer = 5;
    return {
      answer: answer,
      question: 'A right triangle has legs of length ' + a + ' and ' + b + '. What is the length of the hypotenuse?'
    };
  } else if (diff === 'Medium') {
    var a = 5;
    var c = 13;
    var answer = 12;
    return {
      answer: answer,
      question: 'A right triangle has one leg ' + a + ' and hypotenuse ' + c + '. What is the other leg?'
    };
  } else {
    var a = 8;
    var b = 15;
    var answer = 17;
    return {
      answer: answer,
      question: 'A right triangle has legs ' + a + ' and ' + b + '. Find the hypotenuse.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Right Triangles & Trigonometry']['Special Right Triangles (45-45-90)'] = function(diff) {
  if (diff === 'Easy') {
    var leg = randInt(4, 10);
    var answer = Math.round(leg * 1.41);
    return {
      answer: answer,
      question: 'In a 45-45-90 triangle, each leg is ' + leg + '. What is the hypotenuse? (Use 1.41 for √2)'
    };
  } else if (diff === 'Medium') {
    var hyp = randInt(10, 20);
    if (hyp % 2 !== 0) hyp++;
    var answer = Math.round(hyp / 1.41);
    return {
      answer: answer,
      question: 'A 45-45-90 triangle has hypotenuse ' + hyp + '. What is each leg? (Use 1.41 for √2, round to nearest whole number)'
    };
  } else {
    var leg = randInt(6, 12);
    var x = randInt(2, 5);
    var hyp_value = Math.round(leg * 1.41);
    var const_term = hyp_value - x;
    var answer = x;
    return {
      answer: answer,
      question: 'In a 45-45-90 triangle with leg ' + leg + ', the hypotenuse is (x + ' + const_term + '). Find x. (Use 1.41 for √2)'
    };
  }
};

SUB_GENERATORS['Grade 10']['Right Triangles & Trigonometry']['Special Right Triangles (30-60-90)'] = function(diff) {
  if (diff === 'Easy') {
    var short = randInt(4, 10);
    var answer = 2 * short;
    return {
      answer: answer,
      question: 'In a 30-60-90 triangle, the shortest side is ' + short + '. What is the hypotenuse?'
    };
  } else if (diff === 'Medium') {
    var short = randInt(5, 12);
    var answer = Math.round(short * 1.73);
    return {
      answer: answer,
      question: 'A 30-60-90 triangle has shortest side ' + short + '. What is the longer leg? (Use 1.73 for √3)'
    };
  } else {
    var hyp = randInt(12, 24);
    if (hyp % 2 !== 0) hyp++;
    var answer = hyp / 2;
    return {
      answer: answer,
      question: 'In a 30-60-90 triangle, the hypotenuse is ' + hyp + '. What is the shortest side?'
    };
  }
};

SUB_GENERATORS['Grade 10']['Right Triangles & Trigonometry']['Sine Ratio'] = function(diff) {
  if (diff === 'Easy') {
    var opp = 3;
    var hyp = 5;
    var answer = 0.6;
    return {
      answer: answer,
      question: 'In a right triangle, the opposite side is ' + opp + ' and hypotenuse is ' + hyp + '. What is sin(θ)? (Round to hundredths)'
    };
  } else if (diff === 'Medium') {
    var opp = 5;
    var hyp = 13;
    var answer = 0.38;
    return {
      answer: answer,
      question: 'A right triangle has opposite ' + opp + ' and hypotenuse ' + hyp + '. Find sin(θ). (Round to hundredths)'
    };
  } else {
    var opp = 8;
    var hyp = 17;
    var answer = 0.47;
    return {
      answer: answer,
      question: 'In a right triangle, opposite = ' + opp + ', hypotenuse = ' + hyp + '. Calculate sin(θ). (Round to hundredths)'
    };
  }
};

SUB_GENERATORS['Grade 10']['Right Triangles & Trigonometry']['Cosine Ratio'] = function(diff) {
  if (diff === 'Easy') {
    var adj = 4;
    var hyp = 5;
    var answer = 0.8;
    return {
      answer: answer,
      question: 'In a right triangle, adjacent = ' + adj + ', hypotenuse = ' + hyp + '. What is cos(θ)? (Round to hundredths)'
    };
  } else if (diff === 'Medium') {
    var adj = 12;
    var hyp = 13;
    var answer = 0.92;
    return {
      answer: answer,
      question: 'A right triangle has adjacent ' + adj + ' and hypotenuse ' + hyp + '. Find cos(θ). (Round to hundredths)'
    };
  } else {
    var adj = 15;
    var hyp = 17;
    var answer = 0.88;
    return {
      answer: answer,
      question: 'Right triangle with adjacent = ' + adj + ', hypotenuse = ' + hyp + '. Calculate cos(θ). (Round to hundredths)'
    };
  }
};

SUB_GENERATORS['Grade 10']['Right Triangles & Trigonometry']['Tangent Ratio'] = function(diff) {
  if (diff === 'Easy') {
    var opp = 3;
    var adj = 4;
    var answer = 0.75;
    return {
      answer: answer,
      question: 'In a right triangle, opposite = ' + opp + ', adjacent = ' + adj + '. What is tan(θ)? (Round to hundredths)'
    };
  } else if (diff === 'Medium') {
    var opp = 5;
    var adj = 12;
    var answer = 0.42;
    return {
      answer: answer,
      question: 'Right triangle has opposite ' + opp + ' and adjacent ' + adj + '. Find tan(θ). (Round to hundredths)'
    };
  } else {
    var opp = 8;
    var adj = 15;
    var answer = 0.53;
    return {
      answer: answer,
      question: 'In a right triangle, opposite = ' + opp + ', adjacent = ' + adj + '. Calculate tan(θ). (Round to hundredths)'
    };
  }
};

// ===== Circles =====
SUB_GENERATORS['Grade 10']['Circles'] = {};

SUB_GENERATORS['Grade 10']['Circles']['Arc Length'] = function(diff) {
  if (diff === 'Easy') {
    var r = randInt(5, 10);
    var angle = 90;
    var answer = Math.round((angle / 360) * 2 * 3.14 * r);
    return {
      answer: answer,
      question: 'A circle has radius ' + r + '. What is the arc length for a ' + angle + '° central angle? (Use π = 3.14, round to nearest whole number)'
    };
  } else if (diff === 'Medium') {
    var r = randInt(8, 15);
    var angle = 60;
    var answer = Math.round((angle / 360) * 2 * 3.14 * r);
    return {
      answer: answer,
      question: 'Find the arc length of a ' + angle + '° arc in a circle with radius ' + r + '. (Use π = 3.14, round to nearest whole number)'
    };
  } else {
    var r = randInt(10, 18);
    var angle = 120;
    var answer = Math.round((angle / 360) * 2 * 3.14 * r);
    return {
      answer: answer,
      question: 'A ' + angle + '° central angle intercepts an arc in a circle of radius ' + r + '. Find arc length. (π = 3.14, round)'
    };
  }
};

SUB_GENERATORS['Grade 10']['Circles']['Sector Area'] = function(diff) {
  if (diff === 'Easy') {
    var r = randInt(4, 8);
    var angle = 90;
    var answer = Math.round((angle / 360) * 3.14 * r * r);
    return {
      answer: answer,
      question: 'A sector has central angle ' + angle + '° and radius ' + r + '. What is the sector area? (Use π = 3.14, round)'
    };
  } else if (diff === 'Medium') {
    var r = randInt(6, 12);
    var angle = 60;
    var answer = Math.round((angle / 360) * 3.14 * r * r);
    return {
      answer: answer,
      question: 'Find the area of a sector with radius ' + r + ' and central angle ' + angle + '°. (π = 3.14, round)'
    };
  } else {
    var r = randInt(8, 15);
    var angle = 120;
    var answer = Math.round((angle / 360) * 3.14 * r * r);
    return {
      answer: answer,
      question: 'Calculate sector area for central angle ' + angle + '° in circle radius ' + r + '. (π = 3.14, round)'
    };
  }
};

SUB_GENERATORS['Grade 10']['Circles']['Central Angles'] = function(diff) {
  if (diff === 'Easy') {
    var angle = randInt(60, 120);
    var answer = angle;
    return {
      answer: answer,
      question: 'A central angle intercepts an arc of ' + angle + '°. What is the measure of the central angle in degrees?'
    };
  } else if (diff === 'Medium') {
    var angle1 = randInt(80, 140);
    var angle2 = randInt(60, 100);
    var answer = 360 - angle1 - angle2;
    return {
      answer: answer,
      question: 'Three central angles in a circle measure ' + angle1 + '°, ' + angle2 + '°, and x°. Find x.'
    };
  } else {
    var x = randInt(15, 35);
    var angle1 = randInt(100, 150);
    var angle2_value = 360 - angle1 - x;
    var const_term = angle2_value - x;
    var answer = x;
    return {
      answer: answer,
      question: 'Two central angles are ' + angle1 + '° and (2x + ' + const_term + ')°. They sum to 360° with angle x. Find x.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Circles']['Inscribed Angles'] = function(diff) {
  if (diff === 'Easy') {
    var central = randInt(80, 140);
    if (central % 2 !== 0) central++;
    var answer = central / 2;
    return {
      answer: answer,
      question: 'A central angle measures ' + central + '°. What is the inscribed angle that intercepts the same arc?'
    };
  } else if (diff === 'Medium') {
    var inscribed = randInt(40, 70);
    var answer = 2 * inscribed;
    return {
      answer: answer,
      question: 'An inscribed angle is ' + inscribed + '°. What is the central angle intercepting the same arc?'
    };
  } else {
    var central = randInt(100, 160);
    if (central % 2 !== 0) central++;
    var inscribed = central / 2;
    var x = randInt(5, 20);
    var const_term = inscribed - x;
    var answer = x;
    return {
      answer: answer,
      question: 'Central angle is ' + central + '°. The inscribed angle is (x + ' + const_term + ')°. Find x.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Circles']['Tangent Line Lengths'] = function(diff) {
  if (diff === 'Easy') {
    var tang1 = randInt(8, 16);
    var answer = tang1;
    return {
      answer: answer,
      question: 'Two tangent segments from an external point to a circle have lengths ' + tang1 + ' and x. Find x.'
    };
  } else if (diff === 'Medium') {
    var x = randInt(5, 12);
    var tang = randInt(15, 25);
    var const_term = tang - x;
    var answer = x;
    return {
      answer: answer,
      question: 'Two tangents from external point measure ' + tang + ' and (x + ' + const_term + '). Find x.'
    };
  } else {
    var x = randInt(4, 10);
    var coeff = 2;
    var tang_value = randInt(18, 30);
    var const_term = tang_value - coeff * x;
    var answer = x;
    return {
      answer: answer,
      question: 'Tangent segments from external point are ' + tang_value + ' and (' + coeff + 'x + ' + const_term + '). Find x.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Circles']['Equation of a Circle (Radius)'] = function(diff) {
  if (diff === 'Easy') {
    var h = randInt(1, 5);
    var k = randInt(1, 5);
    var r = randInt(3, 8);
    var r_sq = r * r;
    var answer = r;
    return {
      answer: answer,
      question: 'A circle has equation (x - ' + h + ')² + (y - ' + k + ')² = ' + r_sq + '. What is the radius?'
    };
  } else if (diff === 'Medium') {
    var h = randInt(-5, -1);
    var k = randInt(2, 6);
    var r = randInt(4, 9);
    var r_sq = r * r;
    var answer = r;
    return {
      answer: answer,
      question: 'Find the radius of circle (x - (' + h + '))² + (y - ' + k + ')² = ' + r_sq + '.'
    };
  } else {
    var h = randInt(2, 7);
    var k = randInt(-6, -2);
    var r = randInt(5, 10);
    var r_sq = r * r;
    var answer = r;
    return {
      answer: answer,
      question: 'What is the radius of the circle with equation (x - ' + h + ')² + (y - (' + k + '))² = ' + r_sq + '?'
    };
  }
};

// ===== Coordinate Geometry =====
SUB_GENERATORS['Grade 10']['Coordinate Geometry'] = {};

SUB_GENERATORS['Grade 10']['Coordinate Geometry']['Distance Formula'] = function(diff) {
  if (diff === 'Easy') {
    var x1 = 0;
    var y1 = 0;
    var x2 = 3;
    var y2 = 4;
    var answer = 5;
    return {
      answer: answer,
      question: 'Find the distance between points (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ').'
    };
  } else if (diff === 'Medium') {
    var x1 = randInt(1, 5);
    var y1 = randInt(1, 5);
    var x2 = x1 + 5;
    var y2 = y1 + 12;
    var answer = 13;
    return {
      answer: answer,
      question: 'Calculate the distance between (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ').'
    };
  } else {
    var x1 = randInt(-3, 2);
    var y1 = randInt(-3, 2);
    var x2 = x1 + 8;
    var y2 = y1 + 15;
    var answer = 17;
    return {
      answer: answer,
      question: 'Find distance between points (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ').'
    };
  }
};

SUB_GENERATORS['Grade 10']['Coordinate Geometry']['Midpoint Formula'] = function(diff) {
  if (diff === 'Easy') {
    var x1 = randInt(2, 8);
    var x2 = randInt(10, 16);
    var y1 = randInt(3, 9);
    var y2 = randInt(11, 17);
    var answer = Math.floor((x1 + x2) / 2);
    return {
      answer: answer,
      question: 'Find the x-coordinate of the midpoint between (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ').'
    };
  } else if (diff === 'Medium') {
    var x1 = randInt(3, 9);
    var x2 = randInt(11, 19);
    var y1 = randInt(4, 10);
    var y2 = randInt(12, 20);
    var answer = Math.floor((y1 + y2) / 2);
    return {
      answer: answer,
      question: 'What is the y-coordinate of the midpoint of (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ')?'
    };
  } else {
    var x1 = randInt(-8, -2);
    var x2 = randInt(4, 12);
    var y1 = randInt(2, 8);
    var y2 = randInt(10, 18);
    var answer = Math.floor((x1 + x2) / 2);
    return {
      answer: answer,
      question: 'Calculate x-coordinate of midpoint between (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ').'
    };
  }
};

SUB_GENERATORS['Grade 10']['Coordinate Geometry']['Slope of Parallel Lines'] = function(diff) {
  if (diff === 'Easy') {
    var m = randInt(2, 8);
    var answer = m;
    return {
      answer: answer,
      question: 'A line has slope ' + m + '. What is the slope of a line parallel to it?'
    };
  } else if (diff === 'Medium') {
    var m = randInt(-8, -2);
    var answer = m;
    return {
      answer: answer,
      question: 'If a line has slope ' + m + ', what is the slope of any parallel line?'
    };
  } else {
    var x = randInt(2, 8);
    var m = randInt(3, 9);
    var const_term = m - x;
    var answer = x;
    return {
      answer: answer,
      question: 'Two parallel lines have slopes ' + m + ' and (x + ' + const_term + '). Find x.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Coordinate Geometry']['Slope of Perpendicular Lines'] = function(diff) {
  if (diff === 'Easy') {
    var m = randInt(2, 6);
    var answer = Math.round(-1 / m * 100) / 100;
    return {
      answer: answer,
      question: 'A line has slope ' + m + '. What is the slope of a perpendicular line? (Round to hundredths)'
    };
  } else if (diff === 'Medium') {
    var m = randInt(-5, -2);
    var answer = Math.round(-1 / m * 100) / 100;
    return {
      answer: answer,
      question: 'If a line has slope ' + m + ', find the slope of a perpendicular line. (Round to hundredths)'
    };
  } else {
    var m = 4;
    var perp_m_num = -1;
    var perp_m_den = 4;
    var answer = perp_m_num;
    return {
      answer: answer,
      question: 'Line has slope ' + m + '. Perpendicular slope is x/' + perp_m_den + '. Find x.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Coordinate Geometry']['Partitioning a Segment'] = function(diff) {
  if (diff === 'Easy') {
    var x1 = randInt(2, 6);
    var x2 = randInt(10, 16);
    var ratio = 1;
    var answer = Math.floor((x1 + x2) / 2);
    return {
      answer: answer,
      question: 'A segment from x = ' + x1 + ' to x = ' + x2 + ' is partitioned 1:1. What is the x-coordinate of the partition point?'
    };
  } else if (diff === 'Medium') {
    var x1 = 2;
    var x2 = 8;
    var ratio_a = 1;
    var ratio_b = 2;
    var answer = Math.floor(x1 + (x2 - x1) * ratio_a / (ratio_a + ratio_b));
    return {
      answer: answer,
      question: 'Segment from x = ' + x1 + ' to x = ' + x2 + ' is divided ' + ratio_a + ':' + ratio_b + '. Find x-coordinate of partition.'
    };
  } else {
    var y1 = 3;
    var y2 = 15;
    var ratio_a = 2;
    var ratio_b = 1;
    var answer = Math.floor(y1 + (y2 - y1) * ratio_a / (ratio_a + ratio_b));
    return {
      answer: answer,
      question: 'Segment from y = ' + y1 + ' to y = ' + y2 + ' partitioned ' + ratio_a + ':' + ratio_b + '. Find y-coordinate.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Coordinate Geometry']['Perimeter on Coordinate Plane'] = function(diff) {
  if (diff === 'Easy') {
    var x1 = 0, y1 = 0;
    var x2 = 3, y2 = 0;
    var x3 = 3, y3 = 4;
    var answer = 12;
    return {
      answer: answer,
      question: 'A right triangle has vertices (0,0), (3,0), (3,4). What is the perimeter?'
    };
  } else if (diff === 'Medium') {
    var x1 = 0, y1 = 0;
    var x2 = 4, y2 = 0;
    var x3 = 4, y3 = 3;
    var x4 = 0, y4 = 3;
    var answer = 14;
    return {
      answer: answer,
      question: 'Rectangle with vertices (0,0), (4,0), (4,3), (0,3). Find perimeter.'
    };
  } else {
    var x1 = 1, y1 = 1;
    var x2 = 4, y2 = 1;
    var x3 = 4, y3 = 5;
    var answer = 16;
    return {
      answer: answer,
      question: 'Right triangle vertices: (1,1), (4,1), (4,5). Calculate perimeter.'
    };
  }
};

// ===== Area & Volume =====
SUB_GENERATORS['Grade 10']['Area & Volume'] = {};

SUB_GENERATORS['Grade 10']['Area & Volume']['Area of Regular Polygons'] = function(diff) {
  if (diff === 'Easy') {
    var side = randInt(6, 12);
    var apothem = randInt(4, 8);
    var n = 6;
    var answer = Math.round(0.5 * n * side * apothem);
    return {
      answer: answer,
      question: 'A regular hexagon has side ' + side + ' and apothem ' + apothem + '. What is the area? (A = (1/2) × perimeter × apothem)'
    };
  } else if (diff === 'Medium') {
    var side = randInt(8, 14);
    var apothem = randInt(5, 10);
    var n = 5;
    var answer = Math.round(0.5 * n * side * apothem);
    return {
      answer: answer,
      question: 'Regular pentagon with side ' + side + ' and apothem ' + apothem + '. Find area.'
    };
  } else {
    var side = randInt(10, 16);
    var apothem = randInt(7, 12);
    var n = 8;
    var answer = Math.round(0.5 * n * side * apothem);
    return {
      answer: answer,
      question: 'A regular octagon has side ' + side + ', apothem ' + apothem + '. Calculate area.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Area & Volume']['Area of Trapezoids'] = function(diff) {
  if (diff === 'Easy') {
    var b1 = randInt(6, 12);
    var b2 = randInt(8, 14);
    var h = randInt(5, 10);
    var answer = Math.round(0.5 * (b1 + b2) * h);
    return {
      answer: answer,
      question: 'A trapezoid has bases ' + b1 + ' and ' + b2 + ', height ' + h + '. What is the area?'
    };
  } else if (diff === 'Medium') {
    var b1 = randInt(10, 18);
    var b2 = randInt(14, 22);
    var h = randInt(6, 12);
    var answer = Math.round(0.5 * (b1 + b2) * h);
    return {
      answer: answer,
      question: 'Trapezoid with bases ' + b1 + ', ' + b2 + ' and height ' + h + '. Find area.'
    };
  } else {
    var b1 = randInt(12, 20);
    var b2 = randInt(16, 26);
    var h = randInt(8, 14);
    var answer = Math.round(0.5 * (b1 + b2) * h);
    return {
      answer: answer,
      question: 'Calculate trapezoid area: bases = ' + b1 + ', ' + b2 + '; height = ' + h + '.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Area & Volume']['Volume of Prisms'] = function(diff) {
  if (diff === 'Easy') {
    var l = randInt(4, 10);
    var w = randInt(3, 8);
    var h = randInt(5, 12);
    var answer = l * w * h;
    return {
      answer: answer,
      question: 'A rectangular prism has length ' + l + ', width ' + w + ', height ' + h + '. What is the volume?'
    };
  } else if (diff === 'Medium') {
    var base = randInt(6, 12);
    var height_tri = randInt(4, 10);
    var prism_h = randInt(8, 15);
    var answer = Math.round(0.5 * base * height_tri * prism_h);
    return {
      answer: answer,
      question: 'Triangular prism: triangle base ' + base + ', height ' + height_tri + '; prism height ' + prism_h + '. Find volume.'
    };
  } else {
    var l = randInt(8, 14);
    var w = randInt(6, 12);
    var h = randInt(10, 18);
    var answer = l * w * h;
    return {
      answer: answer,
      question: 'Rectangular prism dimensions: ' + l + ' × ' + w + ' × ' + h + '. Calculate volume.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Area & Volume']['Volume of Pyramids'] = function(diff) {
  if (diff === 'Easy') {
    var l = randInt(6, 12);
    var w = randInt(6, 12);
    var h = randInt(9, 18);
    var answer = Math.round((1/3) * l * w * h);
    return {
      answer: answer,
      question: 'A pyramid has rectangular base ' + l + ' × ' + w + ' and height ' + h + '. What is the volume? (V = (1/3) × base area × h)'
    };
  } else if (diff === 'Medium') {
    var base = randInt(8, 16);
    var h = randInt(12, 24);
    var answer = Math.round((1/3) * base * base * h);
    return {
      answer: answer,
      question: 'Square pyramid with base side ' + base + ' and height ' + h + '. Find volume.'
    };
  } else {
    var l = randInt(10, 18);
    var w = randInt(8, 14);
    var h = randInt(15, 27);
    var answer = Math.round((1/3) * l * w * h);
    return {
      answer: answer,
      question: 'Pyramid: base ' + l + ' × ' + w + ', height ' + h + '. Calculate volume.'
    };
  }
};

SUB_GENERATORS['Grade 10']['Area & Volume']['Volume of Cylinders & Cones'] = function(diff) {
  if (diff === 'Easy') {
    var r = randInt(3, 8);
    var h = randInt(10, 20);
    var answer = Math.round(3.14 * r * r * h);
    return {
      answer: answer,
      question: 'A cylinder has radius ' + r + ' and height ' + h + '. What is the volume? (Use π = 3.14)'
    };
  } else if (diff === 'Medium') {
    var r = randInt(4, 9);
    var h = randInt(12, 24);
    var answer = Math.round((1/3) * 3.14 * r * r * h);
    return {
      answer: answer,
      question: 'Cone with radius ' + r + ' and height ' + h + '. Find volume. (V = (1/3)πr²h, π = 3.14)'
    };
  } else {
    var r = randInt(5, 10);
    var h = randInt(15, 30);
    var answer = Math.round(3.14 * r * r * h);
    return {
      answer: answer,
      question: 'Cylinder: radius = ' + r + ', height = ' + h + '. Calculate volume. (π = 3.14)'
    };
  }
};

SUB_GENERATORS['Grade 10']['Area & Volume']['Cross-Section Identification'] = function(diff) {
  if (diff === 'Easy') {
    var answer = 0;
    return {
      answer: answer,
      question: 'A plane cuts through a cylinder parallel to its base. What shape is the cross-section? (0 = circle, 3 = triangle, 4 = rectangle)'
    };
  } else if (diff === 'Medium') {
    var answer = 3;
    return {
      answer: answer,
      question: 'A vertical plane cuts through a pyramid with square base. What is the cross-section? (0 = circle, 3 = triangle, 4 = rectangle)'
    };
  } else {
    var answer = 4;
    return {
      answer: answer,
      question: 'A plane cuts through a cylinder perpendicular to its base. What is the cross-section? (0 = circle, 3 = triangle, 4 = rectangle)'
    };
  }
};
SUB_GENERATORS['Grade 11'] = {};

// ==================== Complex Numbers ====================
SUB_GENERATORS['Grade 11']['Complex Numbers'] = {};

SUB_GENERATORS['Grade 11']['Complex Numbers']['Powers of i'] = function(diff) {
  var power = diff === 'Easy' ? randInt(2, 8) : diff === 'Medium' ? randInt(9, 20) : randInt(21, 100);
  var remainder = power % 4;
  var realValues = [1, 0, -1, 0];
  var answer = realValues[remainder];

  var question = 'What is the real part of i^' + power + '?';
  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Complex Numbers']['Adding & Subtracting Complex Numbers'] = function(diff) {
  var a = randNonZero(diff === 'Easy' ? 5 : diff === 'Medium' ? 10 : 15);
  var b = randNonZero(diff === 'Easy' ? 5 : diff === 'Medium' ? 10 : 15);
  var c = randNonZero(diff === 'Easy' ? 5 : diff === 'Medium' ? 10 : 15);
  var d = randNonZero(diff === 'Easy' ? 5 : diff === 'Medium' ? 10 : 15);

  var operation = Math.random() < 0.5 ? '+' : '-';
  var askPart = Math.random() < 0.5 ? 'real' : 'imaginary';

  var realResult, imagResult;
  if (operation === '+') {
    realResult = a + c;
    imagResult = b + d;
  } else {
    realResult = a - c;
    imagResult = b - d;
  }

  var z1 = a + ' ' + (b >= 0 ? '+ ' + b : '- ' + Math.abs(b)) + 'i';
  var z2 = c + ' ' + (d >= 0 ? '+ ' + d : '- ' + Math.abs(d)) + 'i';

  var question = 'What is the ' + askPart + ' part of (' + z1 + ') ' + operation + ' (' + z2 + ')?';
  var answer = askPart === 'real' ? realResult : imagResult;

  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Complex Numbers']['Multiplying Complex Numbers'] = function(diff) {
  var a = randNonZero(diff === 'Easy' ? 5 : diff === 'Medium' ? 8 : 12);
  var b = randNonZero(diff === 'Easy' ? 5 : diff === 'Medium' ? 8 : 12);
  var c = randNonZero(diff === 'Easy' ? 5 : diff === 'Medium' ? 8 : 12);
  var d = randNonZero(diff === 'Easy' ? 5 : diff === 'Medium' ? 8 : 12);

  var realPart = a * c - b * d;
  var imagPart = a * d + b * c;

  var askPart = Math.random() < 0.5 ? 'real' : 'imaginary';

  var z1 = a + ' ' + (b >= 0 ? '+ ' + b : '- ' + Math.abs(b)) + 'i';
  var z2 = c + ' ' + (d >= 0 ? '+ ' + d : '- ' + Math.abs(d)) + 'i';

  var question = 'What is the ' + askPart + ' part of (' + z1 + ') * (' + z2 + ')?';
  var answer = askPart === 'real' ? realPart : imagPart;

  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Complex Numbers']['Complex Conjugates'] = function(diff) {
  var a = randNonZero(diff === 'Easy' ? 8 : diff === 'Medium' ? 15 : 25);
  var b = randNonZero(diff === 'Easy' ? 8 : diff === 'Medium' ? 15 : 25);

  var askPart = Math.random() < 0.5 ? 'real' : 'imaginary';

  var z = a + ' ' + (b >= 0 ? '+ ' + b : '- ' + Math.abs(b)) + 'i';

  var question = 'What is the ' + askPart + ' part of the conjugate of ' + z + '?';
  var answer = askPart === 'real' ? a : -b;

  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Complex Numbers']['Absolute Value (Modulus)'] = function(diff) {
  var triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  var triple = triples[randInt(0, diff === 'Easy' ? 2 : diff === 'Medium' ? 4 : triples.length - 1)];

  var a = triple[0];
  var b = triple[1];
  var modulus = triple[2];

  if (Math.random() < 0.5) {
    a = -a;
  }
  if (Math.random() < 0.5) {
    b = -b;
  }

  var z = a + ' ' + (b >= 0 ? '+ ' + b : '- ' + Math.abs(b)) + 'i';

  var question = 'What is the absolute value (modulus) of ' + z + '?';
  return {question: question, answer: modulus};
};

SUB_GENERATORS['Grade 11']['Complex Numbers']['Solving Equations with Complex Solutions'] = function(diff) {
  var a = diff === 'Easy' ? 1 : randInt(1, diff === 'Medium' ? 3 : 5);
  var b = randNonZero(diff === 'Easy' ? 10 : diff === 'Medium' ? 15 : 20);
  var c = randInt(diff === 'Easy' ? 5 : diff === 'Medium' ? 10 : 20, diff === 'Easy' ? 15 : diff === 'Medium' ? 25 : 40);

  var discriminant = b * b - 4 * a * c;

  var question = 'What is the discriminant of ' + a + 'x^2 ' + (b >= 0 ? '+ ' + b : '- ' + Math.abs(b)) + 'x ' + (c >= 0 ? '+ ' + c : '- ' + Math.abs(c)) + ' = 0?';
  return {question: question, answer: discriminant};
};

// ==================== Polynomial Functions ====================
SUB_GENERATORS['Grade 11']['Polynomial Functions'] = {};

SUB_GENERATORS['Grade 11']['Polynomial Functions']['Evaluate Polynomials'] = function(diff) {
  var x = randInt(-5, 5);
  var a = randNonZero(diff === 'Easy' ? 3 : 5);
  var b = randInt(-10, 10);
  var c = randInt(-10, 10);

  var result;
  if (diff === 'Easy') {
    result = a * x * x + b * x + c;
    var question = 'Evaluate ' + a + 'x^2 ' + (b >= 0 ? '+ ' + b : '- ' + Math.abs(b)) + 'x ' + (c >= 0 ? '+ ' + c : '- ' + Math.abs(c)) + ' when x = ' + x + '.';
    return {question: question, answer: result};
  } else {
    var d = randInt(-10, 10);
    result = a * x * x * x + b * x * x + c * x + d;
    var question = 'Evaluate ' + a + 'x^3 ' + (b >= 0 ? '+ ' + b : '- ' + Math.abs(b)) + 'x^2 ' + (c >= 0 ? '+ ' + c : '- ' + Math.abs(c)) + 'x ' + (d >= 0 ? '+ ' + d : '- ' + Math.abs(d)) + ' when x = ' + x + '.';
    return {question: question, answer: result};
  }
};

SUB_GENERATORS['Grade 11']['Polynomial Functions']['End Behavior'] = function(diff) {
  var degree = diff === 'Easy' ? randInt(2, 4) : diff === 'Medium' ? randInt(3, 6) : randInt(5, 9);
  var leadCoeff = randNonZero(10);

  var isEven = degree % 2 === 0;
  var answer;

  if (isEven) {
    answer = leadCoeff > 0 ? 1 : -1;
  } else {
    answer = leadCoeff > 0 ? 1 : -1;
  }

  var question = 'As x approaches positive infinity, does f(x) = ' + leadCoeff + 'x^' + degree + ' + ... approach positive infinity (answer 1) or negative infinity (answer -1)?';
  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Polynomial Functions']['Zeros from Factored Form'] = function(diff) {
  var zero1 = randInt(-10, 10);
  var zero2 = randInt(-10, 10);
  var zero3 = diff === 'Hard' ? randInt(-10, 10) : null;

  var zeros = diff === 'Hard' ? [zero1, zero2, zero3] : [zero1, zero2];
  zeros.sort(function(a, b) { return a - b; });

  var askType = Math.random() < 0.5 ? 'smallest' : 'largest';
  var answer = askType === 'smallest' ? zeros[0] : zeros[zeros.length - 1];

  var factor1 = '(x ' + (-zero1 >= 0 ? '+ ' + (-zero1) : '- ' + Math.abs(-zero1)) + ')';
  var factor2 = '(x ' + (-zero2 >= 0 ? '+ ' + (-zero2) : '- ' + Math.abs(-zero2)) + ')';

  var question;
  if (diff === 'Hard') {
    var factor3 = '(x ' + (-zero3 >= 0 ? '+ ' + (-zero3) : '- ' + Math.abs(-zero3)) + ')';
    question = 'What is the ' + askType + ' zero of f(x) = ' + factor1 + factor2 + factor3 + '?';
  } else {
    question = 'What is the ' + askType + ' zero of f(x) = ' + factor1 + factor2 + '?';
  }

  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Polynomial Functions']['Factor by Grouping'] = function(diff) {
  var a = randInt(1, diff === 'Easy' ? 3 : 5);
  var b = randInt(1, diff === 'Easy' ? 3 : 5);
  var c = randNonZero(diff === 'Easy' ? 5 : 8);
  var d = c * b / a;

  if (d !== Math.floor(d)) {
    d = c;
  }

  var commonFactor = randInt(1, diff === 'Hard' ? 3 : 2);

  var coeff1 = a * commonFactor;
  var coeff2 = b * commonFactor;
  var coeff3 = c * commonFactor;
  var coeff4 = d * commonFactor;

  var question = 'If ' + coeff1 + 'x^3 ' + (coeff2 >= 0 ? '+ ' + coeff2 : '- ' + Math.abs(coeff2)) + 'x^2 ' + (coeff3 >= 0 ? '+ ' + coeff3 : '- ' + Math.abs(coeff3)) + 'x ' + (coeff4 >= 0 ? '+ ' + coeff4 : '- ' + Math.abs(coeff4)) + ' factors by grouping, what is the common factor from the first two terms? (Answer with the coefficient)';

  var answer = commonFactor * a;
  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Polynomial Functions']['Remainder Theorem'] = function(diff) {
  var c = randInt(-5, 5);
  var a = randNonZero(diff === 'Easy' ? 3 : 5);
  var b = randInt(-10, 10);
  var d = randInt(-10, 10);

  var remainder = a * c * c + b * c + d;

  var question = 'What is the remainder when ' + a + 'x^2 ' + (b >= 0 ? '+ ' + b : '- ' + Math.abs(b)) + 'x ' + (d >= 0 ? '+ ' + d : '- ' + Math.abs(d)) + ' is divided by (x ' + (-c >= 0 ? '+ ' + (-c) : '- ' + Math.abs(-c)) + ')?';

  return {question: question, answer: remainder};
};

SUB_GENERATORS['Grade 11']['Polynomial Functions']['Degree & Leading Coefficient'] = function(diff) {
  var degree = diff === 'Easy' ? randInt(2, 4) : diff === 'Medium' ? randInt(3, 6) : randInt(5, 8);
  var leadCoeff = randNonZero(15);

  var askType = Math.random() < 0.5 ? 'degree' : 'leading coefficient';

  var terms = leadCoeff + 'x^' + degree;
  for (var i = degree - 1; i >= 0; i--) {
    if (i > 0 && Math.random() < 0.7) {
      var coeff = randInt(-10, 10);
      terms += ' ' + (coeff >= 0 ? '+ ' + coeff : '- ' + Math.abs(coeff)) + 'x^' + i;
    }
  }

  var question = 'What is the ' + askType + ' of f(x) = ' + terms + '?';
  var answer = askType === 'degree' ? degree : leadCoeff;

  return {question: question, answer: answer};
};

// ==================== Rational Expressions ====================
SUB_GENERATORS['Grade 11']['Rational Expressions'] = {};

SUB_GENERATORS['Grade 11']['Rational Expressions']['Simplify Rational Expressions'] = function(diff) {
  var factor = randInt(2, diff === 'Easy' ? 4 : 6);
  var a = randInt(1, 5);
  var b = randInt(1, 5);

  var num = factor * a;
  var den = factor * b;

  var question = 'When ' + num + 'x / ' + den + 'x is simplified, what is the numerator?';
  return {question: question, answer: a};
};

SUB_GENERATORS['Grade 11']['Rational Expressions']['Multiply & Divide'] = function(diff) {
  var a = randInt(2, 6);
  var b = randInt(2, 6);
  var c = randInt(2, 6);
  var d = randInt(2, 6);

  var operation = Math.random() < 0.5 ? 'multiply' : 'divide';

  var question;
  var answer;

  if (operation === 'multiply') {
    answer = a * c;
    question = 'What is the numerator of (' + a + 'x / ' + b + ') * (' + c + 'x / ' + d + ')?';
  } else {
    answer = a * d;
    question = 'What is the numerator of (' + a + 'x / ' + b + ') / (' + c + 'x / ' + d + ')?';
  }

  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Rational Expressions']['Add & Subtract (Like Denominators)'] = function(diff) {
  var a = randNonZero(10);
  var b = randNonZero(10);
  var den = randInt(2, diff === 'Easy' ? 5 : 10);

  var operation = Math.random() < 0.5 ? '+' : '-';
  var answer = operation === '+' ? a + b : a - b;

  var question = 'What is the numerator of (' + a + 'x / ' + den + ') ' + operation + ' (' + b + 'x / ' + den + ')?';
  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Rational Expressions']['Add & Subtract (Unlike Denominators)'] = function(diff) {
  var a = randInt(1, 5);
  var b = randInt(1, 5);
  var den1 = randInt(2, diff === 'Easy' ? 4 : 6);
  var den2 = randInt(2, diff === 'Easy' ? 4 : 6);

  var lcm = den1 * den2;
  var operation = Math.random() < 0.5 ? '+' : '-';

  var numerator = operation === '+' ? a * den2 + b * den1 : a * den2 - b * den1;

  var question = 'What is the numerator of (' + a + ' / ' + den1 + ') ' + operation + ' (' + b + ' / ' + den2 + ') when expressed with denominator ' + lcm + '?';
  return {question: question, answer: numerator};
};

SUB_GENERATORS['Grade 11']['Rational Expressions']['Solve Rational Equations'] = function(diff) {
  var a = randInt(1, 5);
  var b = randInt(1, 10);
  var c = randInt(1, 5);

  var x = randInt(1, diff === 'Easy' ? 5 : 10);
  var result = a * x + b;

  var question = 'Solve for x: ' + a + 'x + ' + b + ' = ' + result + '. What is x?';
  return {question: question, answer: x};
};

SUB_GENERATORS['Grade 11']['Rational Expressions']['Find Excluded Values'] = function(diff) {
  var excluded = randNonZero(diff === 'Easy' ? 5 : diff === 'Medium' ? 10 : 15);

  var question = 'What value is excluded from the domain of f(x) = 1 / (x ' + (-excluded >= 0 ? '+ ' + (-excluded) : '- ' + Math.abs(-excluded)) + ')?';
  return {question: question, answer: excluded};
};

// ==================== Exponential & Logarithmic Functions ====================
SUB_GENERATORS['Grade 11']['Exponential & Logarithmic Functions'] = {};

SUB_GENERATORS['Grade 11']['Exponential & Logarithmic Functions']['Evaluate Exponential Functions'] = function(diff) {
  var a = randInt(1, diff === 'Easy' ? 3 : 5);
  var b = randInt(2, 4);
  var x = diff === 'Easy' ? randInt(1, 3) : diff === 'Medium' ? randInt(2, 4) : randInt(3, 5);

  var answer = a * Math.pow(b, x);

  var question = 'Evaluate f(x) = ' + a + ' * ' + b + '^x when x = ' + x + '.';
  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Exponential & Logarithmic Functions']['Growth & Decay'] = function(diff) {
  var initial = randInt(100, 1000);
  var rate = diff === 'Easy' ? 2 : diff === 'Medium' ? 3 : randInt(2, 4);
  var time = diff === 'Easy' ? 2 : diff === 'Medium' ? 3 : 4;

  var isGrowth = Math.random() < 0.5;
  var answer;

  if (isGrowth) {
    answer = Math.round(initial * Math.pow(rate, time));
    var question = 'If a population starts at ' + initial + ' and grows by a factor of ' + rate + ' each year, what is the population after ' + time + ' years?';
  } else {
    answer = Math.round(initial / Math.pow(rate, time));
    var question = 'If a quantity starts at ' + initial + ' and decays by a factor of ' + rate + ' each year, what is the quantity after ' + time + ' years?';
  }

  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Exponential & Logarithmic Functions']['Convert Exponential to Log'] = function(diff) {
  var base = randInt(2, diff === 'Easy' ? 5 : 8);
  var exponent = randInt(1, diff === 'Easy' ? 3 : 5);
  var result = Math.pow(base, exponent);

  var question = 'Convert ' + base + '^x = ' + result + ' to logarithmic form. What is x?';
  return {question: question, answer: exponent};
};

SUB_GENERATORS['Grade 11']['Exponential & Logarithmic Functions']['Evaluate Logarithms'] = function(diff) {
  var base = randInt(2, diff === 'Easy' ? 5 : 8);
  var exponent = randInt(1, diff === 'Easy' ? 3 : 5);
  var argument = Math.pow(base, exponent);

  var question = 'Evaluate log_' + base + '(' + argument + ').';
  return {question: question, answer: exponent};
};

SUB_GENERATORS['Grade 11']['Exponential & Logarithmic Functions']['Log Properties'] = function(diff) {
  var base = randInt(2, 5);
  var a = randInt(2, diff === 'Easy' ? 4 : 6);
  var b = randInt(2, diff === 'Easy' ? 4 : 6);

  var property = randInt(0, 2);
  var answer;
  var question;

  if (property === 0) {
    answer = a + b;
    question = 'If log_' + base + '(x) = ' + a + ' and log_' + base + '(y) = ' + b + ', what is log_' + base + '(xy)?';
  } else if (property === 1) {
    answer = a - b;
    question = 'If log_' + base + '(x) = ' + a + ' and log_' + base + '(y) = ' + b + ', what is log_' + base + '(x/y)?';
  } else {
    var power = randInt(2, 4);
    answer = a * power;
    question = 'If log_' + base + '(x) = ' + a + ', what is log_' + base + '(x^' + power + ')?';
  }

  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Exponential & Logarithmic Functions']['Solve Exponential Equations'] = function(diff) {
  var base = randInt(2, 5);
  var x = randInt(1, diff === 'Easy' ? 3 : diff === 'Medium' ? 4 : 5);
  var result = Math.pow(base, x);

  var question = 'Solve ' + base + '^x = ' + result + '. What is x?';
  return {question: question, answer: x};
};

// ==================== Trigonometric Functions ====================
SUB_GENERATORS['Grade 11']['Trigonometric Functions'] = {};

SUB_GENERATORS['Grade 11']['Trigonometric Functions']['Convert Degrees to Radians'] = function(diff) {
  var angles = diff === 'Easy' ? [30, 45, 60, 90, 180] : diff === 'Medium' ? [30, 45, 60, 90, 120, 135, 150, 180] : [30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
  var degrees = angles[randInt(0, angles.length - 1)];

  var coefficient = degrees / 180;
  var simplified = coefficient;

  if (coefficient === 0.5) simplified = 0.5;
  else if (coefficient === 1) simplified = 1;
  else if (coefficient === 2) simplified = 2;
  else if (coefficient === 0.25) simplified = 0.25;
  else if (coefficient === 0.75) simplified = 0.75;
  else simplified = Math.round(coefficient * 1000) / 1000;

  var question = 'Convert ' + degrees + ' degrees to radians. Answer with the coefficient of pi (e.g., for pi/2, answer 0.5).';
  return {question: question, answer: simplified};
};

SUB_GENERATORS['Grade 11']['Trigonometric Functions']['Convert Radians to Degrees'] = function(diff) {
  var coefficients = diff === 'Easy' ? [0.5, 1, 2] : diff === 'Medium' ? [0.25, 0.5, 0.75, 1, 1.5, 2] : [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  var coefficient = coefficients[randInt(0, coefficients.length - 1)];

  var degrees = coefficient * 180;

  var question = 'Convert ' + coefficient + 'pi radians to degrees.';
  return {question: question, answer: degrees};
};

SUB_GENERATORS['Grade 11']['Trigonometric Functions']['Unit Circle Values'] = function(diff) {
  var angles = diff === 'Easy' ? [30, 45, 60] : diff === 'Medium' ? [0, 30, 45, 60, 90] : [0, 30, 45, 60, 90, 120, 135, 150, 180];
  var angle = angles[randInt(0, angles.length - 1)];

  var func = Math.random() < 0.5 ? 'sin' : 'cos';

  var answer;
  if (func === 'sin') {
    if (angle === 0) answer = 0;
    else if (angle === 30) answer = 0.5;
    else if (angle === 45) answer = 0.71;
    else if (angle === 60) answer = 0.87;
    else if (angle === 90) answer = 1;
    else if (angle === 120) answer = 0.87;
    else if (angle === 135) answer = 0.71;
    else if (angle === 150) answer = 0.5;
    else if (angle === 180) answer = 0;
  } else {
    if (angle === 0) answer = 1;
    else if (angle === 30) answer = 0.87;
    else if (angle === 45) answer = 0.71;
    else if (angle === 60) answer = 0.5;
    else if (angle === 90) answer = 0;
    else if (angle === 120) answer = -0.5;
    else if (angle === 135) answer = -0.71;
    else if (angle === 150) answer = -0.87;
    else if (angle === 180) answer = -1;
  }

  var question = 'What is ' + func + '(' + angle + ' degrees)? (Answer as decimal)';
  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Trigonometric Functions']['Trig Function Evaluation'] = function(diff) {
  var angle = diff === 'Easy' ? [0, 30, 45, 60, 90][randInt(0, 4)] : diff === 'Medium' ? [0, 30, 45, 60, 90, 180][randInt(0, 5)] : [0, 30, 45, 60, 90, 120, 135, 150, 180][randInt(0, 8)];

  var func = ['sin', 'cos'][randInt(0, 1)];

  var answer;
  if (func === 'sin') {
    if (angle === 0) answer = 0;
    else if (angle === 30) answer = 0.5;
    else if (angle === 45) answer = 0.71;
    else if (angle === 60) answer = 0.87;
    else if (angle === 90) answer = 1;
    else if (angle === 120) answer = 0.87;
    else if (angle === 135) answer = 0.71;
    else if (angle === 150) answer = 0.5;
    else if (angle === 180) answer = 0;
  } else {
    if (angle === 0) answer = 1;
    else if (angle === 30) answer = 0.87;
    else if (angle === 45) answer = 0.71;
    else if (angle === 60) answer = 0.5;
    else if (angle === 90) answer = 0;
    else if (angle === 120) answer = -0.5;
    else if (angle === 135) answer = -0.71;
    else if (angle === 150) answer = -0.87;
    else if (angle === 180) answer = -1;
  }

  var question = 'Evaluate ' + func + '(' + angle + ' degrees).';
  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Trigonometric Functions']['Amplitude & Period'] = function(diff) {
  var A = randInt(1, diff === 'Easy' ? 5 : 10);
  var B = diff === 'Easy' ? randInt(1, 3) : diff === 'Medium' ? randInt(1, 5) : randInt(1, 8);

  if (Math.random() < 0.3) {
    A = -A;
  }

  var askType = Math.random() < 0.5 ? 'amplitude' : 'period';

  var amplitude = Math.abs(A);
  var period = Math.round(2 * 3.14 / B * 100) / 100;

  var question = 'What is the ' + askType + ' of y = ' + A + ' * sin(' + B + 'x)?';
  var answer = askType === 'amplitude' ? amplitude : period;

  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Trigonometric Functions']['Inverse Trig Values'] = function(diff) {
  var values = [
    {func: 'arcsin', arg: 0.5, ans: 30},
    {func: 'arcsin', arg: 0.71, ans: 45},
    {func: 'arcsin', arg: 0.87, ans: 60},
    {func: 'arccos', arg: 0.87, ans: 30},
    {func: 'arccos', arg: 0.71, ans: 45},
    {func: 'arccos', arg: 0.5, ans: 60},
    {func: 'arctan', arg: 1, ans: 45}
  ];

  var maxIndex = diff === 'Easy' ? 3 : diff === 'Medium' ? 5 : values.length - 1;
  var selected = values[randInt(0, maxIndex)];

  var question = 'Evaluate ' + selected.func + '(' + selected.arg + ') in degrees.';
  return {question: question, answer: selected.ans};
};

// ==================== Probability & Combinatorics ====================
SUB_GENERATORS['Grade 11']['Probability & Combinatorics'] = {};

SUB_GENERATORS['Grade 11']['Probability & Combinatorics']['Permutations'] = function(diff) {
  var n = diff === 'Easy' ? randInt(4, 6) : diff === 'Medium' ? randInt(5, 8) : randInt(6, 10);
  var r = diff === 'Easy' ? randInt(2, 3) : diff === 'Medium' ? randInt(2, 4) : randInt(3, 5);

  if (r > n) {
    var temp = n;
    n = r;
    r = temp;
  }

  var answer = nPr(n, r);

  var question = 'Calculate P(' + n + ', ' + r + ').';
  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Probability & Combinatorics']['Combinations'] = function(diff) {
  var n = diff === 'Easy' ? randInt(4, 6) : diff === 'Medium' ? randInt(5, 8) : randInt(6, 10);
  var r = diff === 'Easy' ? randInt(2, 3) : diff === 'Medium' ? randInt(2, 4) : randInt(3, 5);

  if (r > n) {
    var temp = n;
    n = r;
    r = temp;
  }

  var answer = nCr(n, r);

  var question = 'Calculate C(' + n + ', ' + r + ').';
  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Probability & Combinatorics']['Factorial Expressions'] = function(diff) {
  var n = diff === 'Easy' ? randInt(3, 5) : diff === 'Medium' ? randInt(4, 6) : randInt(5, 7);

  var answer = factorial(n);

  var question = 'Calculate ' + n + '!';
  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Probability & Combinatorics']['Independent Events'] = function(diff) {
  var denomA = diff === 'Easy' ? randInt(2, 4) : randInt(2, 6);
  var denomB = diff === 'Easy' ? randInt(2, 4) : randInt(2, 6);
  var numA = randInt(1, denomA - 1);
  var numB = randInt(1, denomB - 1);

  var probA = numA / denomA;
  var probB = numB / denomB;
  var result = probA * probB;

  var answer = Math.round(result * 100) / 100;

  var question = 'If P(A) = ' + numA + '/' + denomA + ' and P(B) = ' + numB + '/' + denomB + ', what is P(A and B) if A and B are independent? (Round to hundredths)';
  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Probability & Combinatorics']['Conditional Probability'] = function(diff) {
  var total = diff === 'Easy' ? randInt(10, 20) : diff === 'Medium' ? randInt(15, 30) : randInt(20, 40);
  var eventA = randInt(Math.floor(total * 0.3), Math.floor(total * 0.7));
  var eventAandB = randInt(1, Math.min(eventA, Math.floor(total * 0.4)));

  var answer = Math.round(eventAandB / eventA * 100) / 100;

  var question = 'If there are ' + total + ' outcomes, ' + eventA + ' satisfy event A, and ' + eventAandB + ' satisfy both A and B, what is P(B|A)? (Round to hundredths)';
  return {question: question, answer: answer};
};

SUB_GENERATORS['Grade 11']['Probability & Combinatorics']['Binomial Probability'] = function(diff) {
  var n = diff === 'Easy' ? randInt(3, 5) : diff === 'Medium' ? randInt(4, 6) : randInt(5, 8);
  var k = randInt(0, Math.min(n, diff === 'Easy' ? 2 : diff === 'Medium' ? 3 : 4));
  var p = diff === 'Easy' ? 0.5 : [0.25, 0.5, 0.75][randInt(0, 2)];

  var prob = nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  var answer = Math.round(prob * 100) / 100;

  var question = 'What is the probability of exactly ' + k + ' successes in ' + n + ' trials with success probability ' + p + '? (Round to hundredths)';
  return {question: question, answer: answer};
};
SUB_GENERATORS['Grade 12'] = {};

// ============================================================================
// ADVANCED FUNCTIONS
// ============================================================================
SUB_GENERATORS['Grade 12']['Advanced Functions'] = {};

SUB_GENERATORS['Grade 12']['Advanced Functions']['Piecewise Function Evaluation'] = function(diff) {
  var a = randInt(1, 5);
  var b = randInt(1, 5);
  var c = randInt(-5, 5);
  var d = randInt(-5, 5);
  var split = randInt(-2, 2);

  var evalX;
  var ans;
  if (diff === 'Easy') {
    evalX = split + randInt(1, 3);
    ans = a * evalX + b;
  } else if (diff === 'Medium') {
    evalX = (Math.random() < 0.5) ? (split - randInt(1, 3)) : (split + randInt(1, 3));
    if (evalX < split) {
      ans = a * evalX + b;
    } else {
      ans = c * evalX + d;
    }
  } else {
    evalX = split;
    ans = a * evalX + b;
  }

  var question = 'Given f(x) = ' + a + 'x+' + paren(b) + ' if x<' + split + ', and f(x) = ' + c + 'x+' + paren(d) + ' if x>=' + split + '. Find f(' + evalX + ')';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Advanced Functions']['Function Composition'] = function(diff) {
  var a = randInt(1, 4);
  var b = randInt(-5, 5);
  var c = randInt(1, 4);
  var d = randInt(-5, 5);

  var x;
  if (diff === 'Easy') {
    x = randInt(0, 3);
  } else if (diff === 'Medium') {
    x = randInt(-3, 5);
  } else {
    x = randInt(-5, 5);
  }

  var gx = c * x + d;
  var ans = a * gx + b;

  var question = 'If f(x) = ' + a + 'x+' + paren(b) + ' and g(x) = ' + c + 'x+' + paren(d) + ', find f(g(' + x + '))';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Advanced Functions']['Inverse Functions'] = function(diff) {
  var a = randNonZero(5);
  var b = randInt(-8, 8);

  var c;
  if (diff === 'Easy') {
    c = b + a * randInt(1, 5);
  } else if (diff === 'Medium') {
    c = b + a * randInt(-5, 5);
  } else {
    c = randInt(-20, 20);
  }

  var ans = Math.round((c - b) / a);

  var question = 'If f(x) = ' + a + 'x+' + paren(b) + ', find f^(-1)(' + c + ')';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Advanced Functions']['Even & Odd Functions'] = function(diff) {
  var choice = randInt(0, 2);
  var ans;
  var funcStr;

  if (choice === 0) {
    var a = randInt(1, 5);
    var pow = 2 * randInt(1, 3);
    funcStr = 'f(x) = ' + a + 'x^' + pow;
    ans = 1;
  } else if (choice === 1) {
    var a = randInt(1, 5);
    var pow = 2 * randInt(1, 3) + 1;
    funcStr = 'f(x) = ' + a + 'x^' + pow;
    ans = -1;
  } else {
    var a = randInt(1, 5);
    var b = randNonZero(5);
    funcStr = 'f(x) = ' + a + 'x^2+' + paren(b);
    ans = 0;
  }

  var question = 'Is ' + funcStr + ' even (1), odd (-1), or neither (0)?';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Advanced Functions']['Domain Restrictions'] = function(diff) {
  var type = Math.random() < 0.5 ? 'rational' : 'sqrt';
  var a = randInt(-10, 10);
  var ans;
  var question;

  if (type === 'rational') {
    ans = a;
    question = 'What value is excluded from the domain of f(x) = 1/(x' + (a >= 0 ? '-' : '+') + Math.abs(a) + ')?';
  } else {
    ans = a;
    if (diff === 'Easy') {
      a = randInt(0, 5);
    }
    question = 'What is the minimum value of x in the domain of f(x) = sqrt(x' + (a >= 0 ? '-' : '+') + Math.abs(a) + ')?';
  }

  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Advanced Functions']['Asymptotes'] = function(diff) {
  var a = randInt(1, 5);
  var b = randInt(-8, 8);
  var c = randNonZero(5);
  var d = randInt(-8, 8);

  var ans = Math.round(-d / c * 100) / 100;

  var question = 'Find the vertical asymptote of f(x) = (' + a + 'x+' + paren(b) + ')/(' + c + 'x+' + paren(d) + ')';
  return { question: question, answer: ans };
};

// ============================================================================
// LIMITS
// ============================================================================
SUB_GENERATORS['Grade 12']['Limits'] = {};

SUB_GENERATORS['Grade 12']['Limits']['Limits of Polynomials'] = function(diff) {
  var a = randInt(1, 5);
  var b = randInt(-10, 10);
  var c = randInt(-10, 10);

  var x;
  if (diff === 'Easy') {
    x = randInt(0, 3);
  } else if (diff === 'Medium') {
    x = randInt(-3, 5);
  } else {
    x = randInt(-5, 5);
  }

  var ans = a * x * x + b * x + c;

  var question = 'Find lim(x->' + x + ') of ' + a + 'x^2+' + paren(b) + 'x+' + paren(c);
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Limits']['Limits with Factoring'] = function(diff) {
  var a = (diff === 'Easy') ? randInt(1, 5) : randInt(-5, 5);
  if (a === 0) a = 1;

  var ans = 2 * a;

  var question = 'Find lim(x->' + a + ') of (x^2-' + (a * a) + ')/(x-' + a + ')';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Limits']['One-Sided Limits'] = function(diff) {
  var a = randInt(1, 4);
  var b = randInt(1, 4);
  var c = randInt(-5, 5);
  var d = randInt(-5, 5);
  var split = randInt(-2, 2);

  var side = (Math.random() < 0.5) ? 'left' : 'right';
  var ans;

  if (side === 'left') {
    ans = a * split + b;
    question = 'Find lim(x->' + split + '-) of f(x) where f(x)=' + a + 'x+' + paren(b) + ' for x<' + split + ' and ' + c + 'x+' + paren(d) + ' for x>=' + split;
  } else {
    ans = c * split + d;
    question = 'Find lim(x->' + split + '+) of f(x) where f(x)=' + a + 'x+' + paren(b) + ' for x<' + split + ' and ' + c + 'x+' + paren(d) + ' for x>=' + split;
  }

  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Limits']['Limits at Infinity'] = function(diff) {
  var a = randInt(1, 5);
  var b = randInt(1, 5);

  var ans;
  var question;

  if (diff === 'Easy') {
    ans = Math.round(a / b * 100) / 100;
    question = 'Find lim(x->infinity) of (' + a + 'x)/(' + b + 'x)';
  } else if (diff === 'Medium') {
    ans = Math.round(a / b * 100) / 100;
    question = 'Find lim(x->infinity) of (' + a + 'x^2+1)/(' + b + 'x^2+2)';
  } else {
    ans = 0;
    question = 'Find lim(x->infinity) of (' + a + 'x)/(' + b + 'x^2)';
  }

  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Limits']['Evaluate Limit from Table'] = function(diff) {
  var a = randInt(-5, 5);
  var target = randInt(1, 5);

  var x1 = target - 0.1;
  var x2 = target - 0.01;
  var x3 = target + 0.01;
  var x4 = target + 0.1;

  var ans = a * target;

  var question = 'Given a table where x approaches ' + target + ' and f(x) values approach a limit. If f(' + x1.toFixed(2) + ')=' + (a * x1).toFixed(1) + ', f(' + x2.toFixed(2) + ')=' + (a * x2).toFixed(2) + ', f(' + x3.toFixed(2) + ')=' + (a * x3).toFixed(2) + ', f(' + x4.toFixed(2) + ')=' + (a * x4).toFixed(1) + ', find lim(x->' + target + ') f(x)';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Limits']['Continuity Check'] = function(diff) {
  var a = randInt(1, 5);
  var b = randInt(-5, 5);
  var c = randInt(1, 5);
  var d = randInt(-5, 5);
  var x0 = randInt(-3, 3);

  var leftVal = a * x0 + b;
  var rightVal;
  var ans;

  if (diff === 'Easy') {
    rightVal = leftVal;
    ans = 1;
  } else {
    rightVal = c * x0 + d;
    ans = (leftVal === rightVal) ? 1 : 0;
  }

  var question = 'Is f(x) continuous at x=' + x0 + ' if f(x)=' + a + 'x+' + paren(b) + ' for x<' + x0 + ' and ' + c + 'x+' + paren(d) + ' for x>=' + x0 + '? (1=yes, 0=no)';
  return { question: question, answer: ans };
};

// ============================================================================
// SEQUENCES & SERIES
// ============================================================================
SUB_GENERATORS['Grade 12']['Sequences & Series'] = {};

SUB_GENERATORS['Grade 12']['Sequences & Series']['Arithmetic Series Sum'] = function(diff) {
  var a1 = randInt(1, 10);
  var d = randInt(1, 5);
  var n;

  if (diff === 'Easy') {
    n = randInt(3, 6);
  } else if (diff === 'Medium') {
    n = randInt(6, 12);
  } else {
    n = randInt(10, 20);
  }

  var an = a1 + (n - 1) * d;
  var ans = Math.round(n * (a1 + an) / 2);

  var question = 'Find the sum of the arithmetic series with first term ' + a1 + ', common difference ' + d + ', and ' + n + ' terms';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Sequences & Series']['Geometric Series Sum'] = function(diff) {
  var a1 = randInt(1, 5);
  var r;
  var n;

  if (diff === 'Easy') {
    r = 2;
    n = randInt(3, 5);
  } else if (diff === 'Medium') {
    r = randInt(2, 3);
    n = randInt(4, 6);
  } else {
    r = randInt(2, 4);
    n = randInt(5, 8);
  }

  var ans = Math.round(a1 * (1 - Math.pow(r, n)) / (1 - r));

  var question = 'Find the sum of the geometric series with first term ' + a1 + ', ratio ' + r + ', and ' + n + ' terms';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Sequences & Series']['Infinite Geometric Series'] = function(diff) {
  var a1 = randInt(2, 10);
  var r;

  if (diff === 'Easy') {
    r = 0.5;
  } else if (diff === 'Medium') {
    var choices = [0.25, 0.5, 0.75];
    r = choices[randInt(0, 2)];
  } else {
    r = (randInt(1, 4) * 10 + randInt(1, 9)) / 100;
  }

  var ans = Math.round(a1 / (1 - r) * 100) / 100;

  var question = 'Find the sum of the infinite geometric series with first term ' + a1 + ' and ratio ' + r;
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Sequences & Series']['Recursive Sequences'] = function(diff) {
  var a1 = randInt(1, 5);
  var d = randInt(1, 4);

  var n;
  if (diff === 'Easy') {
    n = randInt(3, 5);
  } else if (diff === 'Medium') {
    n = randInt(5, 8);
  } else {
    n = randInt(8, 12);
  }

  var ans = a1 + (n - 1) * d;

  var question = 'Given a(1)=' + a1 + ' and a(n)=a(n-1)+' + d + ', find a(' + n + ')';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Sequences & Series']['Sigma Notation Evaluation'] = function(diff) {
  var a = randInt(1, 5);
  var b = randInt(0, 5);

  var n;
  if (diff === 'Easy') {
    n = randInt(3, 5);
  } else if (diff === 'Medium') {
    n = randInt(5, 8);
  } else {
    n = randInt(8, 12);
  }

  var ans = 0;
  for (var i = 1; i <= n; i++) {
    ans += a * i + b;
  }

  var question = 'Evaluate sum from i=1 to ' + n + ' of (' + a + 'i+' + paren(b) + ')';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Sequences & Series']['Convergence & Divergence'] = function(diff) {
  var type = Math.random() < 0.5 ? 'converge' : 'diverge';
  var ans;
  var question;

  if (type === 'converge') {
    var r = (randInt(1, 8) * 10 + randInt(1, 9)) / 100;
    ans = 1;
    question = 'Does the geometric series with ratio ' + r + ' converge (1) or diverge (0)?';
  } else {
    var r = 1 + randInt(1, 5) * 0.1;
    ans = 0;
    question = 'Does the geometric series with ratio ' + r + ' converge (1) or diverge (0)?';
  }

  return { question: question, answer: ans };
};

// ============================================================================
// CONIC SECTIONS
// ============================================================================
SUB_GENERATORS['Grade 12']['Conic Sections'] = {};

SUB_GENERATORS['Grade 12']['Conic Sections']['Circle Radius from Equation'] = function(diff) {
  var h = randInt(-5, 5);
  var k = randInt(-5, 5);
  var r;

  if (diff === 'Easy') {
    r = randInt(1, 5);
  } else if (diff === 'Medium') {
    r = randInt(3, 10);
  } else {
    r = randInt(5, 15);
  }

  var ans = r;
  var rsq = r * r;

  var question = 'Find the radius of the circle (x' + (h >= 0 ? '-' : '+') + Math.abs(h) + ')^2+(y' + (k >= 0 ? '-' : '+') + Math.abs(k) + ')^2=' + rsq;
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Conic Sections']['Circle Center from Equation'] = function(diff) {
  var h = randInt(-8, 8);
  var k = randInt(-8, 8);
  var r = randInt(1, 10);
  var rsq = r * r;

  var which = Math.random() < 0.5 ? 'h' : 'k';
  var ans = (which === 'h') ? h : k;

  var question = 'Find the ' + which + '-coordinate of the center of (x' + (h >= 0 ? '-' : '+') + Math.abs(h) + ')^2+(y' + (k >= 0 ? '-' : '+') + Math.abs(k) + ')^2=' + rsq;
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Conic Sections']['Ellipse Semi-Axes'] = function(diff) {
  var a = randInt(2, 10);
  var b = randInt(2, 10);

  var which = Math.random() < 0.5 ? 'a' : 'b';
  var ans = (which === 'a') ? a : b;

  var asq = a * a;
  var bsq = b * b;

  var question = 'Find ' + which + ' for the ellipse x^2/' + asq + '+y^2/' + bsq + '=1';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Conic Sections']['Parabola Vertex'] = function(diff) {
  var a = randNonZero(5);
  var h = randInt(-5, 5);
  var k = randInt(-5, 5);

  var which = Math.random() < 0.5 ? 'h' : 'k';
  var ans = (which === 'h') ? h : k;

  var question = 'Find the ' + which + '-coordinate of the vertex of y=' + a + '(x' + (h >= 0 ? '-' : '+') + Math.abs(h) + ')^2+' + paren(k);
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Conic Sections']['Hyperbola Identification'] = function(diff) {
  var type = Math.random() < 0.5 ? 'horizontal' : 'vertical';
  var a = randInt(1, 10);
  var b = randInt(1, 10);

  var asq = a * a;
  var bsq = b * b;

  var ans = (type === 'horizontal') ? 1 : 0;
  var question;

  if (type === 'horizontal') {
    question = 'Is x^2/' + asq + '-y^2/' + bsq + '=1 a horizontal (1) or vertical (0) hyperbola?';
  } else {
    question = 'Is y^2/' + bsq + '-x^2/' + asq + '=1 a horizontal (1) or vertical (0) hyperbola?';
  }

  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Conic Sections']['Focus of a Parabola'] = function(diff) {
  var d = (diff === 'Easy') ? randInt(2, 6) * 2 : randInt(1, 10);

  var ans = Math.round(d / 4 * 100) / 100;

  var question = 'For parabola y=(1/' + d + ')x^2, find the y-coordinate of the focus';
  return { question: question, answer: ans };
};

// ============================================================================
// PROBABILITY & STATISTICS
// ============================================================================
SUB_GENERATORS['Grade 12']['Probability & Statistics'] = {};

SUB_GENERATORS['Grade 12']['Probability & Statistics']['Normal Distribution (Empirical Rule)'] = function(diff) {
  var mean = randInt(50, 100);
  var sd = randInt(5, 15);

  var type = randInt(0, 3);
  var ans;
  var question;

  if (type === 0) {
    ans = 68;
    question = 'In a normal distribution, what percentage of data falls within 1 SD of the mean?';
  } else if (type === 1) {
    ans = 95;
    question = 'In a normal distribution, what percentage of data falls within 2 SD of the mean?';
  } else if (type === 2) {
    var n = randInt(1, 2);
    ans = mean + n * sd;
    question = 'For normal distribution with mean ' + mean + ' and SD ' + sd + ', find the value ' + n + ' SD above the mean';
  } else {
    var n = randInt(1, 2);
    ans = mean - n * sd;
    question = 'For normal distribution with mean ' + mean + ' and SD ' + sd + ', find the value ' + n + ' SD below the mean';
  }

  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Probability & Statistics']['Z-Scores'] = function(diff) {
  var mean = randInt(50, 100);
  var sd = randInt(5, 15);
  var x;

  if (diff === 'Easy') {
    x = mean + sd * randInt(1, 2);
  } else if (diff === 'Medium') {
    x = mean + sd * randInt(-2, 2);
  } else {
    x = randInt(mean - 3 * sd, mean + 3 * sd);
  }

  var ans = Math.round((x - mean) / sd * 100) / 100;

  var question = 'Find the z-score for x=' + x + ' with mean=' + mean + ' and SD=' + sd;
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Probability & Statistics']['Expected Value'] = function(diff) {
  var n;
  if (diff === 'Easy') {
    n = 2;
  } else if (diff === 'Medium') {
    n = 3;
  } else {
    n = 4;
  }

  var values = [];
  var probs = [];
  var total = 0;

  for (var i = 0; i < n - 1; i++) {
    var p = randInt(10, 30) / 100;
    probs.push(p);
    total += p;
  }
  probs.push(Math.round((1 - total) * 100) / 100);

  var ans = 0;
  var probStr = '';
  for (var i = 0; i < n; i++) {
    var val = randInt(1, 10);
    values.push(val);
    ans += val * probs[i];
    probStr += 'P(X=' + val + ')=' + probs[i] + ', ';
  }

  ans = Math.round(ans * 100) / 100;

  var question = 'Find E(X) given ' + probStr.slice(0, -2);
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Probability & Statistics']['Standard Deviation (Small Sets)'] = function(diff) {
  var n = (diff === 'Easy') ? 3 : (diff === 'Medium') ? 4 : 5;
  var data = [];

  for (var i = 0; i < n; i++) {
    data.push(randInt(1, 20));
  }

  var mean = 0;
  for (var i = 0; i < n; i++) {
    mean += data[i];
  }
  mean = mean / n;

  var variance = 0;
  for (var i = 0; i < n; i++) {
    variance += Math.pow(data[i] - mean, 2);
  }
  variance = variance / n;

  var ans = Math.round(Math.sqrt(variance) * 100) / 100;

  var question = 'Find the population SD (round to hundredths) of: ' + data.join(', ');
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Probability & Statistics']['Variance'] = function(diff) {
  var n = (diff === 'Easy') ? 3 : (diff === 'Medium') ? 4 : 5;
  var data = [];

  for (var i = 0; i < n; i++) {
    data.push(randInt(1, 15));
  }

  var mean = 0;
  for (var i = 0; i < n; i++) {
    mean += data[i];
  }
  mean = mean / n;

  var variance = 0;
  for (var i = 0; i < n; i++) {
    variance += Math.pow(data[i] - mean, 2);
  }
  variance = variance / n;

  var ans = Math.round(variance * 100) / 100;

  var question = 'Find the population variance (round to hundredths) of: ' + data.join(', ');
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Probability & Statistics']['Probability Distributions'] = function(diff) {
  var n = (diff === 'Easy') ? 2 : 3;
  var values = [];
  var probs = [];
  var total = 0;

  for (var i = 0; i < n - 1; i++) {
    var p = randInt(15, 40) / 100;
    probs.push(p);
    total += p;
  }
  probs.push(Math.round((1 - total) * 100) / 100);

  var ans = 0;
  var distStr = '';
  for (var i = 0; i < n; i++) {
    var val = (i + 1) * randInt(1, 5);
    values.push(val);
    ans += val * probs[i];
    distStr += val + ' with P=' + probs[i] + ', ';
  }

  ans = Math.round(ans * 100) / 100;

  var question = 'Find the expected value of the distribution: ' + distStr.slice(0, -2);
  return { question: question, answer: ans };
};

// ============================================================================
// MATRICES
// ============================================================================
SUB_GENERATORS['Grade 12']['Matrices'] = {};

SUB_GENERATORS['Grade 12']['Matrices']['Matrix Addition'] = function(diff) {
  var a11 = randInt(-5, 10);
  var a12 = randInt(-5, 10);
  var a21 = randInt(-5, 10);
  var a22 = randInt(-5, 10);

  var b11 = randInt(-5, 10);
  var b12 = randInt(-5, 10);
  var b21 = randInt(-5, 10);
  var b22 = randInt(-5, 10);

  var positions = ['(1,1)', '(1,2)', '(2,1)', '(2,2)'];
  var pos = positions[randInt(0, 3)];

  var ans;
  if (pos === '(1,1)') ans = a11 + b11;
  else if (pos === '(1,2)') ans = a12 + b12;
  else if (pos === '(2,1)') ans = a21 + b21;
  else ans = a22 + b22;

  var question = 'A=[' + a11 + ',' + a12 + ';' + a21 + ',' + a22 + '], B=[' + b11 + ',' + b12 + ';' + b21 + ',' + b22 + ']. Find element ' + pos + ' of A+B';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Matrices']['Scalar Multiplication'] = function(diff) {
  var k = randInt(2, 5);
  var a11 = randInt(-5, 10);
  var a12 = randInt(-5, 10);
  var a21 = randInt(-5, 10);
  var a22 = randInt(-5, 10);

  var positions = ['(1,1)', '(1,2)', '(2,1)', '(2,2)'];
  var pos = positions[randInt(0, 3)];

  var ans;
  if (pos === '(1,1)') ans = k * a11;
  else if (pos === '(1,2)') ans = k * a12;
  else if (pos === '(2,1)') ans = k * a21;
  else ans = k * a22;

  var question = 'A=[' + a11 + ',' + a12 + ';' + a21 + ',' + a22 + ']. Find element ' + pos + ' of ' + k + 'A';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Matrices']['Matrix Multiplication (2x2)'] = function(diff) {
  var a11 = randInt(1, 5);
  var a12 = randInt(1, 5);
  var a21 = randInt(1, 5);
  var a22 = randInt(1, 5);

  var b11 = randInt(1, 5);
  var b12 = randInt(1, 5);
  var b21 = randInt(1, 5);
  var b22 = randInt(1, 5);

  var c11 = a11 * b11 + a12 * b21;
  var c12 = a11 * b12 + a12 * b22;
  var c21 = a21 * b11 + a22 * b21;
  var c22 = a21 * b12 + a22 * b22;

  var positions = ['(1,1)', '(1,2)', '(2,1)', '(2,2)'];
  var pos = positions[randInt(0, 3)];

  var ans;
  if (pos === '(1,1)') ans = c11;
  else if (pos === '(1,2)') ans = c12;
  else if (pos === '(2,1)') ans = c21;
  else ans = c22;

  var question = 'A=[' + a11 + ',' + a12 + ';' + a21 + ',' + a22 + '], B=[' + b11 + ',' + b12 + ';' + b21 + ',' + b22 + ']. Find element ' + pos + ' of AB';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Matrices']['Determinant (2x2)'] = function(diff) {
  var a = randInt(-5, 10);
  var b = randInt(-5, 10);
  var c = randInt(-5, 10);
  var d = randInt(-5, 10);

  var ans = a * d - b * c;

  var question = 'Find the determinant of [' + a + ',' + b + ';' + c + ',' + d + ']';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Matrices']['Inverse of 2x2 Matrix (Element)'] = function(diff) {
  var a = randInt(1, 5);
  var b = randInt(-3, 3);
  var c = randInt(-3, 3);
  var d = randInt(1, 5);

  var det = a * d - b * c;

  if (det === 0) {
    det = 1;
    d = Math.ceil((b * c + 1) / a);
  }

  var inv11 = d / det;
  var inv12 = -b / det;
  var inv21 = -c / det;
  var inv22 = a / det;

  var positions = ['(1,1)', '(1,2)', '(2,1)', '(2,2)'];
  var pos = positions[randInt(0, 3)];

  var ans;
  if (pos === '(1,1)') ans = inv11;
  else if (pos === '(1,2)') ans = inv12;
  else if (pos === '(2,1)') ans = inv21;
  else ans = inv22;

  ans = Math.round(ans * 100) / 100;

  var question = 'Find element ' + pos + ' of the inverse of [' + a + ',' + b + ';' + c + ',' + d + ']';
  return { question: question, answer: ans };
};

SUB_GENERATORS['Grade 12']['Matrices']['Solving 2x2 Systems with Matrices'] = function(diff) {
  var x = randInt(-5, 5);
  var y = randInt(-5, 5);

  var a = randNonZero(5);
  var b = randNonZero(5);
  var c = randNonZero(5);
  var d = randNonZero(5);

  var e = a * x + b * y;
  var f = c * x + d * y;

  var which = Math.random() < 0.5 ? 'x' : 'y';
  var ans = (which === 'x') ? x : y;

  var question = 'Solve the system using matrices: ' + a + 'x+' + paren(b) + 'y=' + e + ', ' + c + 'x+' + paren(d) + 'y=' + f + '. Find ' + which;
  return { question: question, answer: ans };
};
