'use strict';
const Fs = require('fs');
const Path = require('path');

const { Logger } = require('../shared/Const')

const FILENAME = 'db.json';

function resolveKey(ctx) {
    return `${ctx.address.channelId}.${ctx.conversationId}`
}

/**
 * Simplistic Implementation of an json file based storage solution. All the data will be stored to json.
 */
module.exports = class JsonStorage {
    constructor() {
        Logger.info('Created JsonStorage instance');
        this.initialize();
    }
    initialize() {
        if (Fs.existsSync(Path.join(__dirname, FILENAME))) {
            Logger.info('File is present');
        } else {
            Logger.info('File is not yet present, creating it now...');
            Fs.openSync(Path.join(__dirname, FILENAME), 'w');
            Fs.writeFile(Path.join(__dirname, FILENAME), JSON.stringify({}), () => { });
        }
        this.current = null;
    }
    // Based on API you have to implement this method
    getData(ctx, cb) {
        if (this.current) {
            cb(null, this.current[resolveKey(ctx)] || {})
        } else {
            Fs.readFile(Path.join(__dirname, FILENAME), (err, data) => {
                if (err) { cb(err, null) }
                else {
                    this.current = JSON.parse(data);
                    cb(null, this.current[resolveKey(ctx)] || {})
                }
            });
        }
    }
    // Based on API you have to implement this method
    saveData(ctx, data, cb) {
        if (ctx.persistConversationData) {
            this.current[resolveKey(ctx)] = data;
            Fs.writeFile(Path.join(__dirname, FILENAME), JSON.stringify(this.current), cb);
            Logger.info(`Persisting Conversation Data for ${resolveKey(ctx)}`);
        } else {
            Logger.warn('Persting Conversation Data is disabled, dropping data');
            cb();
        }
    }
};