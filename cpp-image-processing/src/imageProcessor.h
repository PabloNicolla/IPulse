#pragma once

#include <opencv2/opencv.hpp>
#include <vector>
#include <string>

class ImageProcessor
{
public:
    enum class Operation
    {
        Grayscale,
        Invert
    };

    static std::vector<uchar> processImage(const std::vector<uchar> &data, Operation operation)
    {
        cv::Mat img = cv::imdecode(cv::Mat(data), cv::IMREAD_COLOR);
        if (img.empty())
        {
            throw std::runtime_error("Could not decode image");
        }

        cv::Mat processedImg;
        switch (operation)
        {
        case Operation::Grayscale:
            cv::cvtColor(img, processedImg, cv::COLOR_BGR2GRAY);
            break;
        case Operation::Invert:
            cv::bitwise_not(img, processedImg);
            break;
        default:
            throw std::invalid_argument("Unsupported operation");
        }

        std::vector<uchar> encodedImg;
        cv::imencode(".jpg", processedImg, encodedImg);
        return encodedImg;
    }
};
