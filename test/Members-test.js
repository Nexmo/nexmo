import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import ResourceTestHelper from "./ResourceTestHelper";

import Members from "../lib/Members";
import HttpClient from "../lib/HttpClient";
import Credentials from "../lib/Credentials";

var creds = Credentials.parse({
  applicationId: "some-id",
  privateKey: __dirname + "/private-test.key"
});
var emptyCallback = () => {};

describe("Members", () => {
  var httpClientStub = null;
  var members = null;

  beforeEach(() => {
    httpClientStub = sinon.createStubInstance(HttpClient);
    var options = {
      httpClient: httpClientStub
    };
    members = new Members(creds, options);
  });

  it("should allow a user to be created as a member in a conversation", () => {
    const conversationId = "CON-eeefffggg-444555666";
    var params = {};
    members.create(conversationId, params, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(params, {
      path: `${Members.PATH.replace("{conversation_uuid}", conversationId)}`
    });
    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should have backwards compatibility for add/create", () => {
    const conversationId = "CON-eeefffggg-444555666";
    var params = {};
    members.add(conversationId, params, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(params, {
      path: `${Members.PATH.replace("{conversation_uuid}", conversationId)}`
    });
    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should get a collection of Members", () => {
    const conversationId = "CON-eeefffggg-444555666";
    members.get(conversationId, {}, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Members.PATH.replace("{conversation_uuid}", conversationId)}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should get the next collection of members", () => {
    const conversationId = "CON-eeefffggg-444555666";
    members.next(
      { _links: { next: { href: `${conversationId}/?some=query` } } },
      emptyCallback
    );

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Members.PATH.replace(
        "{conversation_uuid}",
        conversationId
      )}?some=query`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should error when the next collection of members doesn't exit", () => {
    let callback = sinon.spy();
    members.next({ _links: { prev: { href: "?some=query" } } }, callback);

    expect(callback).to.have.been.calledWith(
      Error("The response doesn't have a next page."),
      null
    );
  });

  it("should get the previous collection of members", () => {
    const conversationId = "CON-eeefffggg-444555666";
    members.prev(
      { _links: { prev: { href: `${conversationId}/?some=query` } } },
      emptyCallback
    );

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Members.PATH.replace(
        "{conversation_uuid}",
        conversationId
      )}?some=query`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should error when the previous collection of members doesn't exit", () => {
    let callback = sinon.spy();
    members.prev({ _links: { next: { href: "?some=query" } } }, callback);

    expect(callback).to.have.been.calledWith(
      Error("The response doesn't have a next page."),
      null
    );
  });

  it("should get a single Member", () => {
    const conversationId = "CON-eeefffggg-444555666";
    const memberId = "MEM-aaabbbccc-111222333";
    members.get(conversationId, memberId, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Members.PATH.replace(
        "{conversation_uuid}",
        conversationId
      )}/${memberId}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should update a member", () => {
    const memberId = "MEM-aaabbbccc-111222333";
    const conversationId = "CON-eeefffggg-444555666";
    const params = {};
    members.update(conversationId, memberId, params, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "PUT",
      body: JSON.stringify(params),
      path: `${Members.PATH.replace(
        "{conversation_uuid}",
        conversationId
      )}/${memberId}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should delete a member", () => {
    const memberId = "MEM-aaabbbccc-111222333";
    const conversationId = "CON-eeefffggg-444555666";
    members.delete(conversationId, memberId, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "DELETE",
      body: undefined,
      path: `${Members.PATH.replace(
        "{conversation_uuid}",
        conversationId
      )}/${memberId}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });
});
