const authService = require("../services/auth-service");
const imageService = require("../services/image-service");
const {
  uploadStreamToCloudinary,
  uploadToCloudinary2,
} = require("../middleware/cloudinaryMiddleware");

const axios = require("axios");
const FormData = require("form-data");

exports.getImageUpload = (req, res) => {
  res.render("image-upload", { title: "Image Upload", user: req.session.user });
};

exports.getImageEditor = (req, res) => {
  res.render("image-editor", {
    title: "Image Editor",
    user: req.session.user,
    image: req.imageEditor.image,
  });
};

exports.uploadImage = async (req, res) => {
  try {
    const uploaded = req.cloudinaryResult;
    req.body.storagePath = uploaded.url;
    req.body.format = req.file.mimetype.split("/").pop();
    req.body.creator = req.session.user.username;
    req.body.tags = req.body.tags
      ? req.body.tags.split(",").map((tag) => tag.trim())
      : [];
    req.body.cloudinaryId = uploaded.public_id;
    delete req.body.imageUpload;

    req.body.userId = req.session.user.userId;

    await imageService.addImage(req.body);
    res.redirect("/users/dashboard");
  } catch (error) {
    console.error("Error adding image", error);
    res.status(500).send("An error occurred.");
  }
};

exports.requestImageEditor = async (req, res) => {
  try {
    const image = await imageService.getImageById(req.body.image_id);
    req.imageEditor.image = image;
    res.redirect("/image/editor");
  } catch (error) {
    console.error("Error fetching image", error);
    res.status(500).send("An error occurred.");
  }
};

exports.editorUploadImage = async (req, res) => {
  try {
    let uploadResult;

    if (req.file) {
      uploadResult = await uploadStreamToCloudinary(req.file.buffer);
    } else {
      uploadResult = await uploadToCloudinary2(
        req.imageEditor.image.storagePath,
      );
    }

    console.log("Image processed successfully", uploadResult);

    const newImage = {
      imageTitle: req.body.imageTitle,
      description: req.body.description,
      tags: req.body.tags.split(",").map((tag) => tag.trim()) || [],
      creator: req.session.user.username,
      storagePath: uploadResult.url,
      format: uploadResult.format,
      userId: req.imageEditor.image.userId, // Assuming you want to keep the same userId
      cloudinaryId: uploadResult.public_id, // The new Cloudinary ID
    };

    await imageService.addImage(newImage); // Add the new image data to your database
    res.redirect("/users/dashboard");
  } catch (error) {
    console.error("Error processing image", error);
    res.status(500).send("An error occurred.");
  }
};

exports.editorUpdateImage = async (req, res) => {
  try {
    let uploadResult;

    if (req.file) {
      uploadResult = await uploadStreamToCloudinary(req.file.buffer, {
        public_id: req.imageEditor.image.cloudinaryId,
      });
      console.log("Image updated successfully", uploadResult);
    }

    let storagePath = uploadResult
      ? uploadResult.url
      : req.imageEditor.image.storagePath;

    let format = uploadResult
      ? req.file.mimetype.split("/").pop()
      : req.imageEditor.image.format;

    const newImage = {
      _id: req.body.image_id,
      imageTitle: req.body.imageTitle,
      description: req.body.description,
      tags: req.body.tags.split(",").map((tag) => tag.trim()) || [],
      creator: req.session.user.username,
      storagePath: storagePath, // Consider updating this if needed
      format: format, // Consider updating this if the format might change
      userId: req.imageEditor.image.userId,
      cloudinaryId: req.imageEditor.image.cloudinaryId,
    };

    await imageService.updateImage(newImage);
    res.redirect("/users/dashboard");
  } catch (error) {
    console.error("Error updating image", error);
    res.status(500).send("An error occurred.");
  }
};

exports.deleteImages = async (req, res) => {
  try {
    await imageService.deleteImages(req.body.ids);
    res.redirect("/users/dashboard");
  } catch (error) {
    console.error("Error deleting images", error);
    res.status(500).send("An error occurred during image deletion.");
  }
};

// Common function to apply an image filter
async function applyImageFilter(req, res, filterUrl) {
  try {
    const response = await axios.get(req.imageEditor.image.storagePath, {
      responseType: "arraybuffer",
    });

    const formData = new FormData();
    formData.append("image", response.data, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    });

    const processedImageResponse = await axios.post(filterUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      responseType: "arraybuffer",
    });

    if (processedImageResponse.data) {
      res.set("Content-Type", "image/jpeg");
      res.send(processedImageResponse.data);
    } else {
      res.status(500).json({
        success: false,
        message: "No data received from processing service.",
      });
    }
  } catch (error) {
    console.error(`Error applying filter: ${filterUrl}`, error);
    res.status(500).send("An error occurred.");
  }
}

exports.applyGrayscale = async (req, res) => {
  await applyImageFilter(
    req,
    res,
    "http://cpp-image-processing:18080/grayscale",
  );
};

exports.applyInvert = async (req, res) => {
  await applyImageFilter(req, res, "http://cpp-image-processing:18080/invert");
};

exports.applyGaussianBlur = async (req, res) => {
  await applyImageFilter(
    req,
    res,
    "http://cpp-image-processing:18080/gaussianBlur",
  );
};

exports.applyCannyEdgeDetection = async (req, res) => {
  await applyImageFilter(
    req,
    res,
    "http://cpp-image-processing:18080/cannyEdgeDetection",
  );
};

exports.applyEqualizeHist = async (req, res) => {
  await applyImageFilter(
    req,
    res,
    "http://cpp-image-processing:18080/equalizeHist",
  );
};
