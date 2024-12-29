CREATE DATABASE gradeavgubc;

CREATE TABLE sections(
    psqlidx BIGSERIAL NOT NULL,
    uuid TEXT NOT NULL,
	id INT NOT NULL,
	title TEXT NOT NULL,
	instructor TEXT NOT NULL,
	dept TEXT NOT NULL,
	year INT NOT NULL,
	avg NUMERIC(5,2) NOT NULL,
	pass INT NOT NULL,
	fail INT NOT NULL,
	audit INT NOT NULL
);