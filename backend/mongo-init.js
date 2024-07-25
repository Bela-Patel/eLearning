// mongo-init.js
db = db.getSiblingDB('eLearningDB'); // use or create the database named 'packers_movers'

db.createCollection('courses', { capped: false });
db.createCollection('users', { capped: false });

print("Database and collections created.");