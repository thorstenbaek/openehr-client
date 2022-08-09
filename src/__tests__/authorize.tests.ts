import {Environment} from "../Environment";
import {Storage} from "../BrowserStorage";
import { Utils } from "../Utils";
import { authorize, ready } from '../authorize';
import { Mock, It, Times } from 'moq.ts';
import Client from "../Client";
import ClientState from "../ClientState";

const wellKnownJson = {
  authorization_endpoint: "some-authorization-endpoint",
  token_endpoint: "some-token-endpoint"
};


let environmentMock: Mock<Environment>;
let storageMock: Mock<Storage>;
let utilsMock: Mock<Utils>;

beforeEach(() => {
  utilsMock = new Mock<Utils>();
  utilsMock.setup(u => u.randomString()).returns("random");
  utilsMock.setup(u => u.request(It.IsAny<string>(), It.IsAny<any>())).returnsAsync(wellKnownJson);

  storageMock = new Mock<Storage>();
  storageMock.setup(s => s.set("", "")).returns(Promise.resolve(""));
  storageMock.setup(s => s.get("")).returns(Promise.resolve(""));
  storageMock.setup(s => s.unset("")).returns(Promise.resolve(true));

  environmentMock = new Mock<Environment>();
  environmentMock.setup(e => e.redirect(It.IsAny<string>())).returns(Promise.resolve());
  environmentMock.setup(e => e.getUrl()).returns(new URL("https://www.someurl.no"));
  environmentMock.setup(e => e.relative(It.IsAny<string>())).returns("https://www.redirect.no");
  environmentMock.setup(e => e.getStorage()).returns(storageMock.object());
});

