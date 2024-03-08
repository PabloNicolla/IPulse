#include <opencv2/opencv.hpp>
#include "crow.h"

int main()
{
    cv::Mat image = cv::imread("../src/flower.jpeg");

    // Check if the image was loaded
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }

    // Convert the image to grayscale
    cv::Mat grayImage;
    cv::cvtColor(image, grayImage, cv::COLOR_BGR2GRAY);

    // Save the grayscale image
    cv::imwrite("grayscale_image.jpg", grayImage);

    crow::SimpleApp app;

    CROW_ROUTE(app, "/")
    ([]()
     { return "Hello, world!"; });

    CROW_ROUTE(app, "/about")
    ([]()
     { return "Hello, world! 12321321321"; });

    app.port(8080).multithreaded().run();
}
