import { Client } from "pg";
import { database_connection_string } from "./keys";
const clinet = new Client({
    connectionString : database_connection_string
})

export async function connection_to_database() {
    await clinet.connect() ;
}
module.exports = {
    clinet
}

