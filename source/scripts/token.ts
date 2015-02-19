module TSC {
    
    export class Token {

        public tokenValue;
        public lineNumber;


        public constructor(tokenVal: string, lineNum: number) {

            this.tokenValue = tokenVal;
            this.lineNumber = lineNum;

        }

    }

}