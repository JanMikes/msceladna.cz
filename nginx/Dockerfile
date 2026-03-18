# Use official nginx alpine image for minimal size
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create uploads directory (will be mounted as volume in production)
RUN mkdir -p /var/www/uploads

# Expose HTTP port
EXPOSE 80
