
export interface AuthData {
    username: string
    password: string
}

export interface AuthGoogle {
    email: string
    password?: string
    firtName: string
    lastName: string
    picture: string
    access_token: string
}