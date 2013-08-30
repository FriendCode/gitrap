[![Screen](https://raw.github.com/FriendCode/gitrap/master/ressources/images/logo.png)](https://raw.github.com/FriendCode/gitrap/master/ressources/images/logo.png)

Distributed Git based Forums.
======

> gitrap is for forums what gh-pages is for websites


[![Code Now](https://friendco.de/widgets/image/codenow?url=https%3A%2F%2Fgithub.com%2FFriendCode%2Fgitrap.git)](https://friendco.de/widgets/url/codenow?url=https%3A%2F%2Fgithub.com%2FFriendCode%2Fgitrap.git)

GitRap allows you to store conversations with your collaborators in your GIT repositories (in a specific branch named "gitrap").

This GitRap client runs entirely in your browser (no backend needed) and uses GitHub's API to read/write data to and from the branch "gitrap" of your repositories.
The concept of GitRap is not related to GitHub and can be used with any GIT repositories but not in this client-side application.

Try it: [friendcode.github.io/gitrap/](https://friendcode.github.io/gitrap/)

[![Screen Login](https://raw.github.com/FriendCode/gitrap/master/screens/login.png)](https://raw.github.com/FriendCode/gitrap/master/screens/login.png)
[![Screen Login](https://raw.github.com/FriendCode/gitrap/master/screens/start.png)](https://raw.github.com/FriendCode/gitrap/master/screens/start.png)
[![Screen Post](https://raw.github.com/FriendCode/gitrap/master/screens/first.png)](https://raw.github.com/FriendCode/gitrap/master/screens/first.png)
[![Screen Tree](https://raw.github.com/FriendCode/gitrap/master/screens/tree.png)](https://raw.github.com/FriendCode/gitrap/master/screens/tree.png)
[![Screen Message](https://raw.github.com/FriendCode/gitrap/master/screens/message.png)](https://raw.github.com/FriendCode/gitrap/master/screens/message.png)

## How does it work ?

### FileSystem layout

It's really simple : GitRap uses a separate branch named "gitrap" in the source repository to store all the conversations as trees

    [branch gitrap] /
        1377878509004/
            README.md   : content of the message
            photo1.jpg  : file Attachment
            photo2.jpg  : file Attachment
            1377878744650/  : sub-message 1
                README.md   : content of the sub message
            1377878744680/  : sub-message 2
                README.md   : content of the sub message
        1377878509104/
            README.md   : content of a second message

### Overall Design

[![Screen Design](https://raw.github.com/FriendCode/gitrap/master/screens/design.png)](https://raw.github.com/FriendCode/gitrap/master/screens/design.png)

## Install

This is a simple client-side application built using [yapp.js](https://github.com/FriendCode/yapp.js), you can use it at : [friendcode.github.io/gitrap/](https://github.com/FriendCode/gitrap).

Install and build on your local machine :

    git clone https://github.com/FriendCode/gitrap.git
    cd gitrap
    npm install .
    make

## Todo :

* File Attachments
* Interval refresh
* Improve UI design and messages design
* Correct messages order using commit date


