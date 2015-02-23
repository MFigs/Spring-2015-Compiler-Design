var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenIf = (function (_super) {
        __extends(TokenIf, _super);
        function TokenIf(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
        }
        return TokenIf;
    })(TSC.Token);
    TSC.TokenIf = TokenIf;
})(TSC || (TSC = {}));
