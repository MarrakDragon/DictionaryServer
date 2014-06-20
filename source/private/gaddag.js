/*!
 * gaddag.js
 * Copyright(c) 2012 hillerstorm <progr@mmer.nu>
 * Mods by Jeff Brown
 * No explicit license
 */
var fs = require('fs');

// String helper.
function str (node) {
    var s, label;

    if (node.$) {
        s = '1';
    } else {
        s = '0';
    }

    for (label in node.edges) {
        if (node.edges.hasOwnProperty(label)) {
            s += '_' + label + '_' + node.edges[label].id;
        }
    }

    return s;
}

module.exports = function () {
    var nextId = 0,
        previousWord = '',
        root = new Array(),
//        root = { id: nextId++, edges: {}, $: 0 },
        uncheckedNodes = [],
        minimizedNodes = {},
        dictionariesLoaded = [],
        letterMatrix = [];

    function minimize (downTo) {
        var i, tuple,
            childKey, node;

        for (i = uncheckedNodes.length-1; i > downTo-1; i--) {
            tuple = uncheckedNodes.pop();
            childKey = str(tuple.child);
            node = minimizedNodes[childKey];
            if (node) {
                tuple.parent.edges[tuple.letter] = node;
            } else {
                minimizedNodes[childKey] = tuple.child;
            }
        }
    };

    function insert(dictIndex, word) {
        var commonPrefix = 0, i,
            node, slicedWord, nd, ltr;

        // Trivial Rejection
        if (dictionariesLoaded.indexOf(dictIndex) == -1) {
            console.log("Bad Dictionary Name!" + dictIndex);
            return;
        }

        for (i = 0; i < Math.min(word.length, previousWord.length); i++) {
            if (word[i] !== previousWord[i]) {
                break;
            }
            commonPrefix += 1;
        }

        minimize(commonPrefix);
        if (uncheckedNodes.length === 0) {
            node = root[dictIndex];
        } else {
            node = uncheckedNodes[uncheckedNodes.length-1].child;
        }

        slicedWord = word.slice(commonPrefix);
        for (i = 0; i < slicedWord.length; i++) {
            nd = { id: nextId++, edges: {}, $: 0 };
            ltr = slicedWord[i].toUpperCase();
            node.edges[ltr] = nd;
            uncheckedNodes.push({
                parent: node,
                letter: ltr,
                child: nd
            });
            node = nd;
        }
        node.$ = 1;
        previousWord = word;
    };

    function finish () {
        minimize(0);
        uncheckedNodes = [];
        minimizedNodes = {};
        previousWord = null;
    };

    var createBoard = function( size ) {



    };


    this.charAt = function(row, col, letter ){
        if (letter != undefined)
            letterMatrix[row][col] = letter.toUpperCase();

        return board[row][col];
    };


    // Finds all words given letters.
    this.findWords = function( letters, size, dictIndex ) {
        var words = [];

        // Verify that dictIndex is valid.

        // Trivial Rejection
        if (dictionariesLoaded.indexOf(dictIndex) == -1) {
            console.log("Bad Dictionary Name!" + dictIndex);
            return;
        }

        if (!letters || size === 0) {
            console.log("bad params! letters = " + letters + " size = " + size );
            return;
        }


        var node = root[dictIndex];

        // Assume boards are always square and that letters passed in are read left to right, top row to bottom.  for example abc def ghi represent the following board:
        // abc
        // def
        // ghi

        // Keep an array of words, and a stack of characters.
        var charStack = new Array();
        var wordList = new Array();
        var rows = columns = size;

        // Make a two dim array of visited flags
        var visited = new Array(size);
        for (var row = 0; row < rows; row++) {
            visited[row] = new Array(size);
            for (var col = 0; col < columns; col++) {
                visited[row][col] = false;
            };
        };

//        if (letterMatrix)
//            letterMatrix.length = 0;

        // Make a two dim array mimicing the board matrix
        letterMatrix = new Array(size);
        for (var row = 0; row < size; row++) {
            letterMatrix[row] = new Array(size);
            for (var col = 0; col < size; col++) {
                letterMatrix[row][col] = '';
            };
        };

        // Setup the board with these letters
        var count = 0;
        for (var row = 0; row < size; row++) {
            for (var col = 0; col < size; col++) {
                letterMatrix[row][col] = letters[count++].toUpperCase();
            };
        };

        // Given an array of letters, get the word (recursion)
        var findWord = function (row, column, node) {

            // Trivial rejection case
            if (visited[row][column])
                return;

            var letter = letterMatrix[row][column];
            // If we're done looking in this trie, we're done.
            if( !node || !node.edges[letter])
                return;

            // Get next node
            node = node.edges[letter];

            // console.log('current letter = ' + letter);
            charStack.push(letter);
            // console.log('current stack = ' + charStack);
            visited[row][column] = true;

            for (var dx = -1; dx <= 1; dx++) {
                var c = column + dx;
                if (c < 0 || c >= columns) continue;

                for (var dy = -1; dy <= 1; dy++) {
                    var r = row + dy;
                    if (r < 0 || r >= rows) continue;
                    if (dx == 0 && dy == 0) continue;

                    findWord(r, c, node);
                }
            }

            //console.log(charStack);
            if (node.$) {
                var s = "";
                for (var i = 0; i < charStack.length; i++) {
                    s = s + charStack[i];
                }
                words.push(s);
                //console.log(words);
            }

            visited[row][column] = false;
            //console.log(visited);
            charStack.pop();
        };

        var visited = new Array(rows);
        for (var row = 0; row < size; row++) {
            visited[row] = new Array(size);
            for (var col = 0; col < columns; col++) {
                visited[row][col] = false;
            }
        }

        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < columns; c++) {
                findWord(r, c, node);
            }
        }

        return words;

    };

    // Finds a word, returns 1 if the word was found, 0 otherwise
    var find = function (word, dictIndex) {

        // Trivial Rejection
        if (dictionariesLoaded.indexOf(dictIndex) == -1) {
            console.log("Bad Dictionary Name!" + dictIndex);
            return 0;
        }

        if (word === null) {
            console.log("Null word!");
            return 0;
        }

        var node = root[dictIndex],
            i, letter;

        for (i = 0; i < word.length; i++) {
            letter = word[i].toUpperCase();
            if (!node.edges[letter]) {
                return 0;
            }
            node = node.edges[letter];
        }
        return node.$;
    };

    // Returns the subtree matching the letter given
    this.get = function (dictIndex, letter) {

        // Trivial Rejection
        if (root.indexOf(dictIndex) == -1) {
            console.log("Bad Dictionary Name!" + dictIndex);
            return;
        }

        return root[dictIndex].edges[letter.toUpperCase()];
    };

    function baseName(str) {
        var base = new String(str).substring(str.lastIndexOf('\\') + 1);
        if (base.lastIndexOf(".") != -1)
            base = base.substring(0, base.lastIndexOf("."));
        return base;
    }

    // Loads a newline-separated file from disk containing words to use
    this.load = function (pathToDictionary, onCompleted) {
        process.nextTick(function () {
            var words = { 
                // TODO: fix a better way of handling huge dictionaries.
                // The only reason it's saved this way is because
                // sorting one letter at a time is quicker...
                a: [], b: [], c: [], d: [],
                e: [], f: [], g: [], h: [],
                i: [], j: [], k: [], l: [],
                m: [], n: [], o: [], p: [],
                q: [], r: [], s: [], t: [],
                u: [], v: [], w: [], x: [],
                y: [], z: [], å: [], ä: [], ö: [], ø: [], æ: []
            }, letter;

            nextId = 0;
            previousWord = '';
            var dictFileName = baseName(pathToDictionary);

            root[dictFileName] = { id: nextId++, edges: {}, $: 0 };
            uncheckedNodes = [];
            minimizedNodes = {};

            // Add dictoionary to list for later verification of input.
            console.log(pathToDictionary);
            //console.log(dictionaryToUse.replace(/^.*[\\\/]/, ''));
            console.log(baseName(pathToDictionary));

            var count = 0;

            dictionariesLoaded.push(baseName(dictFileName));
            fs.readFileSync(pathToDictionary)
                .toString()
                .split('\r\n')
                .forEach(function (word) {
                    var i, idx;

                    // If the string is essentially empty, or is whitespace or numbers, skip it.
                    if (!word.match(/[a-zA-Z]/g)) {
                        // alphabet letters found
                        return;
                    }

                    count++;
                    words[word[0]].push(word);
                    word += '_';
                    for (i = 2; i < word.length; i++) {
                        idx = word.indexOf('_') + 1;
                        word = word.slice(1, idx) + word[0] + word.slice(idx);
                        words[word[0]].push(word);
                    }
                });

            //console.log("Words Loaded for " + dictFileName + " " + count + " words length " + words.length);
            for (letter in words) {
                if (words.hasOwnProperty(letter)) {
                    words[letter].sort();
                    //words[letter].forEach(insert);

                    for ( var i in words[letter] ) {
                        insert(dictFileName, words[letter][i]);
                    };   
                }
            }
            finish();
            if (onCompleted) {
                onCompleted();
            }
        });
    };

    this.init = function () {
        //
    }

    return {
        init: init,
        find: find,
        loadDictionary:load,
        findWords: findWords
    };
};