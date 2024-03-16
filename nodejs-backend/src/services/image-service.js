const mongooseInit = require("./mongoose-init");
const { getRedisClient } = require("./redis-service");
const {
  deleteImageFromCloudinary,
} = require("../middleware/cloudinaryMiddleware");
const crypto = require("crypto");

let Image;
let User;
let redisClient;

module.exports.initialize = async () => {
  try {
    Image = mongooseInit.getModel("Image");
    User = mongooseInit.getModel("User");
    redisClient = await getRedisClient();
    setInterval(cleanupExpiredEntries, 30000); // Clean up expired entries every half minute
  } catch (error) {
    throw new Error("Error initializing image service", error);
  }
};

/* Create */

module.exports.addImage = async (imageData) => {
  try {
    const newImage = new Image(imageData);
    await newImage.save();

    await redisClient.del("AllImages");
    await redisClient.del(`imagesUserId:${imageData.userId}`);

    imageData.tags.forEach(async (tag) => {
      await redisClient.del(`imagesTag:${tag}`);
    });

    await redisClient.del(IMAGES_MIN_DATE_HASH_KEY);
    await redisClient.del(IMAGES_MIN_DATE_EXPIRATION_TRACKER_KEY);
    await redisClient.del(IMAGES_CUSTOM_HASH_KEY);
    await redisClient.del(IMAGES_CUSTOM_EXPIRATION_TRACKER_KEY);
    await redisClient.del(IMAGES_COUNT_HASH_KEY);
    await redisClient.del(IMAGES_COUNT_EXPIRATION_TRACKER_KEY);

    return;
  } catch (error) {
    throw new Error(`There was an error creating the image: ${error}`);
  }
};

/* Read */

module.exports.getAllImages = async () => {
  try {
    const cachedImages = await redisClient.get("AllImages");
    if (cachedImages) {
      return JSON.parse(cachedImages);
    }
    const images = await Image.find().lean().exec();
    await redisClient.set("AllImages", JSON.stringify(images), { EX: 60 });
    return images;
  } catch (error) {
    throw new Error(`Unable to query images: ${error}`);
  }
};

module.exports.getImageById = async (id) => {
  try {
    const cachedImage = await redisClient.get(`imageId:${id}`);
    if (cachedImage) {
      return JSON.parse(cachedImage);
    }
    const images = await Image.find({ _id: id }).lean().exec();
    await redisClient.set(`imageId:${id}`, JSON.stringify(images[0]), {
      EX: 600,
    });
    return images[0];
  } catch (error) {
    throw new Error(`Unable to query images: ${error}`);
  }
};

module.exports.getImagesByUser = async (userId) => {
  try {
    const cachedImages = await redisClient.get(`imagesUserId:${userId}`);
    if (cachedImages) {
      return JSON.parse(cachedImages);
    }
    const images = await Image.find({ userId: userId }).lean().exec();
    await redisClient.set(`imagesUserId:${userId}`, JSON.stringify(images), {
      EX: 600,
    });
    return images;
  } catch (error) {
    throw new Error(`Unable to query images: ${error}`);
  }
};

module.exports.getImagesByTag = async (tag) => {
  try {
    const cachedImages = await redisClient.get(`imagesTag:${tag}`);
    if (cachedImages) {
      return JSON.parse(cachedImages);
    }
    const images = await Image.find({ tags: tag }).lean().exec();
    await redisClient.set(`imagesTag:${tag}`, JSON.stringify(images), {
      EX: 300,
    });
    return images;
  } catch (error) {
    throw new Error(`Unable to query images: ${error}`);
  }
};

const IMAGES_MIN_DATE_HASH_KEY = "imagesMinDate";
const IMAGES_MIN_DATE_EXPIRATION_TRACKER_KEY = "imagesMinDateExpiry";

module.exports.getImagesByMinDate = async (date) => {
  try {
    // Convert date to a consistent string format if not already a string
    const dateHash = crypto
      .createHash("sha256")
      .update(date.toISOString())
      .digest("hex");

    // Attempt to retrieve images for the given date from the Redis hash
    const cachedImages = await redisClient.hGet(
      IMAGES_MIN_DATE_HASH_KEY,
      dateHash,
    );
    if (cachedImages) {
      return JSON.parse(cachedImages); // Parse and return the cached images if found
    }

    // If not found in cache, query the database for images
    const images = await Image.find({ createdAt: { $gte: date } })
      .lean()
      .exec();

    // Current time in Unix timestamp plus 60 seconds for expiration
    const expirationTime = Math.floor(Date.now() / 1000) + 60;

    // Store the retrieved images in the Redis hash
    await redisClient.hSet(
      IMAGES_MIN_DATE_HASH_KEY,
      dateHash,
      JSON.stringify(images),
    );

    // Track the expiration time for the new entry using a sorted set
    // Make sure to use the proper format for zAdd with your Redis client version
    await redisClient.zAdd(IMAGES_MIN_DATE_EXPIRATION_TRACKER_KEY, [
      { score: expirationTime, value: dateHash },
    ]);

    return images; // Return the retrieved images
  } catch (error) {
    throw new Error(`Unable to query images: ${error.message}`);
  }
};

