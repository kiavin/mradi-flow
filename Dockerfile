# Use multi-stage build to keep final image small
FROM nginx:alpine

# Copy built files from your local dist folder (built manually)
COPY dist /usr/share/nginx/html

# Custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]