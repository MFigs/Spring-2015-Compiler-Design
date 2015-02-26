module TSC {
    
    export class Token {

        public tokenValue: string;
        public regexPattern: RegExp;
        public lineNumber: number;
        public validToken: boolean


        public constructor(tokenVal: string, reg: RegExp, lineNum: number, valid: boolean) {

            this.tokenValue = tokenVal;
            this.regexPattern = reg;
            this.lineNumber = lineNum;
            this.validToken = valid;

        }

        public toString() {

            return this.tokenValue;

        }

    }

}