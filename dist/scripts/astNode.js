var TSC;
(function (TSC) {
    var ASTNode = (function () {
        function ASTNode(printVal) {
            this.isRoot = false;
            this.childCount = 0;
            this.printValue = "";
            this.printValue = printVal;
        }
        ASTNode.prototype.addChild = function (child) {
            child.parent = this;
            this.children[this.childCount] = child;
            this.childCount++;
        };
        return ASTNode;
    })();
    TSC.ASTNode = ASTNode;
})(TSC || (TSC = {}));
