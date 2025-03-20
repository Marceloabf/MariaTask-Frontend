export interface ITask{
    id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    createdAt: Date;
    dueDate: Date;
    userId: number;
}