import querystring from 'querystring';

/**
 * Provides access to the `stream` resource.
 */
class StreamResource {
  
  /**
   * The path to the `stream` resource.
   */
  static get PATH() {
    return '/beta/calls/{call_uuid}/stream';
  }
  
  /**
   * Creates a new StreamResource.
   *
   * @param {Credentials} creds - Credentials used when interacting with the Nexmo API.
   * @param {Object} options - additional options for the class.
   */
  constructor(creds, options) {
    this.creds = creds;
    this.options = options;
  }
  
  /**
   * Starts a stream in a call.
   *
   * @param {Object} params - Parameters used when starting the stream. See https://docs.dev.nexmoinc.net/voice/voice-api/api-reference#stream_put for more information.
   * @param {function} callback - function to be called when the request completes.
   */
  start(callId, params, callback) {
    var config = {
      host: 'api.nexmo.com',
      path: StreamResource.PATH.replace('{call_uuid}', callId),
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.creds.generateJwt()}`
      }
    };
    this.options.httpClient.request(config, callback);
  }
  
  /**
   * Stop a stream in a call.
   *
   * @param {string} callId - The unique identifier for the call for the stream to be stopped in.
   * @param {function} callback - function to be called when the request completes.
   */
  stop(callId, callback) {
    var config = {
      host:'api.nexmo.com',
      path: StreamResource.PATH.replace('{call_uuid}', callId),
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.creds.generateJwt()}`
      }
    };
    this.options.httpClient.request(config, callback);
  }
  
}

export default StreamResource;