export interface IUser{
    id?: number;
    email: string;
    password: string;
}

export interface ILoginUser{
    userId: number;
    access_token: string;
}