export type User = {
    email: string;
    name?: string;
    imageUrl?: string;
};

export type Product = {
    title: string;
    description: string;
    imageUrl: string;
    userId: string;
};

export type Comment = {
    content: string;
    userId: string;
};
