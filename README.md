Pantry Stocker

Built to be a solution for tracking the items in your pantry and other food storage spots in your home. This allows you to keep track of items, total quantities and automate the creation of shopping lists.

https://pantry-stocker.herokuapp.com/#/home

## Built With

PostgreSQL
Express
Angular JS
Node.js
Angular Material
FileStack

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Link to software that is required to install the app (e.g. node).

- [Node.js](https://nodejs.org/en/)
- List other prerequisites here


### Installing

Steps to get the development environment running.

```
CREATE TABLE "Items" (
  "item_id" serial NOT NULL,
  "item_name" TEXT NOT NULL,
  "item_image" TEXT,
  "default_store_id" integer,
  "default_pantry_id" integer,
  "user_id" integer NOT NULL,
  "expiration_date" DATE NOT NULL,
  "min_quantity" integer,
  CONSTRAINT Items_pk PRIMARY KEY ("item_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "users" (
  "user_id" serial NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "authentication_token" TEXT NOT NULL,
  CONSTRAINT users_pk PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "stock" (
  "item_id" integer NOT NULL,
  "pantry_location" integer NOT NULL,
  "quantity" integer NOT NULL,
) WITH (
  OIDS=FALSE
);

CREATE TABLE "pantry" (
  "user_id" integer NOT NULL,
  "pantry_id" serial NOT NULL,
  "label" TEXT NOT NULL,
  CONSTRAINT pantry_pk PRIMARY KEY ("pantry_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "stores" (
  "store_id" serial NOT NULL,
  "user_id" integer NOT NULL,
  "label" TEXT NOT NULL,
  CONSTRAINT stores_pk PRIMARY KEY ("store_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "shopping_list" (
  "user_id" integer NOT NULL,
  "item_id" integer,
  "store_id" integer,
  "desired_qty" integer,
  "purchased_amount" integer,
  "shopping_list_id" serial NOT NULL,
  "custom_item" TEXT,
  CONSTRAINT shopping_list_pk PRIMARY KEY ("shopping_list_id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "Items" ADD CONSTRAINT "Items_fk0" FOREIGN KEY ("default_store_id") REFERENCES "stores"("store_id");
ALTER TABLE "Items" ADD CONSTRAINT "Items_fk1" FOREIGN KEY ("default_pantry_id") REFERENCES "pantry"("pantry_id");
ALTER TABLE "Items" ADD CONSTRAINT "Items_fk2" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");

ALTER TABLE "stock" ADD CONSTRAINT "stock_fk0" FOREIGN KEY ("item_id") REFERENCES "Items"("item_id");
ALTER TABLE "stock" ADD CONSTRAINT "stock_fk1" FOREIGN KEY ("pantry_location") REFERENCES "pantry"("pantry_id");

ALTER TABLE "pantry" ADD CONSTRAINT "pantry_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");

ALTER TABLE "stores" ADD CONSTRAINT "stores_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");

ALTER TABLE "shopping_list" ADD CONSTRAINT "shopping_list_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "shopping_list" ADD CONSTRAINT "shopping_list_fk1" FOREIGN KEY ("item_id") REFERENCES "Items"("item_id");
ALTER TABLE "shopping_list" ADD CONSTRAINT "shopping_list_fk2" FOREIGN KEY ("store_id") REFERENCES "stores"("store_id");

CREATE VIEW "public"."stock_totals" AS  SELECT sum(stock.quantity) AS total_quantity,
    stock.item_id,
    "Items".min_quantity
   FROM stock
     JOIN "Items" USING (item_id)
  WHERE stock.quantity IS NOT NULL
  GROUP BY stock.item_id, "Items".min_quantity;;
  ```

## Screen Shot

Include one or two screen shots of your project here (optional). Remove if unused.

## Documentation

Link to a read-only version of your scope document or other relevant documentation here (optional). Remove if unused.

### Completed Features

High level list of items completed.

- [x] Feature a
- [x] Feature b

### Next Steps

Features that you would like to add at some point in the future.

- [ ] Feature c

## Deployment

Add additional notes about how to deploy this on a live system

## Authors

Sarah Harrington


## Acknowledgments

* Hat tip to anyone who's code was used
