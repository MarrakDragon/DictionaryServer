
/*
 * Check the validity of a word against a word set
 */

module.exports = function (lookupLib) {

    return {
        isValid: function (req, res) {
            var dictionaryToUse = req.query.dictionaryToUse;
            var valid = lookupLib.find(req.query.word, dictionaryToUse);
            res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
            var body = JSON.stringify({ isValid: valid });
            res.write(body);
            res.end();
            //console.log('sent result' + valid);
            //res.json({ isValid: valid });
        },

        getWords: function (req, res) {
            var dictionaryToUse = req.query.dictionaryToUse;
            var letters = req.query.letters;
            var size = req.query.size;
//            lookupLib.createBoard(3);
            var wordsFound = lookupLib.findWords(letters, size, dictionaryToUse);
            res.json({ found: wordsFound });
            //console.log(res);

        }
    };
};

