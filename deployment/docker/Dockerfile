FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production || true

# Copy project
COPY . .

EXPOSE 3000

CMD ["node", "backend/server.js"]

