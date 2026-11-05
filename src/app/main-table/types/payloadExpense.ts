export type Expenses = {
    [key: string]: string | number | Date | boolean;
    _id: string;
    type: string;
    fixed: boolean;
    paid: boolean;
    installments: string;
    category: string;
    date: Date;
    value: number;
}
