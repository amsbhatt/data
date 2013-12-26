--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

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


SET search_path = public, pg_catalog;

--
-- Name: education_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE education_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.education_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: education; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE education (
    user_id integer,
    type text,
    page_id bigint,
    year integer,
    name text,
    id integer DEFAULT nextval('education_id_seq'::regclass),
    created_at timestamp without time zone
);


ALTER TABLE public.education OWNER TO postgres;

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
    user_id text,
    id integer DEFAULT nextval('interactions_id_seq'::regclass),
    media_id integer,
    access_token text
);


ALTER TABLE public.interactions OWNER TO postgres;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.likes_id_seq OWNER TO postgres;

--
-- Name: likes; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE likes (
    page_id bigint,
    user_id integer,
    category text,
    id integer DEFAULT nextval('likes_id_seq'::regclass),
    created_at timestamp without time zone
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sessions_id_seq OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE sessions (
    key text,
    data hstore,
    id integer DEFAULT nextval('sessions_id_seq'::regclass),
    created_at timestamp without time zone
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE users (
    client_id text,
    id integer DEFAULT nextval('users_id_seq'::regclass),
    source_id text,
    access_token text,
    current_location hstore,
    birthdate date,
    gender character(6),
    source text,
    hometown_location hstore,
    created_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: work_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE work_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.work_id_seq OWNER TO postgres;

--
-- Name: work; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE work (
    user_id integer,
    location text,
    "position" text,
    page_id bigint,
    company text,
    id integer DEFAULT nextval('work_id_seq'::regclass),
    created_at timestamp without time zone
);


ALTER TABLE public.work OWNER TO postgres;

--
-- Name: education_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY education
    ADD CONSTRAINT education_id_key UNIQUE (id);


--
-- Name: interactions_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY interactions
    ADD CONSTRAINT interactions_id_key UNIQUE (id);


--
-- Name: likes_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY likes
    ADD CONSTRAINT likes_id_key UNIQUE (id);


--
-- Name: sessions_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_id_key UNIQUE (id);


--
-- Name: users_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_id_key UNIQUE (id);


--
-- Name: work_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY work
    ADD CONSTRAINT work_id_key UNIQUE (id);


--
-- Name: education_user_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace:
--

CREATE INDEX education_user_idx ON education USING btree (user_id);


--
-- Name: interactions_user_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace:
--

CREATE INDEX interactions_user_idx ON interactions USING btree (user_id);


--
-- Name: likes_user_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace:
--

CREATE INDEX likes_user_idx ON likes USING btree (user_id);


--
-- Name: session_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace:
--

CREATE INDEX session_idx ON interactions USING btree (session_id);


--
-- Name: work_user_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace:
--

CREATE INDEX work_user_idx ON work USING btree (user_id);


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