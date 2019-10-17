export class EchartDataModel {
    lable: Array<String>;
    data: Array<number>;
}

export class selectDateModel {
    lable: String;
    value: String;
    constructor(lable: String, value: String) {
        this.lable = lable;
        this.value = value;
    }
}