export interface IPaginatedResponse<t>{
    data: t;
    total: number;
    page: number;
    limit: number;
}