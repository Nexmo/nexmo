import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import ResourceTestHelper from "./ResourceTestHelper";

import Conversations from "../lib/Conversations";
import Members from "../lib/Members";
import HttpClient from "../lib/HttpClient";
import Credentials from "../lib/Credentials";

var creds = Credentials.parse({
  applicationId: "some-id",
  privateKey: __dirname + "/private-test.key"
});
var emptyCallback = () => {};

describe("Conversations", () => {
  var httpClientStub = null;
  var conversations = null;

  beforeEach(() => {
    httpClientStub = sinon.createStubInstance(HttpClient);
    var options = {
      httpClient: httpClientStub
    };
    conversations = new Conversations(creds, options);
  });

  it("should allow the host to be changed", () => {
    let httpClientStub = sinon.createStubInstance(HttpClient);
    let options = {
      httpClient: httpClientStub,
      host: "example.com"
    };
    let conversations = new Conversations(creds, options);

    var params = {};
    conversations.create(params, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(params, {
      host: "example.com",
      path: `${Conversations.PATH}`
    });
    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should default options to empty object in the constructor", () => {
    let conversations = new Conversations(creds);

    expect(JSON.stringify(conversations.options)).to.equal("{}");
  });

  it("should allow a conversation to be created", () => {
    var params = {};
    conversations.create(params, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(params, {
      path: `${Conversations.PATH}`
    });
    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should get a collection of conversations", () => {
    conversations.get({}, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Conversations.PATH}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should get the next collection of conversations", () => {
    conversations.next(
      { _links: { next: { href: "?some=query" } } },
      emptyCallback
    );

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Conversations.PATH}?some=query`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should error when the next collection of conversations doesn't exit", () => {
    let callback = sinon.spy();
    conversations.next({ _links: { prev: { href: "?some=query" } } }, callback);

    expect(callback).to.have.been.calledWith(
      Error("The response doesn't have a next page."),
      null
    );
  });

  it("should get the previous collection of conversations", () => {
    conversations.prev(
      { _links: { prev: { href: "?some=query" } } },
      emptyCallback
    );

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Conversations.PATH}?some=query`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should error when the previous collection of conversations doesn't exit", () => {
    let callback = sinon.spy();
    conversations.prev({ _links: { next: { href: "?some=query" } } }, callback);

    expect(callback).to.have.been.calledWith(
      Error("The response doesn't have a next page."),
      null
    );
  });

  it("should get a single conversation using a conversation ID", () => {
    const conversationId = "CON-aaabbbccc-111222333";
    conversations.get(conversationId, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Conversations.PATH}/${conversationId}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should allow a conversation to be updated", () => {
    const conversationId = "CON-aaabbbccc-111222333";
    var params = {
      action: "join"
    };
    conversations.update(conversationId, params, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(params, {
      method: "PUT",
      path: `${Conversations.PATH}/${conversationId}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should allow a conversation to be recorded", () => {
    const conversationId = "CON-aaabbbccc-111222333";
    var params = {
      action: "start"
    };
    conversations.record(conversationId, params, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(params, {
      method: "PUT",
      path: `${Conversations.V1_PATH}/${conversationId}/record`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should allow a conversation to be deleted", () => {
    const conversationId = "CON-aaabbbccc-111222333";
    conversations.delete(conversationId, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "DELETE",
      body: undefined,
      path: `${Conversations.PATH}/${conversationId}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should expose a members property", () => {
    expect(conversations.members).to.be.an.instanceOf(Members);
  });
});
