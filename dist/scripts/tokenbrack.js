var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenBrack = (function (_super) {
        __extends(TokenBrack, _super);
        function TokenBrack(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
        }
        return TokenBrack;
    })(TSC.Token);
    TSC.TokenBrack = TokenBrack;
})(TSC || (TSC = {}));
