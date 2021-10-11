FROM node:16-alpine

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && yarn
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

# Define working directory
WORKDIR /app

# Add everything in the current directory to our image, in the 'app' folder.
ADD . /app
RUN yarn build

# Expose our server port.
EXPOSE 3000

# Run our app.
CMD ["npm", "start"]
