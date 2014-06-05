
/*
 * Check the validity of a word against a word set
 */

module.exports = function (dictionary) {

    return {
        isValid: function (req, res) {
            var valid = dictionary.find(req.query.word);
            res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
            var body = JSON.stringify({ isValid: valid });
            res.write(body);
            res.end();
            //console.log('sent result' + valid);
            //res.json({ isValid: valid });
        },

        getWords: function (req, res) {
            var letters = req.query.letters;
            var size = req.query.size;
            dictionary.createBoard(3);
            var wordsFound = dictionary.findWords(letters, size);
            res.json({ found: wordsFound });
            console.log(res);

        }
    };
};

