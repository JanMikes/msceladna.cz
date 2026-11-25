# Use official nginx alpine image for minimal size
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create uploads directory (will be mounted as volume in production)
RUN mkdir -p /var/www/uploads

# Expose HTTP port
EXPOSE 80
# 2026-11-25: trigger-only commit for a security rebuild (nginx:alpine 1.31.10, Alpine 3.24.4); no functional change.
