declare interface BodyProps {
    path: string;
}
export declare class EmailParserController {
    constructor();
    getJsonData(body: BodyProps): Promise<Object>;
}
export {};
