var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenType = (function (_super) {
        __extends(TokenType, _super);
        function TokenType(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
        }
        return TokenType;
    })(TSC.Token);
    TSC.TokenType = TokenType;
})(TSC || (TSC = {}));
