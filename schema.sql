--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: dna; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA dna;


ALTER SCHEMA dna OWNER TO postgres;

--
-- Name: interactions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA interactions;


ALTER SCHEMA interactions OWNER TO postgres;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


SET search_path = dna, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: interactions; Type: TABLE; Schema: dna; Owner: postgres; Tablespace: 
--

CREATE TABLE interactions (
    object text,
    action text
);


ALTER TABLE dna.interactions OWNER TO postgres;

SET search_path = public, pg_catalog;

--
-- Name: interactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE interactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.interactions_id_seq OWNER TO postgres;

--
-- Name: interactions; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE interactions (
    object text,
    action text,
    category text,
    data hstore,
    created_at timestamp without time zone,
    session_id integer,
    id integer DEFAULT nextval('interactions_id_seq'::regclass),
    user_id text
);


ALTER TABLE public.interactions OWNER TO postgres;

--
-- Name: sessions_id_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE sessions_id_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sessions_id_sequence OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sessions (
    key text,
    data hstore,
    id integer DEFAULT nextval('sessions_id_sequence'::regclass),
    created_at timestamp without time zone
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: interactions_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY interactions
    ADD CONSTRAINT interactions_id_key UNIQUE (id);


--
-- Name: sessions_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_id_key UNIQUE (id);


--
-- Name: session_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX session_idx ON interactions USING btree (session_id);


--
-- Name: public; Type: ACL; Schema: -; Owner: Inception
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM "Inception";
GRANT ALL ON SCHEMA public TO "Inception";
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

