#!/bin/bash

docker build -t tetris-app .
docker run -p 8000:8000 -it tetris-app
