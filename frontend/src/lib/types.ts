export type User = {
    email: string;
    name?: string;
    imageUrl?: string;
};

export type Product = {
    id?: string;
    title: string;
    description: string;
    imageUrl: string;
    userId?: string;
    createdAt?: string;
    user?: User;
    comments?: Comment[];
};

export type Comment = {
    content: string;
    userId: string;
};
