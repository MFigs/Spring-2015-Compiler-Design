module TSC {

    export class ASTNode {

        public parent: TSC.ASTNode;
        public children: Array<TSC.ASTNode> = new Array<TSC.ASTNode>();
        public isRoot: boolean = false;
        public childCount: number = 0;
        public printValue: string = "";
        public lineNum: number = 0;

        constructor(printVal: string) {
            this.printValue = printVal;
            this.lineNum = currentToken.lineNumber;
        }

        public addChild(child: TSC.ASTNode) {

            child.parent = this;
            this.children[this.childCount] = child;
            this.childCount++;

        }

    }

}