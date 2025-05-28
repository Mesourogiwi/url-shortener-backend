import {datetime, mysqlTable, serial, varchar, int} from 'drizzle-orm/mysql-core'

export const urlsTable = mysqlTable('urls', {
    id: serial().primaryKey(),
    url: varchar({length: 255}).notNull(),
    shortUrl: varchar({length: 255}).notNull(),
    expirationTime: datetime().notNull(),
    numberOfAccesses: int().default(0).notNull(),
    createdAt: datetime().default(new Date()).notNull()
})
