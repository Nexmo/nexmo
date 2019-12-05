import nexmo from "./index";

import Utils from "./Utils";

/**
 * Provides access to the `events` resource.
 */
class Events {
  /**
   * The path to the `events` resource.
   */
  static get PATH() {
    return "/v0.1/conversations/{conversation_uuid}/events";
  }

  /**
   * Creates a new Events instance.
   *
   * @param {Credentials} creds - Credentials used when interacting with the Nexmo API.
   * @param {Object} options - additional options for the class.
   */
  constructor(creds, options) {
    this.creds = creds;
    this.options = options;
  }

  /**
   * Creates an event in a conversation.
   *
   * @param {string} conversationId - The unique identifier for the conversation
   * @param {Object} params - Parameters used when adding an event to the conversation. See https://developer.nexmo.com/api/conversation#createEvent for more information.
   * @param {function} callback - function to be called when the request completes.
   */
  create(conversationId, params, callback) {
    params = JSON.stringify(params);

    var config = {
      host: this.options.host || "api.nexmo.com",
      path: Events.PATH.replace("{conversation_uuid}", conversationId),
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.creds.generateJwt()}`
      }
    };
    this.options.httpClient.request(config, callback);
  }

  /**
   * Get an existing event.
   *
   * @param {string} conversationId - The unique identifier for the conversation
   * @param {string|object} query - The unique identifier for the event to retrieve
   *               or a set of filter parameters for the query. For more information
   *               see https://developer.nexmo.com/api/conversation#getEvents
   * @param {function} callback - function to be called when the request completes.
   */

  get(conversationId, query, callback) {
    var config = {
      host: this.options.host || "api.nexmo.com",
      path: Utils.createPathWithQuery(
        Events.PATH.replace("{conversation_uuid}", conversationId),
        query
      ),
      method: "GET",
      body: undefined,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.creds.generateJwt()}`
      }
    };
    this.options.httpClient.request(config, callback);
  }

  /**
   * Get next page of events for a conversation.
   *
   * @param {object} response - The response from a paginated events list
   *               see https://ea.developer.nexmo.com/api/conversation#getEvents
   * @param {function} callback - function to be called when the request completes.
   */
  next(response, callback) {
    if (response._links.next) {
      const conversationId = response._links.next.href.match(/CON-[^/]*/g);
      this.get(
        conversationId,
        Utils.getQuery(response._links.next.href),
        callback
      );
    } else {
      const error = new Error("The response doesn't have a next page.");
      callback(error, null);
    }
  }

  /**
   * Get previous page of events for a conversation.
   *
   * @param {object} response - The response from a paginated events list
   *               see https://ea.developer.nexmo.com/api/conversation#getEvents
   * @param {function} callback - function to be called when the request completes.
   */
  prev(response, callback) {
    if (response._links.prev) {
      const conversationId = response._links.prev.href.match(/CON-[^/]*/g);
      this.get(
        conversationId,
        Utils.getQuery(response._links.prev.href),
        callback
      );
    } else {
      const error = new Error("The response doesn't have a previous page.");
      callback(error, null);
    }
  }

  /**
   * Deleta an existing event.
   *
   * @param {string} conversationId- The unique identifier for the conversation to delete the event from.
   * @param {string} eventId - The unique identifier for the event to delete.
   * @param {function} callback - function to be called when the request completes.
   */
  delete(conversationId, eventId, callback) {
    var config = {
      host: this.options.host || "api.nexmo.com",
      path: `${Events.PATH.replace(
        "{conversation_uuid}",
        conversationId
      )}/${eventId}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.creds.generateJwt()}`
      }
    };

    this.options.httpClient.request(config, callback);
  }
}

export default Events;
