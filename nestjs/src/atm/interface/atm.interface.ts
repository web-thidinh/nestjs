
export interface AtmType {
    id: string
    name: string
    status: string
    remove: boolean
}

export interface CreateAtm {
    name: string
}

export interface CreateQueue {
    name: string
    transaction: string
}