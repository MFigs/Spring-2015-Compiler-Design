var _Lexer;
var _Parser;
var _TokenStream;
var _ErrorBufferLex;
var lexErrorCount = 0;
var lexWarningCount = 0;
var _OutputBufferParse;
var parseErrorCount = 0;
var parseWarningCount = 0;
var parseMessageCount = 0;

//var outputParseMessages: Array<string>;
// Global variables
var tokens = "";
var tokenIndex = 0;
var continueExecution = true;
var currentToken;
var errorCount = 0;
var EOF = "$";
