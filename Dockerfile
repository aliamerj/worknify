ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install --verbose

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000


# Run the application.
CMD npm run dev
