var TSC;
(function (TSC) {
    var Token = (function () {
        function Token(tokenVal, lineNum) {
            this.tokenValue = tokenVal;
            this.lineNumber = lineNum;
        }
        Token.prototype.toString = function () {
            return this.tokenValue;
        };
        return Token;
    })();
    TSC.Token = Token;
})(TSC || (TSC = {}));
