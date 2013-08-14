require([
    "Underscore",
    "yapp/yapp",
    "yapp/args",

    "models/repo",
    "utils/github",

    "views/views",
    "ressources/ressources"
], function(_, yapp, args, Repo, github) {
    // Configure yapp
    yapp.configure(args);

    // Define base application
    var Application = yapp.Application.extend({
        name: "Gitrap",
        template: "main.html",
        metas: {
            "description": ""
        },
        links: {
            "icon": yapp.Urls.static("images/favicon.png")
        },
        routes: {
            "*actions": "changeConversation",
        },
        events: {
            "keyup .main-repos .search-query": "searchRepos",
            "click .main-toolbar .action-new-conversation": "newConversation"
        },

        /* Constructor */
        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);
            this.currentConversation = null;

            github.on("logged", this.render, this);
            return this;
        },

        /* Fnish rendering */
        finish: function() {
            if (this.currentConversation != null) this.changeConversation(this.currentConversation);
            return Application.__super__.finish.apply(this, arguments);
        },

        /* Context for template */
        templateContext: function() {
            return {
                "logged": github.logged,
                "user": github.user
            }
        },

        /* (event) Search repos */
        searchRepos: function(e) {
            var q = $(e.currentTarget).val();
            this.components.repos.search(q);
        },

        /* (event) Change current conversation */
        changeConversation: function(conversation) {
            var parts, repo, that;
            that = this;
            this.currentConversation = conversation;
            
            if (!github.logged) {
                return this;
            }
            parts = this.currentConversation.split("/");
            if (_.size(parts) < 2) { return this; }

            repo = new Repo();
            repo.load(parts[0], parts[1]).done(function() {
                return repo.initBranch("gitrap");
            }).then(function() {
                console.log("ready :)");
            }, function(err) {
                console.log("error with repo", err);
            });
            
            return this;
        },

        /* (event) New conversation */
        newConversation: function(e) {
            if (e != null) e.preventDefault();
            this.$(".main-body").toggleClass("mode-newconversation");
        }
    });

    var app = new Application();
    app.run();
});