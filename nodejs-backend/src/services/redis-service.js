const redis = require("redis");

let redisClient;
// let customExScriptSha;

async function initialize() {
  try {
    // const luaScript_customEX = fs.readFileSync("./lua/redis-ex-script.lua", {
    //   encoding: "utf8",
    // });

    redisClient = redis.createClient();

    // Default configuration (customize as needed):
    // { url: "redis://redis:6379" }, // Example for local Redis server
    // url: "127.0.0.1:6379",
    // For Redis 6 or newer with password and username use:
    // url: 'redis://default:password@localhost:6379',

    redisClient.on("error", (err) => {
      throw new Error(`Redis error: ${err}`);
    });
    await redisClient.connect();

    // Load the Lua script into Redis and get back the SHA1 hash of the script
    // customExScriptSha = await redisClient.scriptLoad(luaScript_customEX);

    // console.log("Lua script result:", test);
  } catch (error) {
    console.error("Error initializing Redis client", error);
  }
}

async function getRedisClient() {
  if (!redisClient) {
    throw new Error(
      "Redis client has not been initialized. Please call initialize()",
    );
  }
  return redisClient;
}

// async function getCustomExScriptSha() {
//   if (!customExScriptSha) {
//     throw new Error(
//       "Redis script SHA1 hash has not been initialized. Please call initialize()",
//     );
//   }
//   return customExScriptSha;
// }

// , getCustomExScriptSha
module.exports = { getRedisClient, initialize };
