CREATE TABLE `urls` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`shortUrl` varchar(255) NOT NULL,
	CONSTRAINT `urls_id` PRIMARY KEY(`id`)
);
