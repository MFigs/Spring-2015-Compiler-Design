var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenInvalid = (function (_super) {
        __extends(TokenInvalid, _super);
        function TokenInvalid(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
        }
        return TokenInvalid;
    })(TSC.Token);
    TSC.TokenInvalid = TokenInvalid;
})(TSC || (TSC = {}));
