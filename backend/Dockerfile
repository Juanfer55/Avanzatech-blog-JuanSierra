# Use a Python base image
FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Copy your project files
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy your application code
COPY . .
