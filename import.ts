'use strict';

import {connect} from "mongoose";

import QuestModel from "./models/QuestModel";
const { readFile } = require('fs');
const path = require('path');

const arg = process.argv[2];

let dbConnectionString = `mongodb+srv://hkuch1:EvbAxRzKr3ot6xkM@cluster0.an0du.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

connect(dbConnectionString, { });

async function importData() {
    readFile(path.join(__dirname, 'questData.json'), async (e: any, d: Buffer) => {
        for (const q of JSON.parse(d.toString())) {
            await QuestModel.create(q);
        }
    });
}

if (arg === '--import') {
    try {
        importData();
        console.log('Inserted');
    } catch (e) {
        console.log(e);
    }

}
