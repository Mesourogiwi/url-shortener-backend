import {datetime, mysqlTable, serial, varchar} from 'drizzle-orm/mysql-core'

export const urlsTable = mysqlTable('urls', {
    id: serial().primaryKey(),
    url: varchar({length: 255}).notNull(),
    shortUrl: varchar({length: 255}).notNull(),
    expirationTime: datetime().notNull(),
    createdAt: datetime().default(new Date()).notNull()
})
