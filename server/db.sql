CREATE TABLE "Items"
(
    "item_id" serial NOT NULL,
    "item_name" TEXT NOT NULL,
    "item_image" TEXT,
    "default_store_id" integer,
    "default_pantry_id" integer,
    "user_id" integer NOT NULL,
    "expiration_date" DATE,
    "min_quantity" integer,
    CONSTRAINT Items_pk PRIMARY KEY ("item_id")
)
WITH (
  OIDS=FALSE
);

CREATE TABLE "users"
(
    "user_id" serial NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "authentication_token" TEXT,
    CONSTRAINT users_pk PRIMARY KEY ("user_id")
)
WITH (
  OIDS=FALSE
);

CREATE TABLE "stock"
(
    "item_id" integer NOT NULL,
    "pantry_location" integer NOT NULL,
    "quantity" integer NOT NULL,
)
WITH (
  OIDS=FALSE
);

CREATE TABLE "pantry"
(
    "user_id" integer NOT NULL,
    "pantry_id" serial NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT pantry_pk PRIMARY KEY ("pantry_id")
)
WITH (
  OIDS=FALSE
);

CREATE TABLE "stores"
(
    "store_id" serial NOT NULL,
    "user_id" integer NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT stores_pk PRIMARY KEY ("store_id")
)
WITH (
  OIDS=FALSE
);

CREATE TABLE "shopping_list"
(
    "user_id" integer NOT NULL,
    "item_id" integer,
    "store_id" integer,
    "desired_qty" integer,
    "purchased_amount" integer,
    "shopping_list_id" serial NOT NULL,
    "custom_item" TEXT,
    CONSTRAINT shopping_list_pk PRIMARY KEY ("shopping_list_id")
)
WITH (
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

CREATE VIEW "public"."stock_totals"
AS
    SELECT sum(stock.quantity) AS total_quantity,
        stock.item_id,
        "Items".min_quantity
    FROM stock
        JOIN "Items" USING (item_id) 
    WHERE stock.quantity IS NOT NULL
    GROUP BY stock.item_id, "Items".min_quantity;