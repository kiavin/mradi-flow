# Use Nginx as a base image
FROM nginx:alpine

# Copy the build files to the Nginx html directory
COPY dist /usr/share/nginx/html

# Copy custom Nginx configuration (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add gzip config to be included globally
COPY gzip.conf /etc/nginx/conf.d/gzip.conf

# Expose the port
EXPOSE 80

