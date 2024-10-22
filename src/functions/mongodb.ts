import { Db, MongoClient, ServerApiVersion } from "mongodb";

const MongoDBConfig = {
  serverApi: ServerApiVersion.v1,
};

const mongoDbName: string = process.env.MONGODB_NAME || "";
const mongoDbUrl: string = process.env.MONGODB_URL || "";

if (!mongoDbName || !mongoDbUrl) {
  throw new Error("Incomplete MongoDB Config");
}

let client: MongoClient | null = null;
let db: Db | null = null;

export default async function ConnectToDatabase() {
  if (!client || !db) {
    client = new MongoClient(mongoDbUrl, MongoDBConfig);
    await client.connect();
    db = client.db(process.env.MONGODB_NAME);
  }
  return { client, db };
}