ALTER TABLE `urls` MODIFY COLUMN `createdAt` datetime NOT NULL DEFAULT '2025-05-28 14:20:18.702';--> statement-breakpoint
ALTER TABLE `urls` ADD `numberOfAccesses` int DEFAULT 0 NOT NULL;