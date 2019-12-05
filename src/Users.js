"use strict";

import nexmo from "./index";

import Utils from "./Utils";

/**
 * Provides access to the `users` endpoint.
 */
class Users {
  static get PATH() {
    return "/v0.1/users";
  }

  /**
   * @param {Credentials} credentials
   *    credentials to be used when interacting with the API.
   * @param {Object} options
   *    Additional Users options.
   */
  constructor(credentials, options = {}) {
    this.creds = credentials;
    this.options = options;
  }

  /**
   * Create a new user.
   *
   * @param {Object} params - Parameters used when creating the user. See https://ea.developer.nexmo.com/api/conversation#create-a-user for more information.
   * @param {function} callback - function to be called when the request completes.
   */
  create(params, callback) {
    params = JSON.stringify(params);

    var config = {
      host: this.options.host || "api.nexmo.com",
      path: Users.PATH,
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
   * Get an existing user.
   *
   * @param {string|object} query - The unique identifier for the user to retrieve
   *               or a set of filter parameters for the query. For more information
   *               see https://ea.developer.nexmo.com/api/conversation#retrieve-all-users
   * @param {function} callback - function to be called when the request completes.
   */
  get(query, callback) {
    var config = {
      host: this.options.host || "api.nexmo.com",
      path: Utils.createPathWithQuery(Users.PATH, query),
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
   * Get next page of users or conversations for a user.
   *
   * @param {object} response - The response from a paginated users list
   *               see https://ea.developer.nexmo.com/api/conversation#retrieve-all-users
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
   * Get previous page of users or conversations for a user.
   *
   * @param {object} response - The response from a paginated users list
   *               see https://ea.developer.nexmo.com/api/conversation#retrieve-all-users
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
   * Update an existing user.
   *
   * @param {string} userId - The unique identifier for the user to update.
   * @param {Object} params - Parameters used when updating the conversation.
   * @param {function} callback - function to be called when the request completes.
   */
  update(userId, params, callback) {
    params = JSON.stringify(params);

    var config = {
      host: this.options.host || "api.nexmo.com",
      path: `${Users.PATH}/${userId}`,
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
   * Deleta an existing user.
   *
   * @param {string} userId - The unique identifier for the user to delete.
   * @param {function} callback - function to be called when the request completes.
   */
  delete(userId, callback) {
    var config = {
      host: this.options.host || "api.nexmo.com",
      path: `${Users.PATH}/${userId}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.creds.generateJwt()}`
      }
    };

    this.options.httpClient.request(config, callback);
  }
}

export default Users;
