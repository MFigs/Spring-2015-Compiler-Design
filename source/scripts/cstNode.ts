module TSC {

    export class CSTNode {

        public parent: TSC.CSTNode = null;
        public children: Array<TSC.CSTNode> = new Array<TSC.CSTNode>();
        public isRoot: boolean = false;
        public childCount: number = 0;
        public printValue: string = "";
        public lineNum: number = 0;

        constructor(printVal: string) {
            this.printValue = printVal;
            this.lineNum = currentToken.lineNumber;
        }

        public addChild(child: TSC.CSTNode) {

            child.parent = this;
            this.children.push(child);
            this.childCount++;

        }

    }

}