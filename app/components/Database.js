import * as SQLite from 'expo-sqlite';

const database_name = "CotzulBD.db";
const database_version = "1.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

const db = SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size
);

module.exports = db;