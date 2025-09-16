# Use Nginx as a base image
FROM nginx:alpine

# Copy the build files to the Nginx html directory
COPY dist /usr/share/nginx/html

# Copy custom Nginx configuration (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

<<<<<<< HEAD
# Add gzip config to be included globally
COPY gzip.conf /etc/nginx/conf.d/gzip.conf

# Expose the port
EXPOSE 80

=======

# Expose the port
EXPOSE 80
>>>>>>> ac3f17028769793ca18098eabf0a0eb115006178
