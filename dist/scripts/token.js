var TSC;
(function (TSC) {
    var Token = (function () {
        function Token(tokenVal, reg, lineNum, valid, tokenKind) {
            this.tokenValue = tokenVal;
            this.regexPattern = reg;
            this.lineNumber = lineNum;
            this.validToken = valid;
            this.kind = tokenKind;
        }
        Token.prototype.toString = function () {
            return this.tokenValue;
        };
        return Token;
    })();
    TSC.Token = Token;
})(TSC || (TSC = {}));
