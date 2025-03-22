export interface ITaskReports{
    pending: number;
    in_progress: number;
    done: number;
    total: number;
    [key: string]: number;
}