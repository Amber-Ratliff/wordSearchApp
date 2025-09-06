#!/bin/sh

# Copy the word list database to the mounted volume if it doesn't exist
if [ ! -f /data/wordList.db ]; then
    echo "Copying word list database to mounted volume..."
    cp /app/wordList.db /data/wordList.db
    echo "Word list database copied successfully"
else
    echo "Word list database already exists in mounted volume"
fi

# Copy the saved games database to the mounted volume if it doesn't exist
if [ ! -f /data/database.db ]; then
    echo "Copying saved games database to mounted volume..."
    cp /app/database.db /data/database.db
    echo "Saved games database copied successfully"
else
    echo "Saved games database already exists in mounted volume"
fi

# Start the application
exec npm start