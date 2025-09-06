FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copy the database files to the app directory
COPY wordList.db /app/wordList.db
COPY database.db /app/database.db

# Copy and make entrypoint script executable
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

CMD ["/app/entrypoint.sh"]