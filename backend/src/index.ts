import express from 'express';
import cors from 'cors';

import { ENV } from './config/env';
import { clerkMiddleware } from '@clerk/express';

const app = express();

app.use(clerkMiddleware()); //attaches auth obj to req
app.use(express.json()); //parses JSON request bodies
app.use(express.urlencoded({ extended: true })); //parses json data from forms
app.use(cors({ origin: ENV.FRONTEND_URL }));

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth',
        endpoints: {
            users: '/api/users',
            products: '/api/products',
            comments: '/api/comments',
        },
    });
});

app.listen(3000, () => console.log('Server running on PORT: ', ENV.PORT));
