export interface FactoriedVariableArray {
    type: string,
    validationField: string,
    lockedRows: string[],
    dataValues: any[],
    updateDataFn: Function,
    setDataFn: Function,
    fixFormatDataFn: Function
}
