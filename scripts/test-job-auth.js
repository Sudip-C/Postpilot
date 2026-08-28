import { requireJobSecret } from "../src/middleware/jobAuth.middleware.js";
import { env } from "../src/config/env.js";

function createResponse() {
  return {
    statusCode: null,
    body: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(data) {
      this.body = data;
      return this;
    },
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function testJobAuth() {
  try {
    console.log("Testing daily job authentication...\n");

    if (!env.dailyJobSecret) {
      throw new Error(
        "DAILY_JOB_SECRET is not configured."
      );
    }

    // Test 1: Missing Authorization header
    {
      const req = {
        headers: {},
      };

      const res = createResponse();

      let nextCalled = false;

      requireJobSecret(req, res, () => {
        nextCalled = true;
      });

      assert(
        res.statusCode === 401,
        "Missing secret should return 401."
      );

      assert(
        nextCalled === false,
        "Missing secret must not call next()."
      );

      console.log("Missing secret rejected.");
    }

    // Test 2: Wrong secret
    {
      const req = {
        headers: {
          authorization: "Bearer definitely-wrong-secret",
        },
      };

      const res = createResponse();

      let nextCalled = false;

      requireJobSecret(req, res, () => {
        nextCalled = true;
      });

      assert(
        res.statusCode === 401,
        "Wrong secret should return 401."
      );

      assert(
        nextCalled === false,
        "Wrong secret must not call next()."
      );

      console.log("Wrong secret rejected.");
    }

    // Test 3: Correct secret
    {
      const req = {
        headers: {
          authorization:
            `Bearer ${env.dailyJobSecret}`,
        },
      };

      const res = createResponse();

      let nextCalled = false;

      requireJobSecret(req, res, () => {
        nextCalled = true;
      });

      assert(
        nextCalled === true,
        "Correct secret should call next()."
      );

      console.log("Correct secret accepted.");
    }

    console.log(
      "\nDaily job authentication test: OK"
    );
  } catch (error) {
    console.error(
      "\nDaily job authentication test: FAILED"
    );

    console.error(error.message);

    process.exit(1);
  }
}

testJobAuth();