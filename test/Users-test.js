import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import ResourceTestHelper from "./ResourceTestHelper";

import Users from "../lib/Users";
import HttpClient from "../lib/HttpClient";
import Credentials from "../lib/Credentials";

var creds = Credentials.parse({
  applicationId: "some-id",
  privateKey: __dirname + "/private-test.key"
});
var emptyCallback = () => {};

describe("Users", () => {
  var httpClientStub = null;
  var users = null;

  beforeEach(() => {
    httpClientStub = sinon.createStubInstance(HttpClient);
    var options = {
      httpClient: httpClientStub
    };
    users = new Users(creds, options);
  });

  it("should default options to empty object in the constructor", () => {
    let users = new Users(creds);

    expect(JSON.stringify(users.options)).to.equal("{}");
  });

  it("should allow a user to be created", () => {
    var params = {};
    users.create(params, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(params, {
      path: `${Users.PATH}`
    });
    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should get a collection of Users", () => {
    users.get({}, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Users.PATH}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should get the next collection of users", () => {
    users.next({ _links: { next: { href: "?some=query" } } }, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Users.PATH}?some=query`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should error when the next collection of users doesn't exit", () => {
    let callback = sinon.spy();
    users.next({ _links: { prev: { href: "?some=query" } } }, callback);

    expect(callback).to.have.been.calledWith(
      Error("The response doesn't have a next page."),
      null
    );
  });

  it("should get the previous collection of users", () => {
    users.prev({ _links: { prev: { href: "?some=query" } } }, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Users.PATH}?some=query`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should error when the previous collection of users doesn't exit", () => {
    let callback = sinon.spy();
    users.prev({ _links: { next: { href: "?some=query" } } }, callback);

    expect(callback).to.have.been.calledWith(
      Error("The response doesn't have a next page."),
      null
    );
  });

  it("should get a single user using a user ID", () => {
    const userId = "USR-aaabbbccc-111222333";
    users.get(userId, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Users.PATH}/${userId}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should allow a user to be updated", () => {
    const userId = "USR-aaabbbccc-111222333";
    var params = {
      action: "join"
    };
    users.update(userId, params, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(params, {
      method: "PUT",
      path: `${Users.PATH}/${userId}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should allow a user to be deleted", () => {
    const userId = "USR-aaabbbccc-111222333";
    users.delete(userId, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "DELETE",
      body: undefined,
      path: `${Users.PATH}/${userId}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });
});
