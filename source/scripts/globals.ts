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
var continueExecution: boolean = true;
var currentToken: TSC.Token;
var errorCount = 0;
var EOF = "$";
var _Lexer: TSC.Lexer;
var _Parser: TSC.Parser;
var _CST: TSC.CSTNode;
var _AST: TSC.ASTNode;
var _SymbolTable: TSC.Scope;
var _CSTDisplay: string;
var _ASTDisplay: string;
var _SymTabDisplay: string;
var _TokenStream: Array<TSC.Token>;
var _ErrorBufferLex: Array<string>;
var _OutputBufferSA: Array<string>;
var _SAErrorOutput: string;
var lexErrorCount: number = 0;
var lexWarningCount: number = 0;
var _OutputBufferParse: Array<string>;
var parseErrorCount: number = 0;
var parseWarningCount: number = 0;
var parseMessageCount: number = 0;
var _TempVarCounter: number = 0;
var _JumpVarCounter: number = 0;
var _CodeString: string = "";
var _CodeGenerator: TSC.CodeGenerator;

