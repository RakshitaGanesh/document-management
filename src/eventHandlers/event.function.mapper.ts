/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */
import EventHandler from './event.handler';
import Event_5000 from "../eventFunctions/event-5000/Event_5000";
import Event_5001 from "../eventFunctions/event-5001/Event_5001";
const eventFunctionMapper: { [key: string]: typeof EventHandler } = {
    Event_5000: Event_5000,
    Event_5001: Event_5001
};

export default eventFunctionMapper;
