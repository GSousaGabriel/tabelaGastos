export interface Column {
    [key: string]: string | boolean;
    field: string;
    header: string;
    orderActive: boolean;
}
