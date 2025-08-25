export interface Column {
    [key: string]: string | boolean | number | Date,
    field: string,
    header: string,
    orderActive: boolean,
    filterActive: boolean,
    defaultValue: string | boolean | number | Date
}
