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
        Invert,
        GaussianBlur,
        CannyEdgeDetection,
        EqualizeHist
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
        case Operation::GaussianBlur:
            cv::GaussianBlur(img, processedImg, cv::Size(5, 5), 0);
            break;
        case Operation::CannyEdgeDetection:
            cv::Canny(img, processedImg, 100, 200);
            break;
        case Operation::EqualizeHist:
            applyEqualizeHist(img, processedImg);
            break;
        default:
            throw std::invalid_argument("Unsupported operation");
        }

        std::vector<uchar> encodedImg;
        cv::imencode(".jpg", processedImg, encodedImg);
        return encodedImg;
    }

private:
    static void applyEqualizeHist(const cv::Mat &img, cv::Mat &processedImg)
    {
        // Convert the original image from BGR to YCrCb color space
        cv::Mat imageYCrCb;
        cv::cvtColor(img, imageYCrCb, cv::COLOR_BGR2YCrCb);

        // Split the YCrCb image into separate channels
        std::vector<cv::Mat> channels;
        cv::split(imageYCrCb, channels);

        // Equalize the histogram of the Y channel (intensity)
        cv::equalizeHist(channels[0], channels[0]);

        // Merge the modified Y channel back with the Cr and Cb channels
        cv::merge(channels, imageYCrCb);

        // Convert the YCrCb image back to the BGR color space
        cv::cvtColor(imageYCrCb, processedImg, cv::COLOR_YCrCb2BGR);
    }
};
