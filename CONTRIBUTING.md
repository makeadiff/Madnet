# How to contribute to this project

First off, thanks for your interest in contributing to this project. Thank you for showing leadership through ownership in MAD Tech :-D

This guide assumes that you have a github account and a basic understanding of how Git works. If not, I'd recommend that you go thru [this guide](https://kbroman.org/github_tutorial/) first

## What Should I Help With

We have a list of open issues that we require help with in our [issue tracker in GitHub](https://github.com/makeadiff/Madnet/issues). Select one of the tasks there to start with. 

If you have not contributed to an GitHub project yet, this page will help you get you up to speed.

## Contributing if you are NOT a Make a Difference Volunteer

Since this tool is an internal app for our organization [Make a Difference](https://makeadiff.in), we were not expecting outside contributions. But I have been getting help from multiple people outside the organization - and we are very excited about it 😃. So here is a small introduction to our organization - and some additional help for you all...

Make a Difference(or MAD as we like to call it) is a 15+ year old Indian NGO. We work with children in need of care and protection. We have a volunteer base of 2000-3000 people who take classes and support the children in other ways. We use MADNet to track these interactions. To know more, visit our [website](https://makeadiff.in).

Since MADNet is an internal app, you need a login to access the app. Please use this to access the app...

- Username: forge.simulation@makeadiff.in
- Password: mad4ever

### Requirements

You'll need install these to work on this project...

- [Git](https://git-scm.com/) - Code Version control tool
- [NPM](https://nodejs.org/en/download/) - Package manager. Just install Node, NPM will be included with it.

## Setup

Go to the github page for [this project](https://github.com/makeadiff/Madnet) and click on the Fork button to the top right corner. This will create a copy of the repository in your personal account.

Now **clone the forked project to your system**. Open a terminal and run this command(You'll need to edit the command and add your username before running it)...

```
git clone git@github.com:YOUR_GITHUB_USERNAME/Madnet.git
```

**Install libraries** that MADNet depends on using NPM...

```
cd Madnet
npm install
```

Now you have the codebase on your system. At this point you can run the app...

```
npm start
```

## Submiting contributions

If you want to help us in developing the app, we are very happy to get more help. We have a list of open issues in our [issue tracker in GitHub](https://github.com/makeadiff/Madnet/issues). Select one of the tasks there to start. 

**Create a branch** that you will have your changes...

```
git checkout -b "YOUR_BRANCH_NAME"
```

Make all the changes you want to that branch. And **commit the changes**. PS: This will also run the linting tool to make sure your code is formated correctly.

```
git commit -am "DESCRIPTION OF THE CHANGES YOU MADE"
```

**Push the code to your remote repository** as and when needed

```
git push
```

Note: You might have to do this when pushing the branch for the first time...

```
git push --set-upstream origin YOUR_BRANCH_NAME
```

Once all the changes are made and you can **create a pull request**. This will notify the admin of the project to merge your code in with the master branch. You can do this by going to the project page on your account(eg. github.com/*your github username*/Madnet.git). There should be a '**Compare & pull request**' button at the top - click on that. Write a few comments on what the feature is about and submit the request.

Now the admin of the main repository will review your code and merge your feature branch into the main branch.

## Working with Others 

You'll need to sync your local repository with the main online repository. This will get you the code that other people are commiting to the repository. You do this by **adding the main repository as an 'upstream' branch**.

```
git remote add upstream git@github.com:makeadiff/Madnet.git
```

You can pull from the upsteam using these commands...

```
git fetch upstream
git merge upstream/master
```

## More Information

If you still have doubts, check out one of the following resources...

- [Video guide to this process](https://www.youtube.com/watch?v=8UguQzmswC4)
- [GitHub Guide - Hello World](https://guides.github.com/activities/hello-world/)
