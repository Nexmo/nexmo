"use strict";

import nexmo from "./index";

import Utils from "./Utils";

import Members from "./Members";
import Events from "./Events";

/**
 * Provides access to the `conversations` endpoint.
 */
class Conversations {
  static get PATH() {
    return "/v0.1/conversations";
  }

  static get V1_PATH() {
    return "/v1/conversations";
  }

  /**
   * @param {Credentials} credentials
   *    credentials to be used when interacting with the API.
   * @param {Object} options
   *    Additional Conversations options.
   */
  constructor(credentials, options = {}) {
    this.creds = credentials;
    this.options = options;

    /**
     * @type Members
     */
    this.members = new Members(this.creds, this.options);

    /**
     * @type Events
     */
    this.events = new Events(this.creds, this.options);
  }

  /**
   * Create a new conversation.
   *
   * @param {Object} params - Parameters used when creating the conversation. See https://ea.developer.nexmo.com/api/conversation#create-a-conversation for more information.
   * @param {function} callback - function to be called when the request completes.
   */
  create(params, callback) {
    params = JSON.stringify(params);

    var config = {
      host: this.options.host || "api.nexmo.com",
      path: Conversations.PATH,
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
   * Get an existing conversation.
   *
   * @param {string|object} query - The unique identifier for the conversation to retrieve
   *               or a set of filter parameters for the query. For more information
   *               see https://ea.developer.nexmo.com/api/conversation#retrieve-a-conversation
   * @param {function} callback - function to be called when the request completes.
   */
  get(query, callback) {
    var config = {
      host: this.options.host || "api.nexmo.com",
      path:
        typeof query === "string"
          ? `${Conversations.PATH}/${query}`
          : Utils.createPathWithQuery(Conversations.PATH, query),
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
   * Get next page of conversations.
   *
   * @param {object} response - The response from a paginated conversations list
   *               see https://ea.developer.nexmo.com/api/conversation#listConversations
   * @param {function} callback - function to be called when the request completes.
   */
  next(response, callback) {
    if (response._links.next) {
      this.get(Utils.getQuery(response._links.next.href), callback);
    } else {
      const error = new Error("The response doesn't have a next page.");
      callback(error, null);
    }
  }

  /**
   * Get previous page of conversations.
   *
   * @param {object} response - The response from a paginated conversations list
   *               see https://ea.developer.nexmo.com/api/conversation#listConversations
   * @param {function} callback - function to be called when the request completes.
   */
  prev(response, callback) {
    if (response._links.prev) {
      this.get(Utils.getQuery(response._links.prev.href), callback);
    } else {
      const error = new Error("The response doesn't have a previous page.");
      callback(error, null);
    }
  }

  /**
   * Update an existing conversation.
   *
   * @param {string} conversationId - The unique identifier for the conversation to update.
   * @param {Object} params - Parameters used when updating the conversation.
   * @param {function} callback - function to be called when the request completes.
   */
  update(conversationId, params, callback) {
    params = JSON.stringify(params);

    var config = {
      host: this.options.host || "api.nexmo.com",
      path: `${Conversations.PATH}/${conversationId}`,
      method: "PUT",
      body: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.creds.generateJwt()}`
      }
    };

    this.options.httpClient.request(config, callback);
  }

  /**
   * Record an existing conversation.
   *
   * @param {string} conversationId - The unique identifier for the conversation to record.
   * @param {Object} params - Parameters used when recording the conversation.
   * @param {function} callback - function to be called when the request completes.
   */
  record(conversationId, params, callback) {
    params = JSON.stringify(params);

    var config = {
      host: this.options.host || "api.nexmo.com",
      path: `${Conversations.V1_PATH}/${conversationId}/record`,
      method: "PUT",
      body: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.creds.generateJwt()}`
      }
    };

    this.options.httpClient.request(config, callback);
  }

  /**
   * Deleta an existing conversation.
   *
   * @param {string} conversationId - The unique identifier for the conversation to delete.
   * @param {function} callback - function to be called when the request completes.
   */
  delete(conversationId, callback) {
    var config = {
      host: this.options.host || "api.nexmo.com",
      path: `${Conversations.PATH}/${conversationId}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.creds.generateJwt()}`
      }
    };

    this.options.httpClient.request(config, callback);
  }
}

export default Conversations;
