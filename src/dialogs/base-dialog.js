'use strict';
const Builder = require('botbuilder');

const { Logger, Messages } = require('../shared/const');

class HelloWorldDialog {
    constructor() { Logger.info('Created Instance of HelloWorldDialog'); }
    getName() { return 'UserInputDialog'; } // Needs to be unique otherwise an error occurs during registration

    askUserForName(session, args) {
        //TODO: Session contain context information based on the channel and the user

        Builder.Prompts.text(session, Messages.AskForName); // The result of this input will be forwarded to the next step
    }

    greetUser(session, result) {
        session.send(Messages.PersonalGreeting.replace('%s', result.response)).endDialog();
    }
}

module.exports = new HelloWorldDialog();