var _Lexer: TSC.Lexer;
var _Parser: TSC.Parser;
var _TokenStream: Array<TSC.Token>;

// Global variables
    var tokens = "";
    var tokenIndex = 0;
    var currentToken = "";
    var errorCount = 0;
    var EOF = "$";
