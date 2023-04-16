# Running acceptance tests

## Setting up the application

1. Download the project folder

2. Make `/backend` your present working directory

3. Run `npm run start`

4. Make `/frontend` your present working directory

5. Run `npm run start`

## Acceptance Tests

### Note: These tests must be done in order

### Creating and Viewing a Post

1. Go to `http://localhost:3000/login`

2. Log in

   - For email, enter `user5@mail.com`
   - For password, enter `User12345`

3. Navigate to the `Write` option in the Navbar

4. Create a post using the Markdown editor

5. When done, to finalize click on `Submit`

   - After submitting, you will be redirected to your `profile`

6. Now navigate to the home screen using the `Home` tab in the Navbar

7. You should now be able to view the post you created in the Home feed

8. Click on the Text of the Post

   - This should redirect you to a page dedicated to the Post

9. Read the post and interact with it as you wish

10. When done, click the Logout button on the top right to end your session

### Being able to interact with posts

1. Go to "http://localhost:3000/login"

1. Log in

   - For email, enter "user100@mail.com"
   - For password, enter "User12345"

1. Click on any of the posts that appear on the Home page

   - Should send you to another page that shows the detailed post

1. Click on the Like button

   - The button should be filled afterwards
   - The number of likes should increase by 1

1. Click on the Like button again

   - The button should not be filled afterwards
   - The number of likes should decrease by 1

1. Click on the Comment button

   - The button should be filled afterwards
   - A textbox should show up below

1. Type anything you want in the textbox and click the Submit button

   - The comment you wrote should appear at the
     very bottom

1. Click the dropdown and select "Newest first"

   - The comment you wrote should now be at the very top

1. Click the Logout button on the top right

### Being able to share the post via a QR code

1. Log in

   - For email, enter "user100@mail.com"
   - For password, enter "User12345"

2. Click on any of the posts that appear on the Home page

   - This should send you to another page where the entire post is visible

3. Click on the Share button

   - A modal should show up with a QR code

4. Have your device (i.e., the device that runs the servers) scan the QR code

   - What I did was to use my phone to take a picture of the QR code. Then, I used my device's camera to scan the QR code from my phone
   - Go to the link provided by the QR code
   - Should send you to the Log in page (on a different tab)

5. Log in

   - For email, enter "user100@mail.com"
   - For password, enter "User12345"
   - After logging in, you should be sent directly to the page that showed the post you selected before

6. Click the Logout button on the top right
