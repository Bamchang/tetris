# Use the official Python image from the Docker Hub
FROM python:3.9

# Set the working directory in the Docker container to /app
WORKDIR /app

# Install SQLite
RUN apt-get update && apt-get install -y sqlite3 libsqlite3-dev

# Install Node.js and npm
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY . .
