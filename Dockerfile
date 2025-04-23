FROM node:iron-slim


# Copy project to /app directory in docker image
WORKDIR /app
COPY . .

# Install dependencies
RUN npm install

# Start server
EXPOSE 3000
ENTRYPOINT npm start
