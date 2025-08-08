This is dynamic, responsive wordsearch app created using Node.js, Express.js and a Sqlite3 database. The database file is included and contains a list of 1000 words, seeded from hiroku's random word api.

I created this to learn and practice my skills, originally the PORT number was stored in a .env file- simply for practice. That's why it imports dotenv. It has CORS as a dependency because I needed to fix a CORS error while troubleshooting. It doesn't need it to run.

You can select words by clicking and dragging your mouse over the letters

You can clone this repo to run it. It does require Nodemon as a dev dependency to run. NPM run devstart.

In the future, I plan to add scoring functionality, puzzle completion tracking, and a button that fully resets the puzzle.

Note: some words may be NSFW.

It runs on port 3000.