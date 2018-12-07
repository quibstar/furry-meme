const TokenGenerator = require('tokgen');

exports.generateToken = function() {
    var generator = new TokenGenerator();
    return generator.generate();
};