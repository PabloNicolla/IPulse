#include <iostream>
#include <vector>
#include "crow.h"
#include "imageProcessor.h" // Include the header file for your ImageProcessor class

// Middleware for setting CORS headers
struct CorsMiddleware
{
  struct context
  {
  };

  void before_handle(crow::request &req, crow::response &res, context &ctx)
  {
  }

  void after_handle(crow::request &req, crow::response &res, context &ctx)
  {
    // Set necessary CORS headers here
    res.add_header("Access-Control-Allow-Origin", "*");
    res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.add_header("Access-Control-Allow-Headers", "Content-Type");
  }
};

int main()
{
  crow::App<CorsMiddleware> app;

  CROW_ROUTE(app, "/")
  ([]()
   { return "Hello, world!"; });

  CROW_ROUTE(app, "/grayscale").methods("POST"_method)([](const crow::request &req)
                                                       {
    try {
        crow::multipart::message msg(req);
        auto imagePart = msg.get_part_by_name("image");
        std::vector<uchar> data(imagePart.body.begin(), imagePart.body.end());

        auto processedData = ImageProcessor::processImage(data, ImageProcessor::Operation::Grayscale);

        crow::response res;
        res.set_header("Content-Type", "image/jpeg");
        res.body = std::string(processedData.begin(), processedData.end());
        return res;
    } catch (const std::exception& e) {
        return crow::response(400, e.what());
    } });

  CROW_ROUTE(app, "/invert").methods("POST"_method)([](const crow::request &req)
                                                    {
    try {
        crow::multipart::message msg(req);
        auto imagePart = msg.get_part_by_name("image");
        std::vector<uchar> data(imagePart.body.begin(), imagePart.body.end());

        auto processedData = ImageProcessor::processImage(data, ImageProcessor::Operation::Invert);

        crow::response res;
        res.set_header("Content-Type", "image/jpeg");
        res.body = std::string(processedData.begin(), processedData.end());
        return res;
    } catch (const std::exception& e) {
        return crow::response(400, e.what());
    } });

  // app.bindaddr("127.0.0.1").port(18080).multithreaded().run();
  app.port(18080).multithreaded().run();
}
