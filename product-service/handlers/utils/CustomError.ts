export class CustomError extends Error {
    code: number;

    constructor(data){
        super(data.message);
        this.code = data.code;
    }
}
