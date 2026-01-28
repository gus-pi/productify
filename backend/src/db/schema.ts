import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: text('id').primaryKey(), //clerkId
    email: text('email').notNull().unique(),
    name: text('name'),
    imageUrl: text('image_url'),
    createdAt: timestamp('created-at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated-at', { mode: 'date' })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    imageUrl: text('image_url').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created-at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated-at', { mode: 'date' }).notNull().defaultNow(),
});

export const comments = pgTable('comments', {
    id: uuid('id').defaultRandom().primaryKey(),
    content: text('title').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    productId: text('product_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created-at', { mode: 'date' }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    products: many(products),
    comments: many(comments),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
    comments: many(comments),
    //fields = the foreign key on THIS table, references the primary key of the users table
    user: one(users, { fields: [products.userId], references: [users.id] }),
}));

//Comments relations: a comment belongs to one user and one product
export const commentsRelations = relations(comments, ({ one }) => ({
    //comments.userId is the foreign key, users.id is the primary key
    user: one(users, { fields: [comments.userId], references: [users.id] }),
    product: one(products, { fields: [comments.productId], references: [products.id] }),
}));

//type inference
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
