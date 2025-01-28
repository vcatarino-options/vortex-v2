export interface User {
    username: string;
    full_name: string;
    email: string;
    hashed_password: string;
    disabled: boolean;
}