const IMAGES_CUSTOM_HASH_KEY = "customImages";
const IMAGES_CUSTOM_EXPIRATION_TRACKER_KEY = "customImagesExpiry";

module.exports.getImagesCustom = async (
  searchCondition,
  skip = 0,
  limit = 0,
  lean = false,
) => {
  try {
    // Convert parameters into a consistent string format
    const paramsString = JSON.stringify({ searchCondition, skip, limit, lean });
    const paramsHash = crypto
      .createHash("sha256")
      .update(paramsString)
      .digest("hex");

    // Attempt to retrieve cached images for the given parameters from the Redis hash
    const cachedImages = await redisClient.hGet(
      IMAGES_CUSTOM_HASH_KEY,
      paramsHash,
    );
    if (cachedImages) {
      return JSON.parse(cachedImages); // Parse and return the cached images if found
    }

    // Query the database if not found in cache
    let query = Image.find(searchCondition);
    if (!isNaN(skip) && skip > 0) {
      query = query.skip(skip);
    }
    if (!isNaN(limit) && limit > 0) {
      query = query.limit(limit);
    }
    if (lean) {
      query = query.lean();
    }
    const images = await query.exec();

    // Store the retrieved images in the Redis hash
    await redisClient.hSet(
      IMAGES_CUSTOM_HASH_KEY,
      paramsHash,
      JSON.stringify(images),
    );

    // Current time in Unix timestamp plus 60 seconds for expiration
    const expirationTime = Math.floor(Date.now() / 1000) + 60;

    // Track the expiration time for the new entry using a sorted set
    await redisClient.zAdd(IMAGES_CUSTOM_EXPIRATION_TRACKER_KEY, [
      { score: expirationTime, value: paramsHash },
    ]);

    return images; // Return the retrieved images
  } catch (error) {
    throw new Error(`Unable to query images: ${error.message}`);
  }
};

const IMAGES_COUNT_HASH_KEY = "imagesCount";
const IMAGES_COUNT_EXPIRATION_TRACKER_KEY = "imagesCountExpiry";

module.exports.getImagesCount = async (searchCondition) => {
  try {
    // Generate a hash from the searchCondition
    const conditionHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(searchCondition))
      .digest("hex");

    // Attempt to retrieve the cached count from Redis
    const cachedCount = await redisClient.hGet(
      IMAGES_COUNT_HASH_KEY,
      conditionHash,
    );
    if (cachedCount) {
      return parseInt(cachedCount, 10); // Parse and return the cached count if found
    }

    // Query the database to get the count if not found in cache
    const count = await Image.countDocuments(searchCondition).exec();

    // Store the count in Redis hash
    await redisClient.hSet(
      IMAGES_COUNT_HASH_KEY,
      conditionHash,
      count.toString(),
    );

    // Current time in Unix timestamp plus 60 seconds for expiration
    const expirationTime = Math.floor(Date.now() / 1000) + 60;

    // Track the expiration time for the new entry using a sorted set
    await redisClient.zAdd(IMAGES_COUNT_EXPIRATION_TRACKER_KEY, [
      { score: expirationTime, value: conditionHash },
    ]);

    return count; // Return the count
  } catch (error) {
    throw new Error(`Unable to query image count: ${error.message}`);
  }
};

/* Delete */

module.exports.deleteImage = async (id) => {
  try {
    const image = await Image.findOne({ _id: id }).exec();
    await Image.deleteOne({ _id: id }).exec();

    if (image.cloudinaryId) {
      await deleteImageFromCloudinary(image.cloudinaryId);
    } else {
      return null;
    }

    await redisClient.del("AllImages");
    await redisClient.del(`imageId:${id}`);
    await redisClient.del(`imagesUserId:${image.userId}`);

    image.tags.forEach(async (tag) => {
      await redisClient.del(`imagesTag:${tag}`);
    });

    await redisClient.del(IMAGES_MIN_DATE_HASH_KEY);
    await redisClient.del(IMAGES_MIN_DATE_EXPIRATION_TRACKER_KEY);
    await redisClient.del(IMAGES_CUSTOM_HASH_KEY);
    await redisClient.del(IMAGES_CUSTOM_EXPIRATION_TRACKER_KEY);
    await redisClient.del(IMAGES_COUNT_HASH_KEY);
    await redisClient.del(IMAGES_COUNT_EXPIRATION_TRACKER_KEY);
    return image;
  } catch (error) {
    throw new Error(`Unable to delete image: ${error}`);
  }
};

