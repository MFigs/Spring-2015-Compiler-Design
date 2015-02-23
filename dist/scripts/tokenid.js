var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenID = (function (_super) {
        __extends(TokenID, _super);
        function TokenID(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
        }
        return TokenID;
    })(TSC.Token);
    TSC.TokenID = TokenID;
})(TSC || (TSC = {}));
