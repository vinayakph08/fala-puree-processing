SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '9c67b84d-0cdb-4b28-967c-a8f2c9a62a4e', '{"action":"user_confirmation_requested","actor_id":"58506b03-802c-4d8a-a5a3-3c5bdae247f5","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-08 12:15:51.180367+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ff70779-f5a2-4845-b67a-88ccbd35a5ed', '{"action":"user_confirmation_requested","actor_id":"ec38cb39-9ad0-4a02-a190-7105345042a1","actor_username":"7204839275@fala.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-10 09:55:18.08021+00', ''),
	('00000000-0000-0000-0000-000000000000', '9fc55a3e-4a4b-4728-ba46-2bc51d1877e0', '{"action":"user_confirmation_requested","actor_id":"ec38cb39-9ad0-4a02-a190-7105345042a1","actor_username":"7204839275@fala.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-10 09:56:44.254675+00', ''),
	('00000000-0000-0000-0000-000000000000', '10eada73-753f-4a7c-933a-e823c27e3a46', '{"action":"user_signedup","actor_id":"58506b03-802c-4d8a-a5a3-3c5bdae247f5","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-15 18:27:40.014972+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c5a911da-0b2e-407b-90b4-cb85eadc5485', '{"action":"login","actor_id":"58506b03-802c-4d8a-a5a3-3c5bdae247f5","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-15 18:27:40.043453+00', ''),
	('00000000-0000-0000-0000-000000000000', '68b6af1c-1ca2-4820-bb6b-d2161bb4d84c', '{"action":"login","actor_id":"58506b03-802c-4d8a-a5a3-3c5bdae247f5","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-15 18:30:02.080831+00', ''),
	('00000000-0000-0000-0000-000000000000', '29f13d37-e20e-4545-91e1-0c26d0dd5964', '{"action":"login","actor_id":"58506b03-802c-4d8a-a5a3-3c5bdae247f5","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-15 18:40:52.905028+00', ''),
	('00000000-0000-0000-0000-000000000000', '96735fd1-3ed9-488a-8ce1-d8ce43dd60a1', '{"action":"logout","actor_id":"58506b03-802c-4d8a-a5a3-3c5bdae247f5","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account"}', '2025-09-15 18:48:25.777819+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd377826e-66b5-47e2-be12-49fa507c9238', '{"action":"user_repeated_signup","actor_id":"58506b03-802c-4d8a-a5a3-3c5bdae247f5","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-15 18:49:00.226354+00', ''),
	('00000000-0000-0000-0000-000000000000', '90a04396-7860-4e1e-93e3-78ca6fb3c513', '{"action":"user_signedup","actor_id":"ff9a2144-fbcc-4b66-8f7a-b88f50c81c36","actor_username":"8553912906@fala.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-15 18:49:38.468903+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd2e1cdd7-3407-4548-9e2e-3ab7980e41e8', '{"action":"login","actor_id":"ff9a2144-fbcc-4b66-8f7a-b88f50c81c36","actor_username":"8553912906@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-15 18:49:38.475341+00', ''),
	('00000000-0000-0000-0000-000000000000', '63ed3e27-0d52-4a55-81f8-219c783b1d38', '{"action":"logout","actor_id":"ff9a2144-fbcc-4b66-8f7a-b88f50c81c36","actor_username":"8553912906@fala.com","actor_via_sso":false,"log_type":"account"}', '2025-09-15 18:52:18.754196+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2d063d3-4a64-4ff9-b78a-a7a1e5d6838c', '{"action":"user_repeated_signup","actor_id":"58506b03-802c-4d8a-a5a3-3c5bdae247f5","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-15 18:53:05.862006+00', ''),
	('00000000-0000-0000-0000-000000000000', '68130bd5-f229-4a3f-a11c-ad09d530c516', '{"action":"user_repeated_signup","actor_id":"ff9a2144-fbcc-4b66-8f7a-b88f50c81c36","actor_username":"8553912906@fala.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-15 18:56:01.960918+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e57e3df-1313-40f1-b67b-d42604febfcd', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"8553912905@fala.com","user_id":"58506b03-802c-4d8a-a5a3-3c5bdae247f5","user_phone":""}}', '2025-09-15 18:58:47.053523+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a9568751-3874-42ef-b4eb-0050e8cebd9c', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"8553912906@fala.com","user_id":"ff9a2144-fbcc-4b66-8f7a-b88f50c81c36","user_phone":""}}', '2025-09-15 18:58:47.111636+00', ''),
	('00000000-0000-0000-0000-000000000000', '1dcb00ab-1407-4494-b452-ff8299acb627', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"7204839275@fala.com","user_id":"ec38cb39-9ad0-4a02-a190-7105345042a1","user_phone":""}}', '2025-09-15 18:58:53.105787+00', ''),
	('00000000-0000-0000-0000-000000000000', '073f4300-0d5e-40dc-befb-8928354e8f64', '{"action":"user_signedup","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-15 19:00:34.817411+00', ''),
	('00000000-0000-0000-0000-000000000000', '9edaed7e-8654-4290-9dbf-147128f97afe', '{"action":"login","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-15 19:00:34.823369+00', ''),
	('00000000-0000-0000-0000-000000000000', '365c4269-a00b-487e-9ae9-fc2cbde3d08f', '{"action":"logout","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account"}', '2025-09-15 19:02:31.970086+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2b07a63-b274-4653-9002-6cfc0388a9fd', '{"action":"user_signedup","actor_id":"feb42252-04aa-4c5f-97e9-ce24cd373f24","actor_username":"9060027938@fala.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-16 09:54:55.567994+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ad54bd8-f52f-4527-b96c-bc5fba79ca61', '{"action":"login","actor_id":"feb42252-04aa-4c5f-97e9-ce24cd373f24","actor_username":"9060027938@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-16 09:54:55.602495+00', ''),
	('00000000-0000-0000-0000-000000000000', '565806b7-cff4-4ec5-b5d8-d12fefda8274', '{"action":"token_refreshed","actor_id":"feb42252-04aa-4c5f-97e9-ce24cd373f24","actor_username":"9060027938@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 13:07:25.533087+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc47a0a1-ff03-47d1-a237-421125db147f', '{"action":"token_revoked","actor_id":"feb42252-04aa-4c5f-97e9-ce24cd373f24","actor_username":"9060027938@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 13:07:25.555514+00', ''),
	('00000000-0000-0000-0000-000000000000', '892707a2-71f5-4901-8283-dedae47992e0', '{"action":"login","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-16 19:42:40.211622+00', ''),
	('00000000-0000-0000-0000-000000000000', '0659a814-ef7b-4001-898b-cd9d253d6849', '{"action":"token_refreshed","actor_id":"feb42252-04aa-4c5f-97e9-ce24cd373f24","actor_username":"9060027938@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 06:56:16.471361+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be45f25b-df4a-4f7f-8516-f6fbef032162', '{"action":"token_refreshed","actor_id":"feb42252-04aa-4c5f-97e9-ce24cd373f24","actor_username":"9060027938@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 06:56:16.980049+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c40a0f2a-c0aa-4b69-8224-fcf17862f095', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 07:19:30.469556+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b7fec8e4-3a18-4e05-a8cb-fe126a436602', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 07:19:30.476954+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b5ca3a06-0af2-4020-b39b-53b7bfc39f6c', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 07:19:31.049796+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da2d4423-6b54-4a16-9b8c-7626f1cfb0ec', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 19:33:57.637883+00', ''),
	('00000000-0000-0000-0000-000000000000', '852d7a35-97b4-478e-a8b6-87623807d7e9', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 19:33:57.669063+00', ''),
	('00000000-0000-0000-0000-000000000000', '832a37d5-1b9d-402d-90ca-0acb0130ca67', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 19:33:58.170362+00', ''),
	('00000000-0000-0000-0000-000000000000', '6661c22d-bb5a-4bb4-8215-f90e41d0d95a', '{"action":"user_signedup","actor_id":"68c421e8-bbcd-430b-9a2f-192703a7de5b","actor_username":"9353955121@fala.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-18 05:38:16.996905+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a37957d-b2d4-4701-9b5b-a8c93cd225dd', '{"action":"login","actor_id":"68c421e8-bbcd-430b-9a2f-192703a7de5b","actor_username":"9353955121@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-18 05:38:17.03372+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ddd1fe55-751e-45b7-8207-c1d7ea8133b8', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 16:12:17.977208+00', ''),
	('00000000-0000-0000-0000-000000000000', '59390cba-aea1-4a7a-bbb2-d4ae9db05699', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 16:12:18.002429+00', ''),
	('00000000-0000-0000-0000-000000000000', '973dd133-6c3a-4085-bd04-6fcf6d6c6ac2', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 16:12:18.967006+00', ''),
	('00000000-0000-0000-0000-000000000000', '94108c14-a24f-4a11-852a-a456198909f0', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 16:12:22.024396+00', ''),
	('00000000-0000-0000-0000-000000000000', '134320ee-280c-46de-90c4-7e56c73644cb', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 16:12:22.324943+00', ''),
	('00000000-0000-0000-0000-000000000000', '08db51f9-cb4c-4113-b2af-4f1f5f5f820f', '{"action":"login","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-19 07:28:11.11334+00', ''),
	('00000000-0000-0000-0000-000000000000', '31700c39-45a8-457a-ac75-623847dac605', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 10:38:25.039031+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e767f22-2bd0-4685-8e11-0e337007b3ce', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 10:38:25.070509+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c98128a-097a-4899-a654-dcd3afab4310', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 10:38:26.693168+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fdd0b52e-e7cf-4725-9f6c-8fddb118ad09', '{"action":"logout","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account"}', '2025-09-19 10:38:58.82078+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cdefc942-4e4e-460b-a994-03e49d4163d2', '{"action":"login","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-20 08:28:27.322545+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aa7ce8f2-05e5-4dfa-9546-cd5020a9983e', '{"action":"logout","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account"}', '2025-09-20 08:28:40.646838+00', ''),
	('00000000-0000-0000-0000-000000000000', '4156f93e-1ecb-47a8-91d8-7d36dbf77d93', '{"action":"user_signedup","actor_id":"511ab144-08b2-49c5-b690-76725353f530","actor_username":"7204839275@fala.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-20 08:29:22.028684+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c85ecf6-89dc-4cb1-8441-1e971db26060', '{"action":"login","actor_id":"511ab144-08b2-49c5-b690-76725353f530","actor_username":"7204839275@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-20 08:29:22.039131+00', ''),
	('00000000-0000-0000-0000-000000000000', '355303f6-709c-4a04-a06d-3fd9289e31c3', '{"action":"login","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-22 19:09:06.636229+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db19c537-e334-4b35-9dc9-0579580cc4a8', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 09:53:52.124622+00', ''),
	('00000000-0000-0000-0000-000000000000', '8b8de782-6361-4891-aa02-d499367a6e00', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 09:53:52.151872+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bd2320a5-243d-421a-af2c-fb8a8da3d390', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 09:53:52.90189+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1f3ea10-81d0-4dc0-9174-4436f1c4c3ac', '{"action":"logout","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account"}', '2025-09-26 09:53:59.895965+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c10e80c5-34c6-40f0-8a19-c8deb2ca5c74', '{"action":"user_signedup","actor_id":"fff2de1b-a803-4410-b240-c406e0e9f98a","actor_username":"9008004824@fala.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-26 10:01:43.872449+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be4f206a-9b1c-44c0-8eee-3e4cc0f89bab', '{"action":"login","actor_id":"fff2de1b-a803-4410-b240-c406e0e9f98a","actor_username":"9008004824@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-26 10:01:43.881792+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b4b9405-eec9-473e-a2be-3389f5824814', '{"action":"logout","actor_id":"fff2de1b-a803-4410-b240-c406e0e9f98a","actor_username":"9008004824@fala.com","actor_via_sso":false,"log_type":"account"}', '2025-09-26 10:09:11.179608+00', ''),
	('00000000-0000-0000-0000-000000000000', '6e64d3b3-5660-4bfa-b327-9afacab934d8', '{"action":"user_signedup","actor_id":"ef919117-d69c-40b5-936a-7a995c5c1f33","actor_username":"9964404934@fala.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-26 10:13:20.107438+00', ''),
	('00000000-0000-0000-0000-000000000000', '639369fa-613e-45e6-a1e9-473dff972966', '{"action":"login","actor_id":"ef919117-d69c-40b5-936a-7a995c5c1f33","actor_username":"9964404934@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-26 10:13:20.115531+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc8f0775-cf70-4b82-98a4-e5d5bd402bfb', '{"action":"login","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-26 10:14:00.869476+00', ''),
	('00000000-0000-0000-0000-000000000000', '67115add-daae-4501-b881-b71c65546a56', '{"action":"login","actor_id":"fff2de1b-a803-4410-b240-c406e0e9f98a","actor_username":"9008004824@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-26 10:14:09.778724+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e96df71f-d393-427d-9495-4c0985b52b6a', '{"action":"user_signedup","actor_id":"f7342022-7711-49cc-9e69-71d751bcc8f0","actor_username":"8277193858@fala.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-26 10:37:30.342173+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea6b27b0-5478-445d-8447-bceb67b25601', '{"action":"login","actor_id":"f7342022-7711-49cc-9e69-71d751bcc8f0","actor_username":"8277193858@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-26 10:37:30.35985+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9d77e2e-875d-49d6-9d85-32aa45e40681', '{"action":"token_refreshed","actor_id":"fff2de1b-a803-4410-b240-c406e0e9f98a","actor_username":"9008004824@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 11:22:39.692888+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4e27b5b-ff95-4587-a08c-082332f8f7e6', '{"action":"token_revoked","actor_id":"fff2de1b-a803-4410-b240-c406e0e9f98a","actor_username":"9008004824@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 11:22:39.711682+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb53792c-fe58-4782-9418-c324e67e32fc', '{"action":"user_signedup","actor_id":"46e1e353-69ab-472d-b9cd-6c7ee2c7bed9","actor_username":"9844272856@fala.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-26 11:31:20.253682+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef283fe2-516b-4881-afe5-51033e568d63', '{"action":"login","actor_id":"46e1e353-69ab-472d-b9cd-6c7ee2c7bed9","actor_username":"9844272856@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-26 11:31:20.265388+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6340249-a5ee-40f2-a540-c684517431fa', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 11:41:43.630052+00', ''),
	('00000000-0000-0000-0000-000000000000', '909d88a8-7602-4a57-a6f4-aae6d7f0ff49', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 11:41:43.634505+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e953bb9-922b-433f-94b1-44fb42b42ac4', '{"action":"token_refreshed","actor_id":"fff2de1b-a803-4410-b240-c406e0e9f98a","actor_username":"9008004824@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 11:43:58.999115+00', ''),
	('00000000-0000-0000-0000-000000000000', '6087f2f8-3930-418e-bde3-8d8f74e06687', '{"action":"token_refreshed","actor_id":"f7342022-7711-49cc-9e69-71d751bcc8f0","actor_username":"8277193858@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 14:12:08.824239+00', ''),
	('00000000-0000-0000-0000-000000000000', '2a633e30-b3d8-4b0e-b854-876863f0cf49', '{"action":"token_revoked","actor_id":"f7342022-7711-49cc-9e69-71d751bcc8f0","actor_username":"8277193858@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 14:12:08.844459+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c12ef5ae-29d0-4037-b3b9-072dfb4c0ec3', '{"action":"token_refreshed","actor_id":"f7342022-7711-49cc-9e69-71d751bcc8f0","actor_username":"8277193858@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 14:12:09.335367+00', ''),
	('00000000-0000-0000-0000-000000000000', '53df4fa8-f0b5-4079-b91f-6a8414089db6', '{"action":"token_refreshed","actor_id":"ef919117-d69c-40b5-936a-7a995c5c1f33","actor_username":"9964404934@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-27 16:48:07.548127+00', ''),
	('00000000-0000-0000-0000-000000000000', 'af18c4e4-f267-4c15-a17a-bd06036c32fd', '{"action":"token_revoked","actor_id":"ef919117-d69c-40b5-936a-7a995c5c1f33","actor_username":"9964404934@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-27 16:48:07.574625+00', ''),
	('00000000-0000-0000-0000-000000000000', '612e098c-f9d3-4708-9281-3d764f9a153b', '{"action":"token_refreshed","actor_id":"f7342022-7711-49cc-9e69-71d751bcc8f0","actor_username":"8277193858@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-27 17:21:47.499932+00', ''),
	('00000000-0000-0000-0000-000000000000', 'de9d592d-da3d-4038-b5b2-8778fb24d4d4', '{"action":"token_revoked","actor_id":"f7342022-7711-49cc-9e69-71d751bcc8f0","actor_username":"8277193858@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-27 17:21:47.508454+00', ''),
	('00000000-0000-0000-0000-000000000000', '68214619-f7b6-45e6-bf89-f13ff7339914', '{"action":"token_refreshed","actor_id":"f7342022-7711-49cc-9e69-71d751bcc8f0","actor_username":"8277193858@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-27 17:21:47.96998+00', ''),
	('00000000-0000-0000-0000-000000000000', '67cca177-3dca-4236-beb7-ba1c0a18a1f1', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 07:54:47.346957+00', ''),
	('00000000-0000-0000-0000-000000000000', '960a4a86-1606-42e9-a172-1489975c38b9', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 07:54:47.358588+00', ''),
	('00000000-0000-0000-0000-000000000000', '451bd8a3-453b-457c-b6ea-5db95b0cfe30', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 07:54:48.0503+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0f8cc58-a044-48d9-9a8b-866d74043a4b', '{"action":"login","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-29 07:54:59.940534+00', ''),
	('00000000-0000-0000-0000-000000000000', '8822a092-484f-4f4c-a4d5-9c4d2a8f94ba', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 14:13:51.722921+00', ''),
	('00000000-0000-0000-0000-000000000000', '71277792-be6f-456c-9206-80b3a1da1f2c', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 14:13:51.748691+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c272cad-ab8c-42b6-93d0-f8994f92f1c2', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 14:13:51.825755+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c16d5e0c-8ba4-484f-ae16-e9f2cd8fbd58', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 15:36:59.097996+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7b5fbb2-ff2f-4fa2-aa66-aecece2e7377', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 15:36:59.118637+00', ''),
	('00000000-0000-0000-0000-000000000000', '56099a23-8448-4802-9e23-ed4eb646107a', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 15:36:59.176461+00', ''),
	('00000000-0000-0000-0000-000000000000', '2d4ac04f-6425-4686-81b7-c90c76cc1820', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 16:11:39.16315+00', ''),
	('00000000-0000-0000-0000-000000000000', '2a6d5075-51aa-4d00-a669-e77d89f803b1', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 16:11:39.211848+00', ''),
	('00000000-0000-0000-0000-000000000000', '365848a5-94ba-4b68-b3d3-2948e5368de6', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-30 05:58:45.938381+00', ''),
	('00000000-0000-0000-0000-000000000000', '87ab4ccf-29d0-4a30-a798-7a3e02d7edaa', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-09-30 05:58:45.967613+00', ''),
	('00000000-0000-0000-0000-000000000000', '888b44e7-e3d2-4a0f-9dbb-470b1f2be431', '{"action":"token_refreshed","actor_id":"ef919117-d69c-40b5-936a-7a995c5c1f33","actor_username":"9964404934@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-01 05:58:48.072143+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aaabc4ae-e502-4ac4-bb8d-a206d67b097a', '{"action":"token_refreshed","actor_id":"ef919117-d69c-40b5-936a-7a995c5c1f33","actor_username":"9964404934@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-01 06:02:39.125447+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd2fd297e-c737-40cc-955d-578104ba2a57', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-01 06:23:18.853857+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eac403f7-6127-4ced-8a5a-6b891d90f391', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-01 06:23:19.307196+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca8aba85-04c6-411e-a284-86a8daa5e135', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-01 08:33:49.552094+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6514d89-040e-4820-a73d-6d8f5aa73c10', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-01 08:33:49.564668+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bd167e55-b0c5-4f7f-a8eb-4714f4e4f6a5', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-01 08:33:51.394974+00', ''),
	('00000000-0000-0000-0000-000000000000', '6d4e6dec-3829-4024-bcf6-68bc2cbd5317', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-01 10:30:20.352999+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e55062e9-ec06-45d7-96e5-0765cab5d078', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-01 10:30:20.375584+00', ''),
	('00000000-0000-0000-0000-000000000000', '9fb0c53d-c355-4654-9921-cc4ff66ffe23', '{"action":"login","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-03 09:49:55.351265+00', ''),
	('00000000-0000-0000-0000-000000000000', '88767c5e-4ec1-47b4-b264-74c00f7b83fe', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-03 13:34:06.69672+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd574dc91-70c0-48bb-bf5a-78176cadf0c4', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-03 13:34:06.710508+00', ''),
	('00000000-0000-0000-0000-000000000000', '00ce139a-3c61-41da-a8b2-488e61c915d7', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-03 13:34:06.751984+00', ''),
	('00000000-0000-0000-0000-000000000000', '88bf0a32-6ff3-4773-bda3-584bae11676c', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-03 13:34:06.769107+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fac68c64-6491-4e97-955b-86cbaadab6af', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 05:31:53.618601+00', ''),
	('00000000-0000-0000-0000-000000000000', '93956c05-1c16-4c73-bbe1-d22430f39cef', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 05:31:54.52945+00', ''),
	('00000000-0000-0000-0000-000000000000', '48e5d056-d6bc-4457-b2ec-f43b27ebbafd', '{"action":"user_signedup","actor_id":"59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d","actor_username":"9019408738@fala.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-04 07:13:57.891485+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c86d9a9b-d362-4822-ac06-f78e23f2fe03', '{"action":"login","actor_id":"59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d","actor_username":"9019408738@fala.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-04 07:13:57.917208+00', ''),
	('00000000-0000-0000-0000-000000000000', '7ca2a158-2a81-47ce-a479-af3fcee8d13e', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 10:10:20.017768+00', ''),
	('00000000-0000-0000-0000-000000000000', '964a65fb-f699-4486-9a13-db988c17700e', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 10:10:20.040326+00', ''),
	('00000000-0000-0000-0000-000000000000', '80faefb5-5f6e-4e09-b47b-bee27a5bb628', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 10:10:21.058353+00', ''),
	('00000000-0000-0000-0000-000000000000', '642a6685-b1b1-4f68-8aea-011d28ea03e0', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 12:15:05.652116+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a1fc59aa-93f2-4e92-abe7-d64a1397ba41', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 12:15:05.679333+00', ''),
	('00000000-0000-0000-0000-000000000000', '795d295e-5ec4-46ad-b99d-7ede8d774dfa', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 12:15:05.768831+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c9eb7e0-1eb1-4578-9739-c98db911a6ee', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 12:20:24.726238+00', ''),
	('00000000-0000-0000-0000-000000000000', '21bd443f-3f5c-48ea-98e7-e05177f5e4dc', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 12:20:25.586589+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2d5b503-dfda-4026-8d68-f81827a7af53', '{"action":"token_refreshed","actor_id":"f7342022-7711-49cc-9e69-71d751bcc8f0","actor_username":"8277193858@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 14:31:51.012225+00', ''),
	('00000000-0000-0000-0000-000000000000', '62b32e94-c30c-45d8-a99f-0a7edbf03b29', '{"action":"token_revoked","actor_id":"f7342022-7711-49cc-9e69-71d751bcc8f0","actor_username":"8277193858@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 14:31:51.033081+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f63d0923-f04f-4124-83c7-740498d5d4c0', '{"action":"token_refreshed","actor_id":"f7342022-7711-49cc-9e69-71d751bcc8f0","actor_username":"8277193858@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 14:31:51.716469+00', ''),
	('00000000-0000-0000-0000-000000000000', '6a8e5cf5-be53-49cd-9689-34133bb72998', '{"action":"token_refreshed","actor_id":"59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d","actor_username":"9019408738@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 14:47:47.340288+00', ''),
	('00000000-0000-0000-0000-000000000000', '29a0f122-7645-4c01-a99e-249901e03a6a', '{"action":"token_revoked","actor_id":"59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d","actor_username":"9019408738@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 14:47:47.354157+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e73aa744-4888-4a71-b42d-457b8911e084', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 17:05:07.16021+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6131640-7b40-468a-bef7-45f448ec1371', '{"action":"token_revoked","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 17:05:07.177238+00', ''),
	('00000000-0000-0000-0000-000000000000', '03261b48-9cf6-48cd-8dc3-746a0bbd80ed', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 17:05:07.240313+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1a749c4-9b35-4483-aa62-52c7527ef417', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 17:06:49.315988+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc64ff1b-a335-49bb-89f3-1ea3835b7c9c', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 17:06:49.407691+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b0d7b3f-1d61-486c-8962-3da24fd2bd5e', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 17:06:49.714851+00', ''),
	('00000000-0000-0000-0000-000000000000', '2aa108ac-1321-4d0a-9246-b85bf0fd760b', '{"action":"token_refreshed","actor_id":"186fbbe0-d1b8-4c8a-babd-965259d96c0d","actor_username":"8553912905@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-04 17:06:49.840063+00', ''),
	('00000000-0000-0000-0000-000000000000', '24c0602f-5723-4467-a8bf-614869f83cf0', '{"action":"token_refreshed","actor_id":"59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d","actor_username":"9019408738@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-06 14:33:57.898188+00', ''),
	('00000000-0000-0000-0000-000000000000', '3137166d-9a32-4987-adb2-e7d77c485197', '{"action":"token_revoked","actor_id":"59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d","actor_username":"9019408738@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-06 14:33:57.926158+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1f00cc6-ab4d-4ff7-8c8e-7b42704300b9', '{"action":"token_refreshed","actor_id":"59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d","actor_username":"9019408738@fala.com","actor_via_sso":false,"log_type":"token"}', '2025-10-07 13:32:24.415115+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('a327e5c8-a272-4b6e-9370-4cd490e5f503', '58506b03-802c-4d8a-a5a3-3c5bdae247f5', '97ae7685-64ca-4e75-87b2-f0cfba404a5f', 's256', 'Bxthji7I9uX8AQ1RdYpCHSwFNNIIXi3vC7akOwsCxzw', 'email', '', '', '2025-09-08 12:15:51.182837+00', '2025-09-08 12:15:51.182837+00', 'email/signup', NULL),
	('68a5db4c-9e45-4715-8c82-3c65dc425c1f', 'ec38cb39-9ad0-4a02-a190-7105345042a1', '00b0149a-cb59-4d11-ba78-b8a9a615fe2c', 's256', '1cVTaUUdhVq-RQ75T2ht6oMIMiR6DteiRVDSK7tQeGI', 'email', '', '', '2025-09-10 09:55:18.093104+00', '2025-09-10 09:55:18.093104+00', 'email/signup', NULL),
	('132b38a7-0da0-4e00-9d2e-3f4d7af14a67', 'ec38cb39-9ad0-4a02-a190-7105345042a1', '3ecef9c3-7cf2-4302-a161-c5513c7b766f', 's256', 'x2HLWa-mwAyQ1nzumejW51yiF8sgRF7fzaM49HERBIM', 'email', '', '', '2025-09-10 09:56:44.256069+00', '2025-09-10 09:56:44.256069+00', 'email/signup', NULL);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', 'authenticated', 'authenticated', '8553912905@fala.com', '$2a$10$9Nflgt9QDDR9h8YQ2S87P.Snub0hh2gUWaMsBfgzh6WXrjRMNE47G', '2025-09-15 19:00:34.818848+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-10-03 09:49:55.49578+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "186fbbe0-d1b8-4c8a-babd-965259d96c0d", "role": "FARMER", "email": "8553912905@fala.com", "state": "karnataka", "farm_id": "KADHGM0001", "village": "gamangatti", "district": "dharwad", "last_name": "Hulabutti", "first_name": "Vinayak", "phone_number": "8553912905", "email_verified": true, "phone_verified": false, "language_preference": "kn"}', NULL, '2025-09-15 19:00:34.805324+00', '2025-10-04 17:05:07.198715+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'feb42252-04aa-4c5f-97e9-ce24cd373f24', 'authenticated', 'authenticated', '9060027938@fala.com', '$2a$10$KriTMHonLVl2tHFZZqRG2urwsbn4RSmL7g7TMkCpFZIKwRZ56a43m', '2025-09-16 09:54:55.580564+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-16 09:54:55.60611+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "feb42252-04aa-4c5f-97e9-ce24cd373f24", "role": "FARMER", "email": "9060027938@fala.com", "state": "karnataka", "farm_id": "KADHGM0002", "village": "gamangatti", "district": "dharwad", "last_name": "ಗಂಜಿಗಟ್ಟಿ", "first_name": "ಮಹಾದೇವಪ್ಪ", "phone_number": "9060027938", "email_verified": true, "phone_verified": false, "language_preference": "kn"}', NULL, '2025-09-16 09:54:55.457677+00', '2025-09-16 13:07:25.587368+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '68c421e8-bbcd-430b-9a2f-192703a7de5b', 'authenticated', 'authenticated', '9353955121@fala.com', '$2a$10$LrVX5Jvqcg0DLSxk0It.NuCd.pGnE36oLwxW3vQJwvZFs06jLOv3K', '2025-09-18 05:38:17.010968+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-18 05:38:17.036672+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "68c421e8-bbcd-430b-9a2f-192703a7de5b", "role": "FARMER", "email": "9353955121@fala.com", "state": "karnataka", "farm_id": "KADHGM0003", "village": "gamangatti", "district": "dharwad", "last_name": "Kanakur", "first_name": "Darshan", "phone_number": "9353955121", "email_verified": true, "phone_verified": false, "language_preference": "kn"}', NULL, '2025-09-18 05:38:16.877824+00', '2025-09-18 05:38:17.090311+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '511ab144-08b2-49c5-b690-76725353f530', 'authenticated', 'authenticated', '7204839275@fala.com', '$2a$10$.uobBorE1Bb9GdSeOGoksuXw3PdNGR19N5MAwtJNXj5Ass6tNkary', '2025-09-20 08:29:22.029683+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-20 08:29:22.039833+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "511ab144-08b2-49c5-b690-76725353f530", "role": "FARMER", "email": "7204839275@fala.com", "state": "karnataka", "farm_id": "KADHGM0004", "village": "gamangatti", "district": "dharwad", "last_name": "M Akki", "first_name": "Megha", "phone_number": "7204839275", "email_verified": true, "phone_verified": false, "language_preference": "en"}', NULL, '2025-09-20 08:29:21.991422+00', '2025-09-20 08:29:22.042794+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'fff2de1b-a803-4410-b240-c406e0e9f98a', 'authenticated', 'authenticated', '9008004824@fala.com', '$2a$10$o./YgEg5NmI3eI91reN/oOwz9eIOgRKO2dyEaLSe2bFNe97OlJ29m', '2025-09-26 10:01:43.874081+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-26 10:14:09.784542+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "fff2de1b-a803-4410-b240-c406e0e9f98a", "role": "FARMER", "email": "9008004824@fala.com", "state": "karnataka", "farm_id": "KADHGM0005", "village": "gamangatti", "district": "dharwad", "last_name": "HONNALLI", "first_name": "PARAMESH", "phone_number": "9008004824", "email_verified": true, "phone_verified": false, "language_preference": "kn"}', NULL, '2025-09-26 10:01:43.8362+00', '2025-09-26 11:22:39.743056+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'f7342022-7711-49cc-9e69-71d751bcc8f0', 'authenticated', 'authenticated', '8277193858@fala.com', '$2a$10$uyvja0tr1py8FtgHuzrLpO/G3uQwVoGCeOHzcP2Xw6eHIQZB/5Mdu', '2025-09-26 10:37:30.351961+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-26 10:37:30.36292+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "f7342022-7711-49cc-9e69-71d751bcc8f0", "role": "FARMER", "email": "8277193858@fala.com", "state": "karnataka", "farm_id": "KADHGM0007", "village": "gamangatti", "district": "dharwad", "last_name": "maniyar", "first_name": "allavuddeen ", "phone_number": "8277193858", "email_verified": true, "phone_verified": false, "language_preference": "en"}', NULL, '2025-09-26 10:37:30.28883+00', '2025-10-04 14:31:51.063915+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ef919117-d69c-40b5-936a-7a995c5c1f33', 'authenticated', 'authenticated', '9964404934@fala.com', '$2a$10$HzBgMzLgzFn0jmduFHcCZ.WCKdozYZm8oWr5.ktP8ampxI/ldp7GO', '2025-09-26 10:13:20.10958+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-26 10:13:20.116236+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "ef919117-d69c-40b5-936a-7a995c5c1f33", "role": "FARMER", "email": "9964404934@fala.com", "state": "karnataka", "farm_id": "KADHGM0006", "village": "gamangatti", "district": "dharwad", "last_name": "Nadaf ", "first_name": "Makamsab,k,nadaf", "phone_number": "9964404934", "email_verified": true, "phone_verified": false, "language_preference": "kn"}', NULL, '2025-09-26 10:13:20.085128+00', '2025-09-27 16:48:07.62245+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '46e1e353-69ab-472d-b9cd-6c7ee2c7bed9', 'authenticated', 'authenticated', '9844272856@fala.com', '$2a$10$IZhYuP60I6IfCE2xPELuVetstpjtiRo4ohvBvHp87iaw8VPFE81fC', '2025-09-26 11:31:20.255475+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-26 11:31:20.266016+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "46e1e353-69ab-472d-b9cd-6c7ee2c7bed9", "role": "FARMER", "email": "9844272856@fala.com", "state": "karnataka", "farm_id": "KADHGM0008", "village": "gamangatti", "district": "dharwad", "last_name": "NAIKAR", "first_name": "BASAVARAJ M ", "phone_number": "9844272856", "email_verified": true, "phone_verified": false, "language_preference": "en"}', NULL, '2025-09-26 11:31:20.230102+00', '2025-09-26 11:31:20.272872+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d', 'authenticated', 'authenticated', '9019408738@fala.com', '$2a$10$XSOnWbwKAIgFpoQ4tBIRjejNTTvAYVnURd65khDe93b4gvqlUtb0a', '2025-10-04 07:13:57.902788+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-10-04 07:13:57.91862+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d", "role": "FARMER", "email": "9019408738@fala.com", "state": "karnataka", "farm_id": "KADHGM0009", "village": "gamangatti", "district": "dharwad", "last_name": "m", "first_name": "Kalmesh", "phone_number": "9019408738", "email_verified": true, "phone_verified": false, "language_preference": "en"}', NULL, '2025-10-04 07:13:57.802765+00', '2025-10-06 14:33:57.973786+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('186fbbe0-d1b8-4c8a-babd-965259d96c0d', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', '{"sub": "186fbbe0-d1b8-4c8a-babd-965259d96c0d", "role": "FARMER", "email": "8553912905@fala.com", "state": "karnataka", "farm_id": "KADHGM0001", "village": "gamangatti", "district": "dharwad", "last_name": "Hulabutti", "first_name": "Vinayak", "phone_number": "8553912905", "email_verified": false, "phone_verified": false, "language_preference": "kn"}', 'email', '2025-09-15 19:00:34.814818+00', '2025-09-15 19:00:34.814872+00', '2025-09-15 19:00:34.814872+00', 'c5148e56-4810-4dc7-bd27-70f96443f53d'),
	('feb42252-04aa-4c5f-97e9-ce24cd373f24', 'feb42252-04aa-4c5f-97e9-ce24cd373f24', '{"sub": "feb42252-04aa-4c5f-97e9-ce24cd373f24", "role": "FARMER", "email": "9060027938@fala.com", "state": "karnataka", "farm_id": "KADHGM0002", "village": "gamangatti", "district": "dharwad", "last_name": "ಗಂಜಿಗಟ್ಟಿ", "first_name": "ಮಹಾದೇವಪ್ಪ", "phone_number": "9060027938", "email_verified": false, "phone_verified": false, "language_preference": "kn"}', 'email', '2025-09-16 09:54:55.54578+00', '2025-09-16 09:54:55.545833+00', '2025-09-16 09:54:55.545833+00', '507ecad6-5c00-4012-9c9e-0a4b92da7861'),
	('68c421e8-bbcd-430b-9a2f-192703a7de5b', '68c421e8-bbcd-430b-9a2f-192703a7de5b', '{"sub": "68c421e8-bbcd-430b-9a2f-192703a7de5b", "role": "FARMER", "email": "9353955121@fala.com", "state": "karnataka", "farm_id": "KADHGM0003", "village": "gamangatti", "district": "dharwad", "last_name": "Kanakur", "first_name": "Darshan", "phone_number": "9353955121", "email_verified": false, "phone_verified": false, "language_preference": "kn"}', 'email', '2025-09-18 05:38:16.973667+00', '2025-09-18 05:38:16.97374+00', '2025-09-18 05:38:16.97374+00', '6b3db871-3c45-4c07-9f37-2c496cb71dfc'),
	('511ab144-08b2-49c5-b690-76725353f530', '511ab144-08b2-49c5-b690-76725353f530', '{"sub": "511ab144-08b2-49c5-b690-76725353f530", "role": "FARMER", "email": "7204839275@fala.com", "state": "karnataka", "farm_id": "KADHGM0004", "village": "gamangatti", "district": "dharwad", "last_name": "M Akki", "first_name": "Megha", "phone_number": "7204839275", "email_verified": false, "phone_verified": false, "language_preference": "en"}', 'email', '2025-09-20 08:29:22.021279+00', '2025-09-20 08:29:22.021346+00', '2025-09-20 08:29:22.021346+00', '0a2a14f7-8255-48a9-bbee-b19670d32178'),
	('fff2de1b-a803-4410-b240-c406e0e9f98a', 'fff2de1b-a803-4410-b240-c406e0e9f98a', '{"sub": "fff2de1b-a803-4410-b240-c406e0e9f98a", "role": "FARMER", "email": "9008004824@fala.com", "state": "karnataka", "farm_id": "KADHGM0005", "village": "gamangatti", "district": "dharwad", "last_name": "HONNALLI", "first_name": "PARAMESH", "phone_number": "9008004824", "email_verified": false, "phone_verified": false, "language_preference": "kn"}', 'email', '2025-09-26 10:01:43.866375+00', '2025-09-26 10:01:43.86643+00', '2025-09-26 10:01:43.86643+00', '9ad8a1bf-ae9a-40b7-a309-13ee172d3a6f'),
	('ef919117-d69c-40b5-936a-7a995c5c1f33', 'ef919117-d69c-40b5-936a-7a995c5c1f33', '{"sub": "ef919117-d69c-40b5-936a-7a995c5c1f33", "role": "FARMER", "email": "9964404934@fala.com", "state": "karnataka", "farm_id": "KADHGM0006", "village": "gamangatti", "district": "dharwad", "last_name": "Nadaf ", "first_name": "Makamsab,k,nadaf", "phone_number": "9964404934", "email_verified": false, "phone_verified": false, "language_preference": "kn"}', 'email', '2025-09-26 10:13:20.103588+00', '2025-09-26 10:13:20.103642+00', '2025-09-26 10:13:20.103642+00', 'e1196174-46e3-4928-b797-f3cc689c8759'),
	('f7342022-7711-49cc-9e69-71d751bcc8f0', 'f7342022-7711-49cc-9e69-71d751bcc8f0', '{"sub": "f7342022-7711-49cc-9e69-71d751bcc8f0", "role": "FARMER", "email": "8277193858@fala.com", "state": "karnataka", "farm_id": "KADHGM0007", "village": "gamangatti", "district": "dharwad", "last_name": "maniyar", "first_name": "allavuddeen ", "phone_number": "8277193858", "email_verified": false, "phone_verified": false, "language_preference": "en"}', 'email', '2025-09-26 10:37:30.333336+00', '2025-09-26 10:37:30.3334+00', '2025-09-26 10:37:30.3334+00', '1791f8aa-088e-4054-a832-dd925a63d749'),
	('46e1e353-69ab-472d-b9cd-6c7ee2c7bed9', '46e1e353-69ab-472d-b9cd-6c7ee2c7bed9', '{"sub": "46e1e353-69ab-472d-b9cd-6c7ee2c7bed9", "role": "FARMER", "email": "9844272856@fala.com", "state": "karnataka", "farm_id": "KADHGM0008", "village": "gamangatti", "district": "dharwad", "last_name": "NAIKAR", "first_name": "BASAVARAJ M ", "phone_number": "9844272856", "email_verified": false, "phone_verified": false, "language_preference": "en"}', 'email', '2025-09-26 11:31:20.250299+00', '2025-09-26 11:31:20.250346+00', '2025-09-26 11:31:20.250346+00', 'ce8d0e2a-f931-47b3-bd86-bd0f27d8c664'),
	('59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d', '59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d', '{"sub": "59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d", "role": "FARMER", "email": "9019408738@fala.com", "state": "karnataka", "farm_id": "KADHGM0009", "village": "gamangatti", "district": "dharwad", "last_name": "m", "first_name": "Kalmesh", "phone_number": "9019408738", "email_verified": false, "phone_verified": false, "language_preference": "en"}', 'email', '2025-10-04 07:13:57.880035+00', '2025-10-04 07:13:57.880799+00', '2025-10-04 07:13:57.880799+00', '0dff5f2c-6988-4e75-ae1d-283346c9c549');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('cb8eaf65-50b2-4666-9030-399315c6deec', 'feb42252-04aa-4c5f-97e9-ce24cd373f24', '2025-09-16 09:54:55.606206+00', '2025-09-17 06:56:16.985534+00', NULL, 'aal1', NULL, '2025-09-17 06:56:16.984234', 'Next.js Middleware', '13.233.120.33', NULL),
	('36f00d8a-6f43-421e-ad15-61ea2ed259ce', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', '2025-09-29 07:54:59.943451+00', '2025-09-29 16:11:39.213203+00', NULL, 'aal1', NULL, '2025-09-29 16:11:39.213125', 'Next.js Middleware', '3.110.214.67', NULL),
	('16ac1fcc-6fe7-4e16-8100-e89c62c78a0b', '68c421e8-bbcd-430b-9a2f-192703a7de5b', '2025-09-18 05:38:17.036779+00', '2025-09-18 05:38:17.036779+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36', '157.50.173.90', NULL),
	('78c07667-5cab-482f-ae32-ac7177bb5653', 'ef919117-d69c-40b5-936a-7a995c5c1f33', '2025-09-26 10:13:20.116312+00', '2025-10-01 06:02:39.128869+00', NULL, 'aal1', NULL, '2025-10-01 06:02:39.128796', 'Next.js Middleware', '13.201.77.11', NULL),
	('989a71a4-167f-45cf-89b4-143c4db5e124', '511ab144-08b2-49c5-b690-76725353f530', '2025-09-20 08:29:22.039914+00', '2025-09-20 08:29:22.039914+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36', '27.61.46.0', NULL),
	('ef491b52-b5d5-4d31-b596-339a166eb0cc', '46e1e353-69ab-472d-b9cd-6c7ee2c7bed9', '2025-09-26 11:31:20.266106+00', '2025-09-26 11:31:20.266106+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', '157.45.216.238', NULL),
	('3d7dbc50-3082-4282-901d-9ad7767f6bef', 'fff2de1b-a803-4410-b240-c406e0e9f98a', '2025-09-26 10:14:09.78463+00', '2025-09-26 11:43:59.014017+00', NULL, 'aal1', NULL, '2025-09-26 11:43:59.013931', 'Next.js Middleware', '13.232.84.253', NULL),
	('97127195-f3e2-41bc-8855-1907bb1899e1', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', '2025-09-26 10:14:00.884879+00', '2025-10-04 12:20:25.58854+00', NULL, 'aal1', NULL, '2025-10-04 12:20:25.588465', 'Next.js Middleware', '13.235.50.26', NULL),
	('05f707f0-e578-44e3-b6f6-95e91a63f819', 'f7342022-7711-49cc-9e69-71d751bcc8f0', '2025-09-26 10:37:30.364135+00', '2025-10-04 14:31:51.719242+00', NULL, 'aal1', NULL, '2025-10-04 14:31:51.719171', 'Next.js Middleware', '43.204.116.11', NULL),
	('372c1636-49c8-48b4-abb5-3d2244680bca', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', '2025-10-03 09:49:55.49777+00', '2025-10-04 17:06:49.843038+00', NULL, 'aal1', NULL, '2025-10-04 17:06:49.842962', 'Next.js Middleware', '15.206.202.217', NULL),
	('e8858dd1-5e02-4d0c-b952-fcb2a48253cd', '59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d', '2025-10-04 07:13:57.918733+00', '2025-10-07 13:32:24.444315+00', NULL, 'aal1', NULL, '2025-10-07 13:32:24.441948', 'Next.js Middleware', '13.232.79.218', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('cb8eaf65-50b2-4666-9030-399315c6deec', '2025-09-16 09:54:55.662332+00', '2025-09-16 09:54:55.662332+00', 'password', '6647bb6f-6ea1-47f8-8250-01b92bdb9ec7'),
	('16ac1fcc-6fe7-4e16-8100-e89c62c78a0b', '2025-09-18 05:38:17.090942+00', '2025-09-18 05:38:17.090942+00', 'password', 'd0f437ba-c161-4642-9357-20a0e17dc9ca'),
	('989a71a4-167f-45cf-89b4-143c4db5e124', '2025-09-20 08:29:22.043128+00', '2025-09-20 08:29:22.043128+00', 'password', '70b630e5-b5ce-489f-bfa2-e55f7f446c1c'),
	('78c07667-5cab-482f-ae32-ac7177bb5653', '2025-09-26 10:13:20.122179+00', '2025-09-26 10:13:20.122179+00', 'password', '4652d3b4-b435-4878-847c-e2005088cd96'),
	('97127195-f3e2-41bc-8855-1907bb1899e1', '2025-09-26 10:14:00.895724+00', '2025-09-26 10:14:00.895724+00', 'password', '16ed91f1-5361-486c-90bc-bee3e747da5e'),
	('3d7dbc50-3082-4282-901d-9ad7767f6bef', '2025-09-26 10:14:09.788618+00', '2025-09-26 10:14:09.788618+00', 'password', '1f831f1e-f9ff-43bb-84a7-0d89fe1a7730'),
	('05f707f0-e578-44e3-b6f6-95e91a63f819', '2025-09-26 10:37:30.382249+00', '2025-09-26 10:37:30.382249+00', 'password', 'c67bbbd5-ab15-4558-b794-70ecabe7a3e4'),
	('ef491b52-b5d5-4d31-b596-339a166eb0cc', '2025-09-26 11:31:20.273319+00', '2025-09-26 11:31:20.273319+00', 'password', '06cc5bb5-27ab-4fdb-b25c-869eca26b9d5'),
	('36f00d8a-6f43-421e-ad15-61ea2ed259ce', '2025-09-29 07:54:59.954031+00', '2025-09-29 07:54:59.954031+00', 'password', '9aaba4fa-6069-4e2a-9524-ffd474e77c6e'),
	('372c1636-49c8-48b4-abb5-3d2244680bca', '2025-10-03 09:49:56.385855+00', '2025-10-03 09:49:56.385855+00', 'password', 'a38174e0-ecb8-4d25-9e17-b9911eba2d60'),
	('e8858dd1-5e02-4d0c-b952-fcb2a48253cd', '2025-10-04 07:13:57.958488+00', '2025-10-04 07:13:57.958488+00', 'password', 'e8446d4c-c321-4401-b427-834cef38ba40');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 6, 'xp5ikxewjqa6', 'feb42252-04aa-4c5f-97e9-ce24cd373f24', true, '2025-09-16 09:54:55.631449+00', '2025-09-16 13:07:25.55772+00', NULL, 'cb8eaf65-50b2-4666-9030-399315c6deec'),
	('00000000-0000-0000-0000-000000000000', 7, '5uojphr6vz36', 'feb42252-04aa-4c5f-97e9-ce24cd373f24', false, '2025-09-16 13:07:25.573284+00', '2025-09-16 13:07:25.573284+00', 'xp5ikxewjqa6', 'cb8eaf65-50b2-4666-9030-399315c6deec'),
	('00000000-0000-0000-0000-000000000000', 11, 'lnwenkxk734j', '68c421e8-bbcd-430b-9a2f-192703a7de5b', false, '2025-09-18 05:38:17.059988+00', '2025-09-18 05:38:17.059988+00', NULL, '16ac1fcc-6fe7-4e16-8100-e89c62c78a0b'),
	('00000000-0000-0000-0000-000000000000', 16, 'rxwdk4mver5k', '511ab144-08b2-49c5-b690-76725353f530', false, '2025-09-20 08:29:22.041253+00', '2025-09-20 08:29:22.041253+00', NULL, '989a71a4-167f-45cf-89b4-143c4db5e124'),
	('00000000-0000-0000-0000-000000000000', 22, 'biytmxdem4pu', 'fff2de1b-a803-4410-b240-c406e0e9f98a', true, '2025-09-26 10:14:09.786051+00', '2025-09-26 11:22:39.712394+00', NULL, '3d7dbc50-3082-4282-901d-9ad7767f6bef'),
	('00000000-0000-0000-0000-000000000000', 24, 'zby6snduhcrj', 'fff2de1b-a803-4410-b240-c406e0e9f98a', false, '2025-09-26 11:22:39.732821+00', '2025-09-26 11:22:39.732821+00', 'biytmxdem4pu', '3d7dbc50-3082-4282-901d-9ad7767f6bef'),
	('00000000-0000-0000-0000-000000000000', 25, 'wvvw6kz7ikiw', '46e1e353-69ab-472d-b9cd-6c7ee2c7bed9', false, '2025-09-26 11:31:20.270811+00', '2025-09-26 11:31:20.270811+00', NULL, 'ef491b52-b5d5-4d31-b596-339a166eb0cc'),
	('00000000-0000-0000-0000-000000000000', 21, 'j3kumiythzcp', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', true, '2025-09-26 10:14:00.889457+00', '2025-09-26 11:41:43.635199+00', NULL, '97127195-f3e2-41bc-8855-1907bb1899e1'),
	('00000000-0000-0000-0000-000000000000', 23, 'pjvnbmthvucj', 'f7342022-7711-49cc-9e69-71d751bcc8f0', true, '2025-09-26 10:37:30.371002+00', '2025-09-26 14:12:08.848082+00', NULL, '05f707f0-e578-44e3-b6f6-95e91a63f819'),
	('00000000-0000-0000-0000-000000000000', 20, 'jhexyzvxhatg', 'ef919117-d69c-40b5-936a-7a995c5c1f33', true, '2025-09-26 10:13:20.118232+00', '2025-09-27 16:48:07.57668+00', NULL, '78c07667-5cab-482f-ae32-ac7177bb5653'),
	('00000000-0000-0000-0000-000000000000', 28, '5cbcbybka4k4', 'ef919117-d69c-40b5-936a-7a995c5c1f33', false, '2025-09-27 16:48:07.607591+00', '2025-09-27 16:48:07.607591+00', 'jhexyzvxhatg', '78c07667-5cab-482f-ae32-ac7177bb5653'),
	('00000000-0000-0000-0000-000000000000', 27, 'mce2dszogq2c', 'f7342022-7711-49cc-9e69-71d751bcc8f0', true, '2025-09-26 14:12:08.866572+00', '2025-09-27 17:21:47.509782+00', 'pjvnbmthvucj', '05f707f0-e578-44e3-b6f6-95e91a63f819'),
	('00000000-0000-0000-0000-000000000000', 26, 'hnktaawfvh4t', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', true, '2025-09-26 11:41:43.637256+00', '2025-09-29 07:54:47.362369+00', 'j3kumiythzcp', '97127195-f3e2-41bc-8855-1907bb1899e1'),
	('00000000-0000-0000-0000-000000000000', 31, 'knjv4jksd6lt', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', true, '2025-09-29 07:54:59.950093+00', '2025-09-29 14:13:51.75116+00', NULL, '36f00d8a-6f43-421e-ad15-61ea2ed259ce'),
	('00000000-0000-0000-0000-000000000000', 32, 'e6tkz4x2qgkt', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', true, '2025-09-29 14:13:51.778323+00', '2025-09-29 15:36:59.119317+00', 'knjv4jksd6lt', '36f00d8a-6f43-421e-ad15-61ea2ed259ce'),
	('00000000-0000-0000-0000-000000000000', 33, 'ui4nv4hdqt32', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', false, '2025-09-29 15:36:59.135489+00', '2025-09-29 15:36:59.135489+00', 'e6tkz4x2qgkt', '36f00d8a-6f43-421e-ad15-61ea2ed259ce'),
	('00000000-0000-0000-0000-000000000000', 30, 'ncduhdccrwdk', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', true, '2025-09-29 07:54:47.372625+00', '2025-09-30 05:58:45.970222+00', 'hnktaawfvh4t', '97127195-f3e2-41bc-8855-1907bb1899e1'),
	('00000000-0000-0000-0000-000000000000', 34, 'giy72n24l2km', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', true, '2025-09-30 05:58:45.997953+00', '2025-10-01 08:33:49.567148+00', 'ncduhdccrwdk', '97127195-f3e2-41bc-8855-1907bb1899e1'),
	('00000000-0000-0000-0000-000000000000', 35, 'brmpq377kaof', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', true, '2025-10-01 08:33:49.58618+00', '2025-10-01 10:30:20.377964+00', 'giy72n24l2km', '97127195-f3e2-41bc-8855-1907bb1899e1'),
	('00000000-0000-0000-0000-000000000000', 37, 'fzdzfradjgre', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', true, '2025-10-03 09:49:55.77239+00', '2025-10-03 13:34:06.711087+00', NULL, '372c1636-49c8-48b4-abb5-3d2244680bca'),
	('00000000-0000-0000-0000-000000000000', 36, '327tubmejirc', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', true, '2025-10-01 10:30:20.402462+00', '2025-10-04 10:10:20.040998+00', 'brmpq377kaof', '97127195-f3e2-41bc-8855-1907bb1899e1'),
	('00000000-0000-0000-0000-000000000000', 40, 'g2ncyfnzdl7a', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', false, '2025-10-04 10:10:20.066483+00', '2025-10-04 10:10:20.066483+00', '327tubmejirc', '97127195-f3e2-41bc-8855-1907bb1899e1'),
	('00000000-0000-0000-0000-000000000000', 38, 'aecihzml63dh', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', true, '2025-10-03 13:34:06.723333+00', '2025-10-04 12:15:05.680178+00', 'fzdzfradjgre', '372c1636-49c8-48b4-abb5-3d2244680bca'),
	('00000000-0000-0000-0000-000000000000', 29, '2kbncxdl77wh', 'f7342022-7711-49cc-9e69-71d751bcc8f0', true, '2025-09-27 17:21:47.51783+00', '2025-10-04 14:31:51.036233+00', 'mce2dszogq2c', '05f707f0-e578-44e3-b6f6-95e91a63f819'),
	('00000000-0000-0000-0000-000000000000', 42, 'xu7njidvhmmg', 'f7342022-7711-49cc-9e69-71d751bcc8f0', false, '2025-10-04 14:31:51.05408+00', '2025-10-04 14:31:51.05408+00', '2kbncxdl77wh', '05f707f0-e578-44e3-b6f6-95e91a63f819'),
	('00000000-0000-0000-0000-000000000000', 39, 'gw2epju7vmmt', '59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d', true, '2025-10-04 07:13:57.936248+00', '2025-10-04 14:47:47.355359+00', NULL, 'e8858dd1-5e02-4d0c-b952-fcb2a48253cd'),
	('00000000-0000-0000-0000-000000000000', 41, 'btflrjh74fzu', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', true, '2025-10-04 12:15:05.70934+00', '2025-10-04 17:05:07.179032+00', 'aecihzml63dh', '372c1636-49c8-48b4-abb5-3d2244680bca'),
	('00000000-0000-0000-0000-000000000000', 44, 'spsb7jp5qjk5', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', false, '2025-10-04 17:05:07.193533+00', '2025-10-04 17:05:07.193533+00', 'btflrjh74fzu', '372c1636-49c8-48b4-abb5-3d2244680bca'),
	('00000000-0000-0000-0000-000000000000', 43, 'tcpjv7po5jou', '59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d', true, '2025-10-04 14:47:47.365921+00', '2025-10-06 14:33:57.928742+00', 'gw2epju7vmmt', 'e8858dd1-5e02-4d0c-b952-fcb2a48253cd'),
	('00000000-0000-0000-0000-000000000000', 45, 'u67aymvsz2kq', '59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d', false, '2025-10-06 14:33:57.959064+00', '2025-10-06 14:33:57.959064+00', 'tcpjv7po5jou', 'e8858dd1-5e02-4d0c-b952-fcb2a48253cd');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: user_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_profile" ("id", "title", "first_name", "last_name", "mobile_number", "email", "is_verified", "is_active", "language_preference", "role", "created_at", "updated_at", "first_name_kn", "last_name_kn", "first_name_en", "last_name_en", "primary_name_language", "state", "district", "village", "farm_id") VALUES
	('feb42252-04aa-4c5f-97e9-ce24cd373f24', NULL, 'ಮಹಾದೇವಪ್ಪ', 'ಗಂಜಿಗಟ್ಟಿ', '9060027938', NULL, false, true, 'kn', 'FARMER', '2025-09-16 09:54:55.456717+00', '2025-09-16 09:54:55.456717+00', 'ಮಹಾದೇವಪ್ಪ', 'ಗಂಜಿಗಟ್ಟಿ', NULL, NULL, 'kn', 'karnataka', 'dharwad', 'gamangatti', 'KADHGM0002'),
	('68c421e8-bbcd-430b-9a2f-192703a7de5b', NULL, 'Darshan', 'Kanakur', '9353955121', NULL, false, true, 'kn', 'FARMER', '2025-09-18 05:38:16.875043+00', '2025-09-18 05:38:16.875043+00', NULL, NULL, 'Darshan', 'Kanakur', 'en', 'karnataka', 'dharwad', 'gamangatti', 'KADHGM0003'),
	('ef919117-d69c-40b5-936a-7a995c5c1f33', NULL, 'Makamsab,k,nadaf', 'Nadaf', '9964404934', NULL, false, true, 'kn', 'FARMER', '2025-09-26 10:13:20.084743+00', '2025-09-26 10:13:20.084743+00', NULL, NULL, 'Makamsab,k,nadaf', 'Nadaf', 'en', 'karnataka', 'dharwad', 'gamangatti', 'KADHGM0006'),
	('f7342022-7711-49cc-9e69-71d751bcc8f0', NULL, 'allavuddeen', 'maniyar', '8277193858', NULL, false, true, 'en', 'FARMER', '2025-09-26 10:37:30.288478+00', '2025-09-26 10:37:30.288478+00', NULL, NULL, 'allavuddeen', 'maniyar', 'en', 'karnataka', 'dharwad', 'gamangatti', 'KADHGM0007'),
	('46e1e353-69ab-472d-b9cd-6c7ee2c7bed9', NULL, 'BASAVARAJ M', 'NAIKAR', '9844272856', NULL, false, true, 'en', 'FARMER', '2025-09-26 11:31:20.22976+00', '2025-09-26 11:31:20.22976+00', NULL, NULL, 'BASAVARAJ M', 'NAIKAR', 'en', 'karnataka', 'dharwad', 'gamangatti', 'KADHGM0008'),
	('186fbbe0-d1b8-4c8a-babd-965259d96c0d', NULL, 'Vinayak', 'Hulabutti', '8553912905', NULL, false, true, 'kn', 'ADMIN', '2025-09-15 19:00:34.804986+00', '2025-09-29 07:54:27.718126+00', NULL, NULL, 'Vinayak', 'Hulabutti', 'en', 'karnataka', 'dharwad', 'gamangatti', 'KADHGM0001'),
	('511ab144-08b2-49c5-b690-76725353f530', NULL, 'Megha', 'M Akki', '7204839275', NULL, false, true, 'en', 'ADMIN', '2025-09-20 08:29:21.9905+00', '2025-10-03 09:53:16.391324+00', NULL, NULL, 'Megha', 'M Akki', 'en', 'karnataka', 'dharwad', 'gamangatti', 'KADHGM0004'),
	('fff2de1b-a803-4410-b240-c406e0e9f98a', NULL, 'PARAMESH', 'HONNALLI', '9008004824', NULL, false, true, 'kn', 'ADMIN', '2025-09-26 10:01:43.835809+00', '2025-10-03 09:53:41.643773+00', NULL, NULL, 'PARAMESH', 'HONNALLI', 'en', 'karnataka', 'dharwad', 'gamangatti', 'KADHGM0005'),
	('59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d', NULL, 'Kalmesh', 'm', '9019408738', NULL, false, true, 'en', 'FARMER', '2025-10-04 07:13:57.801734+00', '2025-10-04 07:13:57.801734+00', NULL, NULL, 'Kalmesh', 'm', 'en', 'karnataka', 'dharwad', 'gamangatti', 'KADHGM0009');


--
-- Data for Name: farm; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."farm" ("farm_id", "farmer_id", "farm_name", "state", "district", "village", "farm_size_acres", "created_at", "updated_at") VALUES
	('KADHGM0001', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', 'My Farm', 'karnataka', 'dharwad', 'gamangatti', 0.00, '2025-09-15 19:00:34.804986+00', '2025-09-15 19:00:34.804986+00'),
	('KADHGM0002', 'feb42252-04aa-4c5f-97e9-ce24cd373f24', 'My Farm', 'karnataka', 'dharwad', 'gamangatti', 0.00, '2025-09-16 09:54:55.456717+00', '2025-09-16 09:54:55.456717+00'),
	('KADHGM0003', '68c421e8-bbcd-430b-9a2f-192703a7de5b', 'My Farm', 'karnataka', 'dharwad', 'gamangatti', 0.00, '2025-09-18 05:38:16.875043+00', '2025-09-18 05:38:16.875043+00'),
	('KADHGM0004', '511ab144-08b2-49c5-b690-76725353f530', 'My Farm', 'karnataka', 'dharwad', 'gamangatti', 0.00, '2025-09-20 08:29:21.9905+00', '2025-09-20 08:29:21.9905+00'),
	('KADHGM0005', 'fff2de1b-a803-4410-b240-c406e0e9f98a', 'My Farm', 'karnataka', 'dharwad', 'gamangatti', 0.00, '2025-09-26 10:01:43.835809+00', '2025-09-26 10:01:43.835809+00'),
	('KADHGM0006', 'ef919117-d69c-40b5-936a-7a995c5c1f33', 'My Farm', 'karnataka', 'dharwad', 'gamangatti', 0.00, '2025-09-26 10:13:20.084743+00', '2025-09-26 10:13:20.084743+00'),
	('KADHGM0007', 'f7342022-7711-49cc-9e69-71d751bcc8f0', 'My Farm', 'karnataka', 'dharwad', 'gamangatti', 0.00, '2025-09-26 10:37:30.288478+00', '2025-09-26 10:37:30.288478+00'),
	('KADHGM0008', '46e1e353-69ab-472d-b9cd-6c7ee2c7bed9', 'My Farm', 'karnataka', 'dharwad', 'gamangatti', 0.00, '2025-09-26 11:31:20.22976+00', '2025-09-26 11:31:20.22976+00'),
	('KADHGM0009', '59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d', 'My Farm', 'karnataka', 'dharwad', 'gamangatti', 0.00, '2025-10-04 07:13:57.801734+00', '2025-10-04 07:13:57.801734+00');


--
-- Data for Name: farmer_inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."farmer_inventory" ("id", "farmer_id", "crop_name", "number_of_guntas", "seed_sowed_date", "harvest_available_date", "total_expected_quantity", "is_available", "is_deleted", "deleted_at", "deleted_by", "created_at", "updated_at", "crop_location", "crop_imageurl") VALUES
	('5040c15f-ca60-4d51-b504-7958fba9d6dc', 'feb42252-04aa-4c5f-97e9-ce24cd373f24', 'Spinach', 3, '2025-09-04', '2025-10-02', 240, true, false, NULL, NULL, '2025-09-16 09:56:57.731+00', '2025-09-16 09:56:57.784641+00', NULL, NULL),
	('01ef28c4-3aad-411d-9025-fef41660178e', 'feb42252-04aa-4c5f-97e9-ce24cd373f24', 'Spring Onion', 4, '2025-08-01', '2025-08-29', 400, true, false, NULL, NULL, '2025-09-16 09:59:56.377+00', '2025-09-16 09:59:56.458042+00', NULL, NULL),
	('c22fb2c0-98d2-4660-b923-0acf8f216aa3', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', 'Mint', 1, '2025-09-08', '2025-10-06', 120, true, true, '2025-09-16 19:42:51.419858+00', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', '2025-09-15 19:02:16.033+00', '2025-09-16 19:42:51.419858+00', NULL, NULL),
	('5baab7c1-bd74-4a26-8e6a-425cf4eb35f1', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', 'Spinach', 2, '2025-09-18', '2025-10-16', 160, true, false, NULL, NULL, '2025-09-17 19:35:33.618+00', '2025-09-17 19:35:33.718355+00', NULL, NULL),
	('addf3d22-b3a9-4a77-9c9d-05420e44f7d3', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', 'Spinach', 1, '2025-09-01', '2025-09-29', 80, true, true, '2025-09-17 19:35:50.524225+00', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', '2025-09-15 19:01:57.522+00', '2025-09-17 19:35:50.524225+00', NULL, NULL),
	('502bc807-3e7b-4274-a7f3-e4dffabb4af4', '68c421e8-bbcd-430b-9a2f-192703a7de5b', 'Spinach', 6, '2025-09-13', '2025-10-11', 480, true, true, '2025-09-18 05:46:50.153825+00', '68c421e8-bbcd-430b-9a2f-192703a7de5b', '2025-09-18 05:43:11.812+00', '2025-09-18 05:46:50.153825+00', NULL, NULL),
	('7bea9a73-ece6-462d-95df-e79737c785db', 'fff2de1b-a803-4410-b240-c406e0e9f98a', 'Mint', 5, '2025-08-03', '2025-08-31', 600, true, false, NULL, NULL, '2025-09-26 10:02:29.498+00', '2025-09-26 10:02:29.579936+00', NULL, NULL),
	('4343b409-673c-447d-8275-de1b99db4e22', 'fff2de1b-a803-4410-b240-c406e0e9f98a', 'Spinach', 5, '2025-08-31', '2025-09-28', 400, true, false, NULL, NULL, '2025-09-26 10:03:24.722+00', '2025-09-26 10:03:24.792427+00', NULL, NULL),
	('dada4562-2211-40e6-9b0c-f752718eb427', 'fff2de1b-a803-4410-b240-c406e0e9f98a', 'Coriander', 5, '2025-08-31', '2025-09-28', 500, true, false, NULL, NULL, '2025-09-26 10:03:48.332+00', '2025-09-26 10:03:48.360477+00', NULL, NULL),
	('9ff34257-e93d-4898-b97c-8b1c7fed50eb', 'fff2de1b-a803-4410-b240-c406e0e9f98a', 'Spring Onion', 5, '2025-08-31', '2025-09-28', 500, true, false, NULL, NULL, '2025-09-26 10:04:06.982+00', '2025-09-26 10:04:07.248316+00', NULL, NULL),
	('dab30b06-8937-460b-904e-f60a062a40c4', 'ef919117-d69c-40b5-936a-7a995c5c1f33', 'Spinach', 2, '2025-09-15', '2025-10-13', 160, true, false, NULL, NULL, '2025-09-26 10:16:30.028+00', '2025-09-26 10:16:30.121266+00', NULL, NULL),
	('631ead58-cdbd-40f4-94b6-839b3ebf4826', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', 'Spinach', 2, '2025-09-16', '2025-10-14', 160, true, false, NULL, NULL, '2025-09-26 10:16:33.546+00', '2025-09-26 10:16:33.607397+00', NULL, NULL),
	('5d7f134c-c119-4c98-9b6b-840f0ce01db7', 'ef919117-d69c-40b5-936a-7a995c5c1f33', 'Coriander', 4, '2025-09-15', '2025-10-13', 400, true, false, NULL, NULL, '2025-09-26 10:21:16.034+00', '2025-09-26 10:21:16.072844+00', NULL, NULL),
	('0cf49013-057d-4042-afe6-f096de13fcf3', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', 'Coriander', 1, '2025-09-25', '2025-10-23', 100, true, false, NULL, NULL, '2025-09-26 10:21:53.002+00', '2025-09-26 10:21:53.046747+00', NULL, NULL),
	('c860ea10-1201-4bf3-96dc-79c70913d5f4', 'f7342022-7711-49cc-9e69-71d751bcc8f0', 'Mint', 60, '2025-07-01', '2025-07-29', 7200, true, false, NULL, NULL, '2025-09-26 10:40:36.971+00', '2025-09-26 10:40:37.062607+00', NULL, NULL),
	('4ef40ca8-17b2-43f9-89e0-e4d89e9de4c3', '186fbbe0-d1b8-4c8a-babd-965259d96c0d', 'Spinach', 1, '2025-09-05', '2025-10-03', 80, true, false, NULL, NULL, '2025-10-04 05:32:50.055+00', '2025-10-04 05:32:50.149787+00', NULL, NULL),
	('7e473e7e-d87b-4981-b40c-f35f50bddce1', '59040fc7-0ff7-4f7b-aef0-b44cfc2b5b6d', 'Spinach', 2, '2025-09-10', '2025-10-08', 160, true, false, NULL, NULL, '2025-10-04 07:16:00.151+00', '2025-10-04 07:16:00.241642+00', NULL, NULL);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 45, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
