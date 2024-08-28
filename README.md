# Repository for COMP SCI 2207/7207 Web & Database Computing (2024 Semester 1)

**How to run the web application**
1. Clone the repository on the `main` branch.
2. Run the list of Starting Up commands below.
3. Port 8080 redirects to the public landing page.
4. Use back-up credentials below to log in to the Volunteer, Manager, or Admin interface.

----------------------------------------------------------------
# Starting up
**NPM list**

bcrypt@5.1.1, cookie-parser@1.4.6, cors@2.8.5, debug@2.6.9, dotenv@16.4.5, express-session@1.18.0, express@4.19.2, morgan@1.9.1, mysql@2.18.1, nodemailer@6.9.13,session@0.1.0

Packages that need to be installed
1. npm install express
2. npm install express-session
3. npm install bcrypt
4. npm install cookie-parser
5. npm install cors
6. npm install debug
7. npm install dotenv
8. npm install morgan
9. npm install mysql
10. npm install nodemailer
11. npm install side-channel

Once all packages are installed, enter the following commands to create the database in MySQL:

1. mysql
2. CREATE DATABASE voluntree;
3. exit

Lastly, to run the web application:

1. mysql -u root -p voluntree < voluntreeDump.sql
2. service mysql start  
3. npm start  

**Notes:**
- Database schema & queries are stored in `voluntree.sql`
- Backup of the final database is in `voluntreeDump.sql`

----------------------------------------------------------------
**Volunteer credentials**
Username: ml@gmail.com
Password: 123456Ml

**Manager credentials**
Username: hk@gmail.com 
Password: 123456Hk

**Admin credentials**
Username: js@yahoo.com
Password: 123456Js

Alternatively, a new volunteer or manager account can be created via the signup page. Admins can be added using the form on addAdmins.html.

**Ethereal credentials**
user: 'walton.ritchie39@ethereal.email',
pass: 'qg56wjaUWNCTutUbar'

----------------------------------------------------------------
# Features list
**Landing page**
- The landing page displays upcoming events and public updates.
- There is a navigation bar at the top of the page which users can use to navigate to other parts of the landing page.
- Clicking 'ABOUT US' redirects the user to a page detailing the company's values.
- Clicking 'NEWS' on the navigation bar redirects the user to a webpage where they can view all the latest public updates.
- Clicking 'LOCATION on the navigation bar redirects the user to a webpage where they can view all the current branch locations.
- Users can log in by clicking the user icon button on the top right. There is also a join button next to it for users to sign up.

**Volunteer Interface**
- Volunteer home displays volunteer's name, latest branch updates, and upcoming branch events.
- Volunteers can edit their information such as their name and change their branch in the edit profile section.
- Volunteers can view all events of all branches of the organization.
- Volunteers can only RSVP for events held by the branch that they are currently a member of.
- Volunteers can view private and public updates.
- Volunteers can receive subscribed email notifications (Ethereal).

**Manager Interface**
- Manager home displays statistics about the number of volunteers and managers for the manager's current branch.
- Managers can view a list of members in their branch.
- Managers can create a new event for the branch.
- Managers can view a list of upcoming and past events. They can check the RSVP list to see who RSVP'd and edit event information and delete events.
- Managers can create notifications and send emails to subscribed branch members.
- Managers can view and edit their profile by clicking the user icon on the top right of the webpage.

**Admin Interface**
- Admin home displays statistics about the organization.
- Admin can add new admins to the branch.
- Admins can view a list of all users (both volunteer and manager) in the organization, view and edit a user's information and remove a user.
- Admins can add users and assign them a volunteer or manager role.
- Admins can view all branches, view and edit branch information, and add a new branch.
- Admins can view and edit their profile by clicking the user icon on the top right of the webpage.

----------------------------------------------------------------
# Video Link Submission 

Here is the link to our Video Demonstration: https://www.youtube.com/watch?v=rwOkUNA5bL4&t=186s

----------------------------------------------------------------
Auto commit/push/sync to Github is disabled by default in this template repository.  
Enable the GitDoc extension to use this functionality (either in your VSCode settings or in the Dev Container settings) 
