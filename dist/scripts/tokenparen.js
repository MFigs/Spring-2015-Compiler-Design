var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenParen = (function (_super) {
        __extends(TokenParen, _super);
        function TokenParen(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
        }
        return TokenParen;
    })(TSC.Token);
    TSC.TokenParen = TokenParen;
})(TSC || (TSC = {}));
