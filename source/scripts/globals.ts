var _Lexer: TSC.Lexer;
var _Parser: TSC.Parser;
var _TokenStream: Array<TSC.Token>;
var _ErrorBufferLex: Array<string>;
var lexErrorCount: number = 0;
var lexWarningCount: number = 0;
var _ErrorBufferParse: Array<string>;
var parseErrorCount: number = 0;
var parseWarningCount: number = 0;

// Global variables
    var tokens = "";
    var tokenIndex = 0;
    var continueExecution: boolean = true;
    var currentToken: TSC.Token;
    var errorCount = 0;
    var EOF = "$";
