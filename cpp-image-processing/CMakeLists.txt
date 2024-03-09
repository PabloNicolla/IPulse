cmake_minimum_required(VERSION 3.10)
project(cpp-image-processing)

# Find OpenCV package
find_package(OpenCV REQUIRED)

# Find OpenSSL package
find_package(OpenSSL REQUIRED)

# Include OpenCV header
include_directories(${OpenCV_INCLUDE_DIRS})

# Include OpenSSL headers
include_directories(${OPENSSL_INCLUDE_DIR})

set(INCLUDE_PATHS libraries/asio-1.28.0/include /libraries/Crow/include)

file(GLOB SOURCES src/*.cpp)  

add_executable(cpp-image-processing ${SOURCES})

target_include_directories(cpp-image-processing PUBLIC ${INCLUDE_PATHS})

# Link OpenCV libraries
target_link_libraries(cpp-image-processing ${OpenCV_LIBS})

# Link OpenSSL libraries
target_link_libraries(${PROJECT_NAME} OpenSSL::SSL OpenSSL::Crypto)
