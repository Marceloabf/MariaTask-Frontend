export interface ITask{
    id?: number;
    title: string;
    description: string;
    status: string;
    dueDate: string;
}

export interface ITaskUpdate{
    id: number;
    title: string;
    description: string;
    status: string;
    dueDate: Date;
}