var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenNEq = (function (_super) {
        __extends(TokenNEq, _super);
        function TokenNEq(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
        }
        return TokenNEq;
    })(TSC.Token);
    TSC.TokenNEq = TokenNEq;
})(TSC || (TSC = {}));
