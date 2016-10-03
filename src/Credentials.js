'use strict';

import fs from 'fs';
import JwtGenerator from './JwtGenerator';

/**
 * Right now only key/secret credentials are supported.
 * However, in time JWT will also be supported.
 * The `Credentials` object provides an abstraction to this.
 *
 * @param {string} apiKey - A Nexmo API Key
 * @param {string} apiSecret - A Nexmo API Secret
 * @param {string|Buffer} [privateKey] -  When a string value is passed it should
 *                        represent the path to the private key. If a Buffer is
 *                        passed then it should be the key read from the file system.
 */
class Credentials {
    constructor(apiKey, apiSecret, privateKey, applicationId) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;

        this.privateKey = null;
        this.applicationId = applicationId;

        if (privateKey instanceof Buffer) {
            this.privateKey = privateKey;
        } else if (privateKey !== undefined) {
            if (!fs.existsSync(privateKey)) {
                throw new Error(`File "${privateKey}" not found.`);
            }
            this.privateKey = fs.readFileSync(privateKey);
        }

        /** @private */
        this._jwtGenerator = new JwtGenerator();
    }

    /**
     * Generate a Jwt using the Private Key in the Credentials.
     * By default the credentials.applicationId will be used when creating the token.
     * However, this can be overwritten.
     *
     * @param {string} [applicationId] an application ID to be used instead of the
     *                default Credentials.applicationId value.
     *
     * @returns {string} The generated JWT
     */
    generateJwt(applicationId = this.applicationId) {
        var token = this._jwtGenerator.generate(this.privateKey, applicationId);
        return token;
    }

    /**
     * @private
     * Used for testing purposes only.
     */
    _setJwtGenerator(generator) {
        this._jwtGenerator = generator;
    }

    /**
     * Ensures a credentials instance is used.
     *
     * Key/Secret credentials are only supported at present.
     */
    static parse(obj) {
        if (obj instanceof Credentials) {
            return obj;
        } else {
            return new Credentials(obj.apiKey, obj.apiSecret, obj.privateKey, obj.applicationId);
        }
    }
}

export default Credentials;
