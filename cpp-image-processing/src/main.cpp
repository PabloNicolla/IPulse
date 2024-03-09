#include <vector>
#include <string>
#include <iostream>
#include <opencv2/opencv.hpp>
#include "crow.h"
#include "base64.h"

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

  CROW_ROUTE(app, "/test")
  ([]()
   {
    crow::response res;
    res.set_header("Content-Type", "text/plain");
    res.body = "Test route";
    return res; });

  CROW_ROUTE(app, "/upload").methods("POST"_method)([](const crow::request &req)
                                                    {
    // Create a multipart message from the request
    crow::multipart::message msg(req);

    // Access the image part by name ("image")
    auto imagePart = msg.get_part_by_name("image");
    auto imageContent = imagePart.body;

    std::cout << "Received " << msg.parts.size() << " parts" << std::endl;
    // std::cout << "Part names: ";
    // for (const auto &part : msg.parts)
    // {
    //   std::cout << part.body << " ";
    // }
    
    std::vector<uchar> data(imageContent.begin(), imageContent.end());
    cv::Mat img = cv::imdecode(cv::Mat(data), cv::IMREAD_COLOR);

    if (img.empty()) {
      return crow::response(400, "Could not decode image");
    }

    // Convert the image to grayscale
    cv::Mat grayImg;
    cv::cvtColor(img, grayImg, cv::COLOR_BGR2GRAY);
    
    // Encode the grayscale image to JPEG
    std::vector<uchar> encodedImg;
    cv::imencode(".jpg", grayImg, encodedImg);

    // Prepare the response to return the processed image
    crow::response res;
    res.set_header("Content-Type", "image/jpeg");

    // Convert std::vector<uchar> to std::string to set as response body
    std::string imageStr(encodedImg.begin(), encodedImg.end());

    std::cout << "Processed image size: " << imageStr << std::endl;

    res.body = imageStr;
    return res; });

  app.bindaddr("127.0.0.1").port(8081).multithreaded().run();
}
