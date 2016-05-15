"use strict";

import nexmo from './index';

class Voice {
  /**
   * @param {Credentials} credentials
   *    credentials to be used when interacting with the API.
   * @param {Object} options
   *    Addition SMS options.
   */
  constructor(credentials, options = {}) {
    this.creds = credentials;
    this.options = options;
    
    // Used to facilitate testing of the call to the underlying object
    this._nexmo = this.options.nexmoOverride || nexmo;
    
    this._nexmo.initialize(this.creds.key, this.creds.secret, this.options.debug);
  }
  
  /**
   * TODO: document
   */
  sendTTSMessage() {
    this._nexmo.sendTTSMessage.apply(this._nexmo, arguments);
  }
  
  /**
   * TODO: document
   */
  sendTTSPromptWithCapture() {
    this._nexmo.sendTTSPromptWithCapture.apply(this._nexmo, arguments);
  }
  
  /**
   * TODO: document
   */
  sendTTSPromptWithConfirm() {
    this._nexmo.sendTTSPromptWithConfirm.apply(this._nexmo, arguments);
  }
  
  /**
   * TODO: document
   */
  call() {
    this._nexmo.call.apply(this._nexmo, arguments);
  }
    
}

export default Voice;