describe("authorize method", () => {
  test('authorize with empty authorize parameter throw exception', () => {
    expect(authorize({}, environmentMock.object(), utilsMock.object())).rejects.toThrowError("authorization parameter can not be empty");
  });

  test('authorize with missing clientid in authorize parameter throw exception', () => {
    expect(authorize({iss: "some iss", redirectUri: "some.redirect.uri", scope: "some scope", launch: "launch"}, environmentMock.object(), utilsMock.object())).rejects.toThrowError("client-id is missing in authorization parameter");
  });

  test('authorize with missing scope in authorize parameter throw exception', () => {
    expect(authorize({clientId: "some client id", iss: "some iss", redirectUri: "some.redirect.uri", launch: "launch"}, environmentMock.object(), utilsMock.object())).rejects.toThrowError("scope is missing in authorization parameter");
  });

  test('authorize with missing iis parameter throws exception', () => {
    expect(authorize({clientId: "some client id", scope: "some scope"}, environmentMock.object(), utilsMock.object())).rejects.toThrowError("Missing iss parameter");
  });

  test('authorize with correct parameters fetches Well-Known-Json and redirects', async () => {  
    await authorize({clientId: "some client id", iss: "https://unicorn.dips.fhir.service.sandbox.dips.no", redirectUri: "some.redirect.uri", scope: "openid launch", launch: "1:2:3"}, environmentMock.object(), utilsMock.object());
    environmentMock.verify(async e => e.redirect("some-authorization-endpoint?response_type=code&client_id=some%20client%20id&scope=openid%20launch&redirect_uri=https%3A%2F%2Fwww.redirect.no&aud=https%3A%2F%2Funicorn.dips.fhir.service.sandbox.dips.no&state=random&launch=1%3A2%3A3"));
  });

  test('authorize with iss parameter from uri fetches Well-Known-Json and redirects', async () => {
    environmentMock.setup(e => e.getUrl()).returns(new URL("https://www.someurl.no?iss=https://unicorn.dips.fhir.service.sandbox.dips.no"));
    await authorize({clientId: "some client id", redirectUri: "some.redirect.uri", scope: "openid launch", launch: "1:2:3"}, environmentMock.object(), utilsMock.object());
    environmentMock.verify(async e => e.redirect("some-authorization-endpoint?response_type=code&client_id=some%20client%20id&scope=openid%20launch&redirect_uri=https%3A%2F%2Fwww.redirect.no&aud=https%3A%2F%2Funicorn.dips.fhir.service.sandbox.dips.no&state=random&launch=1%3A2%3A3"));
  });

  test('authorize with iss parameter from both uri and param. Uri is used', async () => {
    environmentMock.setup(e => e.getUrl()).returns(new URL("https://www.someurl.no?iss=https://unicorn.dips.fhir.service.sandbox.dips.no"));
    await authorize({clientId: "some client id", iss: "https://tobeoverridden", redirectUri: "some.redirect.uri", scope: "openid launch", launch: "1:2:3"}, environmentMock.object(), utilsMock.object());
    environmentMock.verify(async e => e.redirect("some-authorization-endpoint?response_type=code&client_id=some%20client%20id&scope=openid%20launch&redirect_uri=https%3A%2F%2Fwww.redirect.no&aud=https%3A%2F%2Funicorn.dips.fhir.service.sandbox.dips.no&state=random&launch=1%3A2%3A3"));
  });

  test('authorize with launch parameter from uri fetches Well-Known-Json and redirects', async () => {
    environmentMock.setup(e => e.getUrl()).returns(new URL("https://www.someurl.no?launch=some:uri:launch"));
    await authorize({clientId: "some client id", iss: "https://unicorn.dips.fhir.service.sandbox.dips.no", redirectUri: "some.redirect.uri", scope: "openid launch"}, environmentMock.object(), utilsMock.object());
    environmentMock.verify(async e => e.redirect("some-authorization-endpoint?response_type=code&client_id=some%20client%20id&scope=openid%20launch&redirect_uri=https%3A%2F%2Fwww.redirect.no&aud=https%3A%2F%2Funicorn.dips.fhir.service.sandbox.dips.no&state=random&launch=some%3Auri%3Alaunch"));
  });

  test('authorize with launch from both uri and param. Uri is used', async () => {
    environmentMock.setup(e => e.getUrl()).returns(new URL("https://www.someurl.no?launch=some:uri:launch"));
    await authorize({clientId: "some client id", iss: "https://unicorn.dips.fhir.service.sandbox.dips.no", redirectUri: "some.redirect.uri", scope: "openid launch", launch: "1:2:3"}, environmentMock.object(), utilsMock.object());
    environmentMock.verify(async e => e.redirect("some-authorization-endpoint?response_type=code&client_id=some%20client%20id&scope=openid%20launch&redirect_uri=https%3A%2F%2Fwww.redirect.no&aud=https%3A%2F%2Funicorn.dips.fhir.service.sandbox.dips.no&state=random&launch=some%3Auri%3Alaunch"));
  });

  test('authorize with correct parameters stores state', async () => {  
    await authorize({clientId: "some client id", iss: "https://unicorn.dips.fhir.service.sandbox.dips.no", redirectUri: "some.redirect.uri", scope: "openid launch", launch: "1:2:3"}, environmentMock.object(), utilsMock.object());
    storageMock.verify(async s => s.set("random", It.IsAny<any>()));
  });
});

let clientStateMock: Mock<ClientState> = new Mock<ClientState>();

describe("ready method", () => {
  beforeEach(() => {
    var url = new URL("https://www.someurl.no?state=1234&code=5678");
    environmentMock.setup(e => e.getUrl()).returns(url);
    storageMock.setup(s => s.get("1234")).returns(Promise.resolve(clientStateMock.object()));
  });

  test("ready with no arguments - throws exception", async () => {
    environmentMock.setup(e => e.getUrl()).returns(new URL("https://www.someurl.no"));
    expect(ready(environmentMock.object(), utilsMock.object())).rejects.toThrowError("No 'state' parameter found. Please (re)launch the app.");
  });

  test("ready with state argument - gets state from storage", async () => {    
    await ready(environmentMock.object(), utilsMock.object());

    storageMock.verify(s => s.get("1234"));
  });

  test("ready with state argument - returns instance of Client", async () => {
    var client = await ready(environmentMock.object(), utilsMock.object());
    expect(client).toBeInstanceOf(Client);
  })
});