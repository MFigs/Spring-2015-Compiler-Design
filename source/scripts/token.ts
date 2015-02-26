module TSC {
    
    export class Token {

        public tokenValue: string;
        public regexPattern: RegExp;
        public lineNumber: number;
        public validToken: boolean;
        public kind: number;


        public constructor(tokenVal: string, reg: RegExp, lineNum: number, valid: boolean, tokenKind: number) {

            this.tokenValue = tokenVal;
            this.regexPattern = reg;
            this.lineNumber = lineNum;
            this.validToken = valid;
            this.kind = tokenKind;

        }

        public toString() {

            return this.tokenValue;

        }

    }

}