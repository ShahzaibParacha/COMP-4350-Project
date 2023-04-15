# Running acceptance tests

## Setting up the application

1. Download the project folder

2. Make `/backend` your present working directory

3. Run `npm run start`

4. Make `/frontend` your present working directory

5. Run `npm run start`

## Acceptance Tests

### Note: These tests must be done in order

### Being able to view the recommended posts

2. Log in

   - For email, enter "user5@mail.com"
   - For password, enter "User12345"

3. Click on the Recommended button

   - You should not see anything

4. Click on the Feed button

5. Click on the post that says "Banana Cream Cheesecake"

   - Like the post as described in posts.md

6. Go to the Home page and click on the Recommended button

   - You should see two posts: "Banana" and "Banana Chocolate Chip Muffins"

7. Click the Logout button on the top right
