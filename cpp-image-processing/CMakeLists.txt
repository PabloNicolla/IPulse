cmake_minimum_required(VERSION 3.10)

project(cpp-image-processing)

#add_executable(cpp-image-processing src/main.cpp)
file(GLOB SOURCES src/*.cpp)  
add_executable(cpp-image-processing ${SOURCES}) 