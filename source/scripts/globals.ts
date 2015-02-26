var _Lexer: TSC.Lexer;
var _Parser: TSC.Parser;
var _TokenStream: Array<TSC.Token>;
var _ErrorBufferLex: Array<string>;
var lexErrorCount: number = 0;
var lexWarningCount: number = 0;
var _OutputBufferParse: Array<string>;
var parseErrorCount: number = 0;
var parseWarningCount: number = 0;
var parseMessageCount: number = 0;
//var outputParseMessages: Array<string>;

// Global variables
    var tokens = "";
    var tokenIndex = 0;
    var continueExecution: boolean = true;
    var currentToken: TSC.Token;
    var errorCount = 0;
    var EOF = "$";
