--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pantrystocker; Type: DATABASE; Schema: -; Owner: sarahharrington
--

CREATE DATABASE pantrystocker WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE pantrystocker OWNER TO sarahharrington;

\connect pantrystocker

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Items; Type: TABLE; Schema: public; Owner: sarahharrington
--

CREATE TABLE "Items" (
    item_id integer NOT NULL,
    item_name text NOT NULL,
    item_image text,
    default_store_id integer,
    default_pantry_id integer,
    user_id integer NOT NULL,
    expiration_date date,
    min_quantity integer
);


ALTER TABLE "Items" OWNER TO sarahharrington;

--
-- Name: Items_item_id_seq; Type: SEQUENCE; Schema: public; Owner: sarahharrington
--

CREATE SEQUENCE "Items_item_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Items_item_id_seq" OWNER TO sarahharrington;

--
-- Name: Items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sarahharrington
--

ALTER SEQUENCE "Items_item_id_seq" OWNED BY "Items".item_id;


--
-- Name: pantry; Type: TABLE; Schema: public; Owner: sarahharrington
--

CREATE TABLE pantry (
    user_id integer NOT NULL,
    pantry_id integer NOT NULL,
    label text NOT NULL
);


ALTER TABLE pantry OWNER TO sarahharrington;

--
-- Name: pantry_pantry_id_seq; Type: SEQUENCE; Schema: public; Owner: sarahharrington
--

CREATE SEQUENCE pantry_pantry_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pantry_pantry_id_seq OWNER TO sarahharrington;

--
-- Name: pantry_pantry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sarahharrington
--

ALTER SEQUENCE pantry_pantry_id_seq OWNED BY pantry.pantry_id;


--
-- Name: shopping_list; Type: TABLE; Schema: public; Owner: sarahharrington
--

CREATE TABLE shopping_list (
    user_id integer NOT NULL,
    item_id integer,
    store_id integer,
    desired_qty integer,
    purchased_amount integer,
    shopping_list_id integer NOT NULL,
    custom_item text,
    item_purchased boolean DEFAULT false
);


ALTER TABLE shopping_list OWNER TO sarahharrington;

--
-- Name: shopping_list_shopping_list_id_seq; Type: SEQUENCE; Schema: public; Owner: sarahharrington
--

CREATE SEQUENCE shopping_list_shopping_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE shopping_list_shopping_list_id_seq OWNER TO sarahharrington;

--
-- Name: shopping_list_shopping_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sarahharrington
--

ALTER SEQUENCE shopping_list_shopping_list_id_seq OWNED BY shopping_list.shopping_list_id;


--
-- Name: stock; Type: TABLE; Schema: public; Owner: sarahharrington
--

CREATE TABLE stock (
    item_id integer NOT NULL,
    pantry_location integer NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT stock_quantity_check CHECK ((quantity >= 0))
);


ALTER TABLE stock OWNER TO sarahharrington;

--
-- Name: stock_totals; Type: VIEW; Schema: public; Owner: sarahharrington
--

CREATE VIEW stock_totals AS
 SELECT sum(stock.quantity) AS total_quantity,
    stock.item_id,
    "Items".min_quantity
   FROM (stock
     JOIN "Items" USING (item_id))
  WHERE (stock.quantity IS NOT NULL)
  GROUP BY stock.item_id, "Items".min_quantity;


ALTER TABLE stock_totals OWNER TO sarahharrington;

--
-- Name: stores; Type: TABLE; Schema: public; Owner: sarahharrington
--

CREATE TABLE stores (
    store_id integer NOT NULL,
    user_id integer NOT NULL,
    label text NOT NULL
);


ALTER TABLE stores OWNER TO sarahharrington;

--
-- Name: stores_store_id_seq; Type: SEQUENCE; Schema: public; Owner: sarahharrington
--

CREATE SEQUENCE stores_store_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE stores_store_id_seq OWNER TO sarahharrington;

--
-- Name: stores_store_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sarahharrington
--

ALTER SEQUENCE stores_store_id_seq OWNED BY stores.store_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: sarahharrington
--

CREATE TABLE users (
    id integer NOT NULL,
    name text,
    email text,
    username text NOT NULL,
    password text NOT NULL,
    authentication_token text
);


ALTER TABLE users OWNER TO sarahharrington;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: sarahharrington
--

CREATE SEQUENCE users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_user_id_seq OWNER TO sarahharrington;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sarahharrington
--

ALTER SEQUENCE users_user_id_seq OWNED BY users.id;


--
-- Name: Items item_id; Type: DEFAULT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY "Items" ALTER COLUMN item_id SET DEFAULT nextval('"Items_item_id_seq"'::regclass);


--
-- Name: pantry pantry_id; Type: DEFAULT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY pantry ALTER COLUMN pantry_id SET DEFAULT nextval('pantry_pantry_id_seq'::regclass);


--
-- Name: shopping_list shopping_list_id; Type: DEFAULT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY shopping_list ALTER COLUMN shopping_list_id SET DEFAULT nextval('shopping_list_shopping_list_id_seq'::regclass);


--
-- Name: stores store_id; Type: DEFAULT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY stores ALTER COLUMN store_id SET DEFAULT nextval('stores_store_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_user_id_seq'::regclass);


--
-- Name: Items items_pk; Type: CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY "Items"
    ADD CONSTRAINT items_pk PRIMARY KEY (item_id);


--
-- Name: pantry pantry_pk; Type: CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY pantry
    ADD CONSTRAINT pantry_pk PRIMARY KEY (pantry_id);


--
-- Name: shopping_list shopping_list_pk; Type: CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY shopping_list
    ADD CONSTRAINT shopping_list_pk PRIMARY KEY (shopping_list_id);


--
-- Name: stores stores_pk; Type: CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY stores
    ADD CONSTRAINT stores_pk PRIMARY KEY (store_id);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- Name: stock_item_id_pantry_location_idx; Type: INDEX; Schema: public; Owner: sarahharrington
--

CREATE UNIQUE INDEX stock_item_id_pantry_location_idx ON stock USING btree (item_id, pantry_location);


--
-- Name: Items Items_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY "Items"
    ADD CONSTRAINT "Items_fk0" FOREIGN KEY (default_store_id) REFERENCES stores(store_id);


--
-- Name: Items Items_fk1; Type: FK CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY "Items"
    ADD CONSTRAINT "Items_fk1" FOREIGN KEY (default_pantry_id) REFERENCES pantry(pantry_id);


--
-- Name: Items Items_fk2; Type: FK CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY "Items"
    ADD CONSTRAINT "Items_fk2" FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: pantry pantry_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY pantry
    ADD CONSTRAINT pantry_fk0 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: shopping_list shopping_list_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY shopping_list
    ADD CONSTRAINT shopping_list_fk0 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: shopping_list shopping_list_fk1; Type: FK CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY shopping_list
    ADD CONSTRAINT shopping_list_fk1 FOREIGN KEY (item_id) REFERENCES "Items"(item_id);


--
-- Name: shopping_list shopping_list_fk2; Type: FK CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY shopping_list
    ADD CONSTRAINT shopping_list_fk2 FOREIGN KEY (store_id) REFERENCES stores(store_id);


--
-- Name: stock stock_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT stock_fk0 FOREIGN KEY (item_id) REFERENCES "Items"(item_id);


--
-- Name: stock stock_fk1; Type: FK CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT stock_fk1 FOREIGN KEY (pantry_location) REFERENCES pantry(pantry_id);


--
-- Name: stores stores_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sarahharrington
--

ALTER TABLE ONLY stores
    ADD CONSTRAINT stores_fk0 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- PostgreSQL database dump complete
--

