# Running acceptance tests

## Setting up the application

1. Download the project folder

2. Make `/backend` your present working directory

3. Run `npm run start`

4. Make `/frontend` your present working directory

5. Run `npm run start`

## Acceptance Tests

### Note: These tests must be done in order

### Being able to sign in and log in

1. Go to "http://localhost:3000/login"

2. Click on "Sign up" (it should be to the right of "Don't have an account?")

   - Should send you to the Sign up page

3. Fill the textboxes and click the Sign up button

   - For username, enter "theGOAT69"
   - For email, enter "theGOAT69@mail.com"
   - For password, enter "User12345"
   - Should send you to the Login page

4. Log in using the email and password

   - Should send you to the Home page

5. Click the Logout button on the top right

### Being able to manage user profile

2. Log in

   - For email, enter "theGOAT69@mail.com"
   - For password, enter "User12345"

3. Click the Profile button on the top right (to the left of Logout)

   - Should send you to the Profile page

4. Click the Edit Profile button

   - The text on the button you just clicked should be "Finish Editing" now
   - You should see some Pen icons and an Account Details section should show up at the bottom

5. Click on the Pen icon besides "Affiliation"

   - The icon should now be a Checkmark

6. Type "University of Manitoba" in the textbox and click the Checkmark icon

   - "University of Manitoba" should appear below "Affiliations"
   - The Checkmark icon should now be a Pen icon

7. Click on the Pen icon besides "Bio"

   - The icon should now be a Checkmark

8. Type "I am a fourth-year student taking COMP 4350" in the textbox and click the Checkmark icon

   - The text you typed should appear below "Bio"
   - The Checkmark icon should now be a Pen icon

9. Click on the Pen icon under your profile photo

   - The icon should now be a Checkmark

10. Click on the button that shows up, select an image, and click the Checkmark icon

    - The profile photo should be the file you chose
    - The Checkmark icon should now be a Pen icon

11. Click on the Pen icon on the same line as "Username"

    - The icon should now be a Checkmark

12. Type "theGOAT70" in the textbox and click the Checkmark icon

    - Your new username should be updated
    - You should see your new username under your profile picture as well as to the right of "Username"
    - The Checkmark icon should now be a Pen icon

13. Click on the Pen icon on the same line as "Password"

    - The icon should now be a Checkmark
    - Three textboxes should appear

14. Fill the texboxes and click the Checkmark icon

    - For old password, enter "User12345"
    - For new password, enter "Password5"
    - For the third textbox, enter "Password5"
    - After clicking the Checkmark icon, the icon should be a Checkmark

15. Click the Logout button on the top right

16. Log in

    - For email, enter "theGOAT69@mail.com"
    - For password, enter "User12345"
    - Should fail

17. Log in again

    - For email, enter "theGOAT69@mail.com"
    - For password, enter "Password5"

18. Click the Logout button on the top right

### Being able to manage preferences

2. Log in

   - For email, enter "user5@mail.com"
   - For password, enter "User12345"

3. Click on the "Write" button on the nav bar

   - This will send you to a page where there is a markdown editor

4. Click the Submit button

5. Click the Logout button on the top right

6. Log in

   - For email, enter "theGOAT69@mail.com"
   - For password, enter "User12345"

7. Click on a post created by "user" ("user" is the username)

   - This should send you to another page where the entire post is visible

8. Click on the profile photo of the user who created the post

   - This will send you to a page that is awfully similar to your profile page
   - The difference is that this is the profile page of the user who created the post

9. Click on the Subscribe button on the right

   - The text should now be "Subscribed" instead of "Subscribe"
   - A "slashed" bell icon should show up as well

10. Click on the "slashed" bell icon

    - The icon should now be just a bell

11. Click the Logout button on the top right

### Being able to delete an account

1. Log in

   - For email, enter "theGOAT69@mail.com"
   - For password, enter "Password5"

2. Click the Profile button on the top right (to the left of Logout)

3. Click the Edit Profile button

4. Click the Delete Account button on the bottom right

   - A modal will show up

5. Click the Deactivate button

   - This will send you to the Log in page

6. Log in again

   - For email, enter "theGOAT69@mail.com"
   - For password, enter "Password5"
   - Should fail
