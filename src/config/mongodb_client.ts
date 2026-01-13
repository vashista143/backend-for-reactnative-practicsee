

import {MongoClient,Db} from "mongodb";


let mongoDb : Db


export async function connectToDatabase(){
    const  url = 'mongodb+srv://vashistadara03_db_user:SPZEYfYMfhY0CwH9@boomboom.h8exlzi.mongodb.net/notedb?retryWrites=true&w=majority';
    const  client = new MongoClient(url);
    mongoDb = client.db("notedb")
    console.log("mongodb connected successfully")
}

export function getDatabase() : Db{
    return mongoDb
}