module.exports.deleteImages = async (idList) => {
  try {
    const images = await Image.find({ _id: { $in: idList } }).exec();
    await Image.deleteMany({ _id: { $in: idList } }).exec();

    for (let i = 0; i < images.length; i++) {
      if (images[i].cloudinaryId) {
        await deleteImageFromCloudinary(images[i].cloudinaryId);
      }
    }

    await redisClient.del("AllImages");
    await redisClient.del(`imagesUserId:${images[0].userId}`);

    images.forEach(async (image) => {
      image.tags.forEach(async (tag) => {
        await redisClient.del(`imagesTag:${tag}`);
      });
    });

    await redisClient.del(IMAGES_MIN_DATE_HASH_KEY);
    await redisClient.del(IMAGES_MIN_DATE_EXPIRATION_TRACKER_KEY);
    await redisClient.del(IMAGES_CUSTOM_HASH_KEY);
    await redisClient.del(IMAGES_CUSTOM_EXPIRATION_TRACKER_KEY);
    await redisClient.del(IMAGES_COUNT_HASH_KEY);
    await redisClient.del(IMAGES_COUNT_EXPIRATION_TRACKER_KEY);
    return images;
  } catch (error) {
    throw new Error(`Unable to delete images: ${error}`);
  }
};

/* Update */

module.exports.updateImage = async (imageData) => {
  try {
    const image = await Image.findOne({ _id: imageData._id }).exec();

    await Image.updateOne({ _id: imageData._id }, imageData).exec();

    await redisClient.del("AllImages");
    await redisClient.del(`imageId:${imageData._id}`);
    await redisClient.del(`imagesUserId:${image.userId}`);

    image.tags.forEach(async (tag) => {
      await redisClient.del(`imagesTag:${tag}`);
    });

    await redisClient.del(IMAGES_MIN_DATE_HASH_KEY);
    await redisClient.del(IMAGES_MIN_DATE_EXPIRATION_TRACKER_KEY);
    await redisClient.del(IMAGES_CUSTOM_HASH_KEY);
    await redisClient.del(IMAGES_CUSTOM_EXPIRATION_TRACKER_KEY);

    return;
  } catch (error) {
    throw new Error(`Unable to update image: ${error}`);
  }
};

/* Cache Cleanup */

// Function to clean up expired entries. Call this periodically.
async function cleanupExpiredEntries() {
  const currentTime = Math.floor(Date.now() / 1000);

  // Find expired dates in the sorted set
  const expiredMinDates = await redisClient.sendCommand([
    "ZRANGE",
    IMAGES_MIN_DATE_EXPIRATION_TRACKER_KEY,
    "0",
    `${currentTime}`,
    "BYSCORE",
  ]);

  if (expiredMinDates.length > 0) {
    await redisClient.sendCommand([
      "HDEL",
      IMAGES_MIN_DATE_HASH_KEY,
      ...expiredMinDates,
    ]);

    // Remove expired entries from the expiration tracker
    await redisClient.zRemRangeByScore(
      IMAGES_MIN_DATE_EXPIRATION_TRACKER_KEY,
      0,
      currentTime,
    );
  }

  // Find expired custom images entries in the sorted set
  const expiredCustomImages = await redisClient.sendCommand([
    "ZRANGE",
    IMAGES_CUSTOM_EXPIRATION_TRACKER_KEY,
    "0",
    `${currentTime}`,
    "BYSCORE",
  ]);

  if (expiredCustomImages.length > 0) {
    await redisClient.sendCommand([
      "HDEL",
      IMAGES_CUSTOM_HASH_KEY,
      ...expiredCustomImages,
    ]);

    // Remove expired entries from the expiration tracker
    await redisClient.zRemRangeByScore(
      IMAGES_CUSTOM_EXPIRATION_TRACKER_KEY,
      0,
      currentTime,
    );
  }

  // Find expired images count entries in the sorted set
  const expiredImagesCount = await redisClient.sendCommand([
    "ZRANGE",
    IMAGES_COUNT_EXPIRATION_TRACKER_KEY,
    "0",
    `${currentTime}`,
    "BYSCORE",
  ]);

  if (expiredImagesCount.length > 0) {
    await redisClient.sendCommand([
      "HDEL",
      IMAGES_COUNT_HASH_KEY,
      ...expiredImagesCount,
    ]);

    // Remove expired entries from the expiration tracker
    await redisClient.zRemRangeByScore(
      IMAGES_COUNT_EXPIRATION_TRACKER_KEY,
      0,
      currentTime,
    );
  }
}
