# Base image with GCC compiler
FROM gcc:latest

# Set the working directory
WORKDIR /usr/src/app

# Install CMake, make, and other dependencies, then clean up in the same layer to reduce the image size
RUN apt-get update && \
    apt-get install -y \
    g++ cmake make git wget build-essential libopencv-dev libssl-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy your source code
COPY src/ ./src
COPY CMakeLists.txt .

# Set the working directory to the libraries directory
WORKDIR /usr/src/app/libraries

# Download and extract Asio
RUN wget https://sourceforge.net/projects/asio/files/asio/1.28.0%20%28Stable%29/asio-1.28.0.tar.gz \
    && tar -xzf asio-1.28.0.tar.gz \
    && rm asio-1.28.0.tar.gz

# Clone the Crow repository
RUN git clone https://github.com/CrowCpp/Crow.git

# Create a build directory and configure, compile and install the build (cd is local to this RUN command)
RUN cd Crow \
    && mkdir build && cd build \
    && cmake .. -DCROW_BUILD_EXAMPLES=OFF -DCROW_BUILD_TESTS=OFF -DASIO_INCLUDE_DIR=../../asio-1.28.0/include \
    && make && make install

# Create a build directory and configure the build
WORKDIR /usr/src/app/build

# Build your project
RUN cmake .. \
    && make

# Expose the port
EXPOSE 18080

# Adjust this path if your executable is in a different directory
CMD ["./cpp-image-processing"]
