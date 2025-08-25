export type Expenses = {
    [key: string]: string | number | Date | boolean;
    _id: string | number;
    type: string;
    fixed: boolean;
    paid: boolean;
    recurrence: number;
    category: string;
    date: Date;
    value: number;
}
