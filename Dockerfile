# use the official Python image from the Docker Hub
FROM python:3.9

# Set the working directory in the Docker container to /app
WORKDIR /app

# copy the dependencies file to the working directory
COPY requirements.txt .

# install dependencies
RUN pip install -r requirements.txt

# copy the content of the local src directory to the working directory
COPY . .

# comment out or delete the next line

