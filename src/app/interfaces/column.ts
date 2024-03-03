export interface Column {
    [key: string]: string | boolean | number,
    field: string,
    header: string,
    orderActive: boolean,
    defaultValue: string | number
}
