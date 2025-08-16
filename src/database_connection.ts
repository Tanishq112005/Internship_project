import { Client } from "pg";
import { database_connection_string } from "./keys";
const clinet = new Client({
    connectionString : database_connection_string
})

clinet.connect() ; 

module.exports = {
    clinet
}

