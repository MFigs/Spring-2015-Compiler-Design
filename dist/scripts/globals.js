/*
var onDocumentLoad = function() {
TSOS.Control.hostInit();
};
*/
var _Lexer = TSC.Lexer;

// Global variables
var tokens = "";
var tokenIndex = 0;
var currentToken = "";
var errorCount = 0;
var EOF = "$";
