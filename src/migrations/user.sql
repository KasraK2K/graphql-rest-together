--=======================================================================================
--                                                                                                     
--  ##   ##   ####  #####  #####     ####        ######    ###    #####   ##      #####              
--  ##   ##  ##     ##     ##  ##   ##             ##     ## ##   ##  ##  ##      ##                 
--  ##   ##   ###   #####  #####     ###           ##    ##   ##  #####   ##      #####              
--  ##   ##     ##  ##     ##  ##      ##          ##    #######  ##  ##  ##      ##                 
--   #####   ####   #####  ##   ##  ####           ##    ##   ##  #####   ######  #####              
--                                                                                                     
--=======================================================================================


CREATE TABLE IF NOT EXISTS users
(
    id                	SERIAL PRIMARY KEY,
	-- uid					uuid DEFAULT uuid_generate_v4 (),
	
	first_name        	VARCHAR(50)  NOT NULL DEFAULT '',
	surname           	VARCHAR(50)  NOT NULL DEFAULT '',
	contact_number    	VARCHAR(50)  NOT NULL DEFAULT '',
	
    email             	VARCHAR(50)  NOT NULL UNIQUE,
    password          	VARCHAR(200) NOT NULL,
    last_token          VARCHAR(500) NOT NULL DEFAULT '',

    is_active         	BOOLEAN      DEFAULT TRUE,
    is_verify       	BOOLEAN      DEFAULT FALSE,
    is_block        	BOOLEAN      DEFAULT FALSE,
    is_archive        	BOOLEAN      DEFAULT FALSE,
	roles				INTEGER[]	     DEFAULT '{}',

    created_at        	TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        	TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    archived_at       	TIMESTAMPTZ,
    last_login_at       TIMESTAMPTZ
);

-- Create Index
CREATE INDEX "user_uid" ON "users"("uid");
CREATE INDEX "user_email" ON "users"("email");
CREATE INDEX "user_last_token" ON "users"("last_token");
CREATE INDEX "user_is_archive" ON "users"("is_archive");

-- Insert Record
-- Password is 12345678 and hashed by bcryptjs salt 7
INSERT INTO users (email, password) VALUES ('kasra_k2k@yahoo.com', '$2a$07$r66gkFrxBP5L5/XSd4No4eY.Z/UGu.56F/neHhsLjAwydlPvUnocO') RETURNING *;