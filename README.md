# FizzGrid - Soft-Drink Review Website
## About
FizzGrid is a soft drink review website designed to allow users to rate and discover drinks-- think [Letterboxd](https://letterboxd.com/) or [goodreads](https://www.goodreads.com/) but for soda.
## Features
- Authentication - Users can login or create an account. Users must be logged in to access certain features
- Drink favorites - Users can add a drink to their "favorites" list
- Write a review - Users can choose a drink to write a review for, giving it a star rating, review, and optional image
- Comment on a review - Users can leave a comment on a specific review
- Likes - Users can "like" a review or comment
- Following/Followers - Users can "follow" each other
- Explore pages - Users can freely browse and search for drinks, users, and reviews
## Frontend Tech Stack (`/client`)
- TypeScript
- React
- TanStack Query
- Vitest (tests)
- React Testing Library (tests)
## Backend Tech Stack (`/server`)
- Python
- Django (with Django Rest Framework)
- unittest (tests)
## Deployment
This project is not yet live.

Additional notes
- Images are stored in an AWS S3 bucket
- PostgreSQL database is deployed with AWS RDS
## Run this project locally
Start the server*
```
$ cd server
$ pip install -r requirements.txt
$ python manage.py
```
Start the client
```
$ cd ..
$ cd client
$ yarn install
$ yarn dev
```
*Before starting the server you will need to either create a `.env` file to define environment variables used in `settings.py` or replace the variables with their explicit values
