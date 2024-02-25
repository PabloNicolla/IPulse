# Base image with GCC compiler
FROM gcc:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy your source code
COPY . ./

# Install CMake, make and any other dependencies
RUN apt-get update && apt-get install -y cmake

# Build your project
RUN cmake -B build
RUN cmake --build build --target cpp-image-processing

# Adjust this path if your executable is in a different directory
CMD ["./build/cpp-image-processing"]
