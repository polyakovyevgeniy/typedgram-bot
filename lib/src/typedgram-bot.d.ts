/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../definitions/src/node-telegram-bot-api.d.ts" />
import TelegramBot = require('node-telegram-bot-api');
import { Stream } from 'stream';
import Promise = require('bluebird');
/**
 * Server settings.
 */
export interface IServerOptions {
    host: string;
    port: number;
    domain?: string;
    key?: string;
    cert?: string;
}
/**
 * Object with the posible events from Telegram.
 * 'text' not included to prevent command and plain text override.
 *
 * @type Object
 */
export declare const TelegramEvent: {
    sticker: string;
    photo: string;
    audio: string;
    video: string;
    document: string;
    contact: string;
    location: string;
    new_chat_participant: string;
    left_chat_participant: string;
    new_chat_title: string;
    new_chat_photo: string;
    delete_chat_photo: string;
    group_chat_created: string;
};
/**
 * Action function declaration.
 * Make sure to return a bot send operation so you could re-use it.
 *
 * @type (msg: Message) => Promise<Message>
 */
export declare type Action = (msg: Message) => Promise<Message>;
/**
 * Telegram ID type
 *
 * @type number | string
 */
export declare type idType = number | string;
/**
 * Telegram file type
 *
 * @type string | Stream
 */
export declare type fileType = string | Stream;
/**
 * Subclass of TelegramBot provided by node-telegram-bot-api
 */
export declare class TelegramTypedBot extends TelegramBot {
    /**
     * Collection containing every registered command with the respective action.
     */
    commands: {
        [command: string]: Action;
    };
    /**
     * Collection containing every registered event with the respective action.
     * Events like receiving a photo, sticker, etc. See [[TelegramEvent]].
     */
    events: {
        [command: string]: Action;
    };
    /**
     * Collection to store pending responses.
     */
    protected waitingResponse: {
        [ticket: string]: (msg: Message) => void;
    };
    /**
     * Action to be executed when successfully connected to Telegram servers.
     *
     * @type (me: User) => void
     */
    initializationAction: (me: User) => void;
    /**
     * Action to response to a non-registered action.
     *
     * @type Action
     */
    missingAction: Action;
    /**
     * Action to response to plain text messages (without command notation '/').
     *
     * @type Action
     */
    plainTextAction: Action;
    /**
     * Timeout to reject the [[waitResponse] promise, in that case throws a [[Promise.TimeoutError]].
     *
     * @type number
     */
    responseTimeout: number;
    /**
     * Start a bot with a token from Botfather.
     *
     * @param  {string}         token              Telegram Bot API Token
     * @param  {IServerOptions} server             Server configuration to stablish a connection to Telegram servers.
     * @return {[TelegramTypedBot]}                A instance of a bot.
     */
    constructor(token: string, server: IServerOptions);
    protected _request(path: string, qsopt?: IQs): Promise<Message>;
    /**
     * When you send a message, set this on the resolution of the promise to wait for the user response of that message.
     * The response petition is registered to the user and chat id.
     *
     * @param  {Message}   msg Message sent by user, we need this to save the chatId and userId.
     * @param  {number =   this.responseTimeout} timeout Reject this operation after a timeout in milliseconds.
     * @return {Promise<Message>}        A promise with the user write-back message.
     */
    waitResponse(msg: Message, timeout?: number): (msg: Message) => Promise<Message>;
    protected getTicketFromInfo(chatId: idType, fromId: idType): string;
    protected getTicketFromMessage(msg: Message): string;
    protected addToWaiting(ticket: string, resolve: (msg: Message) => void): void;
    protected removeFromWaiting(ticket: string): void;
    protected receivedMessage(event: string, msg: Message): void;
    protected receivedResponseMessage(msg: Message, ticket: string, pendingResolve: (msg: Message) => void): void;
    protected receivedNonResponseMessage(event: string, msg: Message): void;
    protected receivedText(msg: Message): void;
    protected receivedCommand(command: string, msg: Message): void;
    protected receivedPlainText(text: string, msg: Message): void;
    /**
     * Register a command or multiple commands as strings with a '/' prefix.
     * The action will be called when a user uses the command.
     *
     * Example:
     * bot.onCommand('/hello'), msg => { /... });
     *
     * @param  {string | string[]}    commands Commands to register.
     * @param  {Action}    action Must recieve a [[Message]]. This is called when a user uses the command.
     */
    onCommand(commands: string | string[], action: Action): void;
    /**
     * You can manually execute commands registered in [[onCommand]] with a specific message.
     *
     * @param  {string}           command Registered command to call, remember the '/' prefix.
     * @param  {Message}          msg     Message to use in that command.
     * @return {Promise<Message>}         Send operation promise returned by that command. Rejected if the command was not registerd.
     */
    execCommand(command: string, msg: Message): Promise<Message>;
    /**
     * Register a event or multiple events of [[TelegramEvent]].
     *
     * Example:
     * bot.onEvent(TelegramEvent.photo), msg => { /... });
     *
     * @param  {string | string[]}    events Event from [[TelegramEvent]].
     * @param  {Action}    action Action to call when the event is triggered.
     */
    onEvent(events: string | string[], action: Action): void;
    /**
     * You can manually execute events registered in [[onEvent]] with a specific message.
     *
     * @param  {string}           event Registered event to call from [[TelegramEvent]].
     * @param  {Message}          msg   Message to use in that event associated action.
     * @return {Promise<Message>}       Send operation promise returned by that event. Rejected if the event was not registerd.
     */
    execEvent(event: string, msg: Message): Promise<Message>;
    /**
     * Register this action to respond to plain text commands.
     * This is called only if [[waitResponse]] is not active.
     *
     * @param  {Action} action Action to call on plain text.
     */
    onPlainText(action: Action): void;
    /**
     * Register action to respond to non-registered commands.
     * This is optional.
     *
     * @param  {Action} action Action to call on non-registered command request.
     */
    onMissingCommand(action: Action): void;
    /**
     * Execute this when the bot is successfully deployed.
     *
     * @param  {User}   action Bot's User object with his Telegram information.
     */
    onInitialization(action: (me: User) => void): void;
}