//Constants -DO NOT CHANGE
//TODO: Change to all capital letters for constant convention
var TokenInvalid = 0;
var TokenAssign = 1;
var TokenBool = 2;
var TokenEOF = 3;
var TokenEQ = 4;
var TokenID = 5;
var TokenIf = 6;
var TokenNEQ = 7;
var TokenNum = 8;
var TokenPlus = 9;
var TokenPrint = 10;
var TokenSpace = 11;
var TokenString = 12;
var TokenType = 13;
var TokenWhile = 14;
var TokenOpenParen = 15;
var TokenCloseParen = 16;
var TokenOpenBrack = 17;
var TokenCloseBrack = 18;

// Global variables
var tokens = "";
var tokenIndex = 0;
var continueExecution = true;
var currentToken;
var errorCount = 0;
var EOF = "$";
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
