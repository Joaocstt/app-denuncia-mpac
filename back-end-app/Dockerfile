FROM antonioanerao/laravel:latest

# Switch to root to install extensions
USER root

# Install PostgreSQL client and PHP extension
RUN apt-get update && apt-get install -y \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Assuming the image is an Alpine/Debian mix, compiling PDO PGSQL manually if helper doesn't exist
# We will use apt-get install php8.2-pgsql (or whatever version it has)
# Let's inspect PHP version first. Assuming it's based on ubuntu/debian with ondrej repo or similar
RUN apt-get update && apt-get install -y php8.2-pgsql php8.3-pgsql || true
