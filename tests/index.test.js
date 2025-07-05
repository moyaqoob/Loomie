const axios2 = require("axios");
const { response } = require("express");

const BACKEND_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3001";

const axios = {
  post: async (...args) => {
    try {
      const res = await axios2.post(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  get: async (...args) => {
    try {
      const res = await axios2.get(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  put: async (...args) => {
    try {
      const res = await axios2.put(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  delete: async (...args) => {
    try {
      const res = await axios2.delete(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
};

describe("Authentication", () => {
  test("user is able to sign up only once", async () => {
    const username = `yaqoob-${Math.random()}`; //here is the thing
    const password = "123456";
    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "admin",
    });

    expect(updatedResponse.status).toBe(400);
  });

  test("Sign in request fails if the username is empty", async () => {
    jest.setTimeout(10000)
    const username = `yaqoob-${Math.random()}`;
    const password = "123456";

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
    });
    expect(response.status).toBe(400);
  });

  test("Sign in succeeds if the username and password are correct", async () => {
    const username = `yaqoob-${Math.random()}`;
    const password = "123456";

    const signupRes = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    expect(signupRes.status).toBe(200)


    // 2. sign‑in
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      { username, password }
    );

    // expect(res.status).toBe(200);
    expect(res.status).toBe(200);
    expect(res.data.token).toBeDefined();
    
  });

  // test("user is able to sign in", async () => {
  //   const username = `yaqoob-${Math.random()}`;
  //   const password = "123456";

  //   await axios.post(`${BACKEND_URL}/api/v1/signin`, {
  //     username,
  //     password,
  //   });

  //   const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
  //     username,
  //     password,
  //   });
  //   expect(response.status).toBe(200);
  //   expect(response.data.token).toBeDefined();
  // });

  test("Signin fails if the username and password is incorrect", async () => {
    const username = `random bs`;
    const password = "321423";
    try {
      await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password,
      });
    } catch (error) {
      expect(error.response.status).toBe(403);
      expect(error.response.data.error).toBe("Invalid credentials");
    }
  });
});

/*describe("User metadata endpoints", () => {
  let token = " ";
  beforeEach(async () => {
    const username = `yaqoob-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token;
  });

  test("user cant update their wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "123123",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(400);
  });

  test("User can update their right avatar id", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatar: "123123",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(200);
  });

  test("User is not able to update their metadata if the auth header is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/metadata`, {
      avatarId,
    });

    expect(response.status).toBe(403);
  });

  afterEach(() => {
    console.log("test passed after all");
  });
});

describe("User avatar information", () => {
  let avatarId;
  let token;
  let userId;
  beforeAll(async () => {
    beforeEach(async () => {
      const username = `yaqoob-${Math.random()}`;
      const password = "123456";

      const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        password,
        type: "admin",
      });

      userId = signupResponse.data.userId;

      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password,
      });

      token = response.data.token;

      const avatarResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/avatar`,
        {
          imageUrl:
            "https://imgs.search.brave.com/SfbKngzBSjX74Bh5pFFXoqfLVF5ZZHQeHuZr6EY8ULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmd1/aW0uY28udWsvaW1n/L21lZGlhL2QxMTIw/Njc4Njc4ZDFlNjVm/NDU3ZjA3ZGFkNWY5/NTRhMzNiY2M3NjIv/MF8wXzE5MjBfMTA4/MC9tYXN0ZXIvMTky/MC5qcGc_d2lkdGg9/NDQ1JmRwcj0xJnM9/bm9uZSZjcm9wPW5v/bmU",
          name: "moyaqoob",
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      avatarId = avatarResponse.data.avatarId;
    });
  });

  test("Get back avatar info for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBeDefined();
  });

  test("Available avatars list the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

describe("Space information", () => {
  let token;
  let userId;
  let element2Id;
  let element1Id;
  let adminId;
  let userToken;
  let mapId;
  beforeAll(async () => {
    const username = `yaqoob-${Math.random()}`;
    const password = "123456";

    //for the admin
    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username + "-user",
      password,
    });

    adminToken = response.data.token;

    //for the users
    const userSignUpResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = signupResponse.data.userId;

    const userResponseToken = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username + "-user",
      password,
    });

    userToken = response.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1682124865982-86f0aa859b01?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1682124865982-86f0aa859b01?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1Id = element1.data.id;
    element2Id = element2.data.id;

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail:
          "https://images.unsplash.com/photo-1750096319146-6310519b5af2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        dimension: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.data.Id;
  });

  //create the space endpoint
  test("User is able to create a space", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: "map1",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.spaceId).toBeDefined();
  });

  test("User is able to create a space without mapId(empty space)", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.spaceId).toBeDefined();
  });

  test("User is not able to create a space without mapId and dimensions", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.status).toBe(400);
  });

  //delete the space
  test("User is not able to delete a space that doesnot exist", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space/1231`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(response.status).toBe(400);
  });

  test("User is  able to delete a space that exist", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: "map1",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(deleteResponse.status).toBe(200);
  });

  test("User should not be able to delete test created by another user", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space`, {
      header: {
        authorization: `Bearer ${adminToken}`,
      },
    });

    expect(deleteResponse.status).toBe(400);
  });

  test("Admin has no spaces initially", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space/all`);
    expect(response.data.spaces.length).toBe(0);
  });

  test("Admin has no spaces initially", async () => {
    const spaceCreatedResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      { name: "Test", dimensions: "100x200" },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`);
    const filteredSpace = response.data.spaces.find(
      (x) => x.id == spaceCreatedResponse.spaceId
    );
    expect(response.data.spaces.length).toBe(1);
    expect(filteredSpace).toBeDefined();
  });
});

describe("Arena Information", () => {
  let token;
  let userId;
  let element2Id;
  let element1Id;
  let adminId;
  let userToken;
  let mapId;
  let spaceId;

  beforeAll(async () => {
    const username = `yaqoob-${Math.random()}`;
    const password = "123456";

    //for the admin
    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username,
      password,
    });

    adminToken = response.data.token;

    //for the users
    const userSignUpResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignUpResponse.data.userId;

    const userResponseToken = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username + "-user",
      password,
    });

    userToken = userResponseToken.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1682124865982-86f0aa859b01?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1682124865982-86f0aa859b01?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1Id = element1.data.id;
    element2Id = element2.data.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail:
          "https://images.unsplash.com/photo-1750096319146-6310519b5af2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        dimension: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    mapId = map.Id;

    const spaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    spaceId = spaceResponse.data.spaceId;
  });

  test("Incorrect spaceId returns a 400", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kasdk01`);
    expect(response.status).toBe(400);
  });

  test("Correct spaceId returns all the elements", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`);
    expect(response.status).toBe(400);
    expect(response.data.elements.length).toBe(3);
  });

  test("Delete endpoint is able to delete an element", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`);

    await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
      spaceId: spaceId,
      elementId: response.data.element[0].id,
    });

    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`
    );

    expect(newResponse.data.elements.length).toBe(2);
  });

  test("Adding an element fails if the element is outside the dimensions", async () => {
    await axios.post(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 1000,
        y: 21000,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`
    );
    expect(newResponse.status).toBe(404);
  });

  test("Adding an element works as expected", async () => {
    await axios.post(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 50,
        y: 20,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`
    );
    expect(newResponse.status).toBe(404);
  });
});

describe("Admin Endpoints", () => {
  let userId;
  let adminToken;
  let adminId;
  let userToken;

  beforeAll(async () => {
    const username = `yaqoob-${Math.random()}`;
    const password = "123456";

    //for the admin
    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username,
      password,
    });

    adminToken = response.data.token;

    //for the users
    const userSignUpResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignUpResponse.data.userId;

    const userResponseToken = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username + "-user",
      password,
    });

    userToken = userResponseToken.data.token;
  });

  test("User is not able to hit the admin endpoint", async () => {
    const elementResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://bit.ly/4k4fTkW",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://bit.ly/4k4fTkW",
        dimensions: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 30,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 30,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://imgs.search.brave.com/SfbKngzBSjX74Bh5pFFXoqfLVF5ZZHQeHuZr6EY8ULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmd1/aW0uY28udWsvaW1n/L21lZGlhL2QxMTIw/Njc4Njc4ZDFlNjVm/NDU3ZjA3ZGFkNWY5/NTRhMzNiY2M3NjIv/MF8wXzE5MjBfMTA4/MC9tYXN0ZXIvMTky/MC5qcGc_d2lkdGg9/NDQ1JmRwcj0xJnM9/bm9uZSZjcm9wPW5v/bmU",
        name: "moyaqoob",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const updateElement = await axios.put(
      `${BACKEND_URL}/api/v1/admin/element/123`,
      {
        imageUrl: "https://bit.ly/4k4fTkW",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(avatarResponse.status).toBe(400);
    expect(elementResponse.status).toBe(400);
    expect(mapResponse.status).toBe(403);
    expect(updateElement.status).toBe(403);
  });

  test("Admin is able to update the imageUrl for an element", async () => {
    const elementResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1682124865982-86f0aa859b01?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const updatedElementResponse = await axios.put(
      `${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`,
      {
        imageUrl: "https://bit.ly/4k4fTkW",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(updatedElementResponse.status).toBe(200);
  });

  test("Admin is able to create avatar", async () => {
    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://imgs.search.brave.com/SfbKngzBSjX74Bh5pFFXoqfLVF5ZZHQeHuZr6EY8ULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmd1/aW0uY28udWsvaW1n/L21lZGlhL2QxMTIw/Njc4Njc4ZDFlNjVm/NDU3ZjA3ZGFkNWY5/NTRhMzNiY2M3NjIv/MF8wXzE5MjBfMTA4/MC9tYXN0ZXIvMTky/MC5qcGc_d2lkdGg9/NDQ1JmRwcj0xJnM9/bm9uZSZjcm9wPW5v/bmU",
        name: "moyaqoob",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(avatarResponse.status).toBe(200);
  });

  test("Admin is able to update a map", async () => {
    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://bit.ly/4k4fTkW",
        dimensions: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 30,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 30,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(mapResponse.data.id).toBeDefined();
    expect(mapResponse.status).toBe(200);
  });
});

describe("WebSocket tests", () => {
  let adminToken;
  let adminUserId;
  let userToken;
  let userId;
  let mapId;
  let element1Id;
  let element2Id;
  let spaceId;
  let ws1;
  let ws2;
  let ws1Messages = [];
  let ws2Messages = [];
  let adminX;
  let adminY;
  let userX;
  let userY;

  function waitForAndPopLatestMessage(messageArray) {
    return new Promise((r) => {
      if (messageArray.length > 0) {
        resolve(messageArray.shift());
      } else {
        let interval = setInterval(() => {
          if (messageArray.length > 0) {
            resolve(messageArray.shift());
            clearInterval(interval);
          }
        }, 100);
      }
    });
  }

  async function setUpHTTP() {
    const username = `yaqoob-${Math.random()}`;
    const password = "123456";

    const adminSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username,
        password,
        role: "admin",
      }
    );

    const adminSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username,
        password,
      }
    );
    adminUserId = adminSignupResponse.data.userId;
    adminToken = adminSigninResponse.data.token;

    const userSignUpResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
      }
    );

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + "-user",
        password,
      }
    );

    userId = userSignUpResponse.data.userId;
    userToken = userSigninResponse.data.token;

    //element 1
    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1682124865982-86f0aa859b01?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    //element 2 response
    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1682124865982-86f0aa859b01?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    //element 1 and 2 id
    element1Id = element1.data.id;
    element2Id = element2.data.id;

    //map response
    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail:
          "https://images.unsplash.com/photo-1750096319146-6310519b5af2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        dimension: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    mapId = map.Id;

    //space response
    const spaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    spaceId = spaceResponse.data.spaceId;
  }

  async function setUpWs() {
    ws1 = new WebSocket(WS_URL);
    ws2 = new WebSocket(WS_URL);

    await new Promise((r) => {
      ws1.onopen = r;
    });
    await new Promise((r) => {
      ws2.onopen = r;
    });

    ws1.onmessage = (event) => {
      ws1Messages.push(JSON.parse(event.data));
    };

    ws1.onmessage = (event) => {
      ws2Messages.push(JSON.parse(event.data));
    };

    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: adminToken,
        },
      })
    );

    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: userToken,
        },
      })
    );
  }

  beforeAll(async () => {
    setUpHTTP();
    setUpWs();
  });

  test("Get back ack for joining the space", async () => {
    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: adminToken,
        },
      })
    );

    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: userToken,
        },
      })
    );

    const message1 = await waitForAndPopLatestMessage(ws1Messages);
    const message2 = await waitForAndPopLatestMessage(ws2Messages);

    expect(message1.type).toBe("space-joined");
    expect(message2.type).toBe("space-joined");

    expect(message1.payload.users.length + message2.payload.users.length).toBe(
      1
    );

    adminX = message1.payload.spawn.x;
    adminY = message1.payload.spawn.y;

    userX = message2.payload.spawn.x;
    userY = message2.payload.spawn.y;
  });

  test("User should not be able to move across the boundary of the wall", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: 10000,
          y: 1000,
        },
      })
    );

    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });
  test("User should not be able to move across the boundary of the wall", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: adminX+2,
          y: adminY,
        },
      })
    );

    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("Correct movement should be broadcasted to other sockets in the room", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: adminX+1,
          y: adminY,
          userId:adminUserId

        },
      })
    );

    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement");
    expect(message.payload.x).toBe(adminX+1);
    expect(message.payload.y).toBe(adminY);
  });
  test("If a user leaves, the other user recieves a leave event", async () => {
    ws1.close();

    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("user-left");
    expect(message.payload.userId).toBe(adminUserId);
  });

  test("If a user joins, the other user recieves the join event",async()=>{
    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: userToken,
        },
      })
    );

    const messages = await waitForAndPopLatestMessage(ws1Messages);
    expect(messages.type).toBe("join")
  })
})
*/
