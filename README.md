[![Screen](https://raw.github.com/SamyPesse/gitrap/master/ressources/images/logo.png)](https://raw.github.com/SamyPesse/gitrap/master/ressources/images/logo.png)

Powerful discourse system running on top of Git/GitHub.
======

[![Code Now](https://friendco.de/widgets/image/codenow?url=https%3A%2F%2Fgithub.com%2FSamyPesse%2Fgitrap.git)](https://friendco.de/widgets/url/codenow?url=https%3A%2F%2Fgithub.com%2FSamyPesse%2Fgitrap.git)

GitRap allows you to store complete conversations with your collaborators into your GIT repository (into a specific branch named "gitrap").

This GitRap client runs in your browser (no backend needed) and use GitHub API to read/write data into the branch "gitrap" or yours repositories.
The concept of GitRap is not related to GitHub and can be used with any GIT repositories but not in this client-side application.

[![Screen Login](https://raw.github.com/SamyPesse/gitrap/master/screens/login.png)](https://raw.github.com/SamyPesse/gitrap/master/screens/login.png)
[![Screen Login](https://raw.github.com/SamyPesse/gitrap/master/screens/start.png)](https://raw.github.com/SamyPesse/gitrap/master/screens/start.png)
[![Screen Post](https://raw.github.com/SamyPesse/gitrap/master/screens/first.png)](https://raw.github.com/SamyPesse/gitrap/master/screens/first.png)
[![Screen Message](https://raw.github.com/SamyPesse/gitrap/master/screens/message.png)](https://raw.github.com/SamyPesse/gitrap/master/screens/message.png)
[![Screen Tree](https://raw.github.com/SamyPesse/gitrap/master/screens/tree.png)](https://raw.github.com/SamyPesse/gitrap/master/screens/tree.png)


## How does it work ?

It's really simple : GitRap use a separated branch named "gitrap" in the source repository to store all the conversations as trees :

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


## Installation

This is a simple client-side application build using [yapp.js](https://github.com/FriendCode/yapp.js), you can use it at : [samypesse.github.io/gitrap/](http://samypesse.github.io/gitrap/).

For installing on your machine and building the application :

    git clone https://github.com/SamyPesse/gitrap.git
    cd gitrap
    npm install .
    make


## Todo :

* File Attachments
* Interval refresh
* Improve UI design and messages design
* Correct messages order using commit date


