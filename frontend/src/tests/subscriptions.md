# Running acceptance tests

## Setting up the application

1. Download the project folder

2. Make `/backend` your present working directory

3. Run `npm run start`

4. Make `/frontend` your present working directory

5. Run `npm run start`

## Acceptance Tests

### Note: These tests must be done in order

### Being able to subscribe and unsubscribe

2. Log in

   - For email, enter "user5@mail.com"
   - For password, enter "User12345"

3. Click on the "Write" button on the nav bar

   - This will send you to a page where there is a markdown editor

4. Click the Submit button

5. Click the Logout button on the top right

6. Create an account by following the steps in user-account.md

   - Use the exact same information

7. Log in using this newly created account

8. Click on a post created by "user" ("user" is the username)

   - This should send you to another page where the entire post is visible

9. Click on the profile photo of the user who created the post

   - This will send you to a page that is awfully similar to your profile page
   - The difference is that this is the profile page of the user who created the post

10. Click on the Subscribe button on the right

    - The text should now be "Subscribed" instead of "Subscribe"
    - A "slashed" bell icon should show up as well

11. Click on the Subscribe button again

    - The text should now be "Subscribe" instead of "Subscribed"

12. Delete this account by following the steps in user-account.md

### Being able to receive email notifications

2. Log in

   - For email, enter "user5@mail.com"
   - For password, enter "User12345"

3. Click on the "Write" button on the nav bar

   - This will send you to a page where there is a markdown editor

4. Click the Submit button

5. Click the Logout button on the top right

6. Create an account by following the steps in user-account.md

   - For the email, use an email you have access to
   - As for the rest of the information, use the information provided in
     user-account.md

7. Log in using this newly created account

8. Click on a post created by "user" ("user" is the username)

   - This should send you to another page where the entire post is visible

9. Click on the profile photo of the user who created the post

   - This will send you to a page that is awfully similar to your profile page
   - The difference is that this is the profile page of the user who created the post

10. Click on the Subscribe button on the right

    - The text should now be "Subscribed" instead of "Subscribe"
    - A "slashed" bell icon should show up as well

11. Click on the "slashed" bell icon

    - The slash should disappear after this

12. Click the Logout button on the top right

13. Log in again

    - For email, enter "user5@mail.com"
    - For password, enter "User12345"

14. Click on the "Write" button on the nav bar

    - This will send you to a page where there is a markdown editor

15. Click the Submit button

16. Click the Logout button on the top right

17. Check your email (the one used to create the account)

    - You should receive a message containing the new post

18. Delete the account you created using your email by following the steps in user-account.md
