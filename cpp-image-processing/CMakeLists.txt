cmake_minimum_required(VERSION 3.10)
project(cpp-image-processing)

# Find OpenCV package
find_package(OpenCV REQUIRED)

# Include OpenCV header directories
include_directories(${OpenCV_INCLUDE_DIRS})

set(INCLUDE_PATHS libraries/asio-1.28.0/include /libraries/Crow/include)

file(GLOB SOURCES src/*.cpp)  

add_executable(cpp-image-processing ${SOURCES})

target_include_directories(cpp-image-processing PUBLIC ${INCLUDE_PATHS})

# Link your application with OpenCV libraries
target_link_libraries(cpp-image-processing ${OpenCV_LIBS})