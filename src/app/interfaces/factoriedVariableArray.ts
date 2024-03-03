export interface FactoriedVariableArray {
    type: string,
    validationField: string,
    dataValues: any[],
    updateDataFn: Function,
    setDataFn: Function,
    fixFormatDataFn: Function
}
