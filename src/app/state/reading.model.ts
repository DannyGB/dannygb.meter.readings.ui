export interface Reading {
    _id: string;
    reading: number;
    readingdate: moment.Moment;
    note: string;
    rate: string;
    userName: string;
}