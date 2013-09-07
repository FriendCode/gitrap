require([
    "Underscore",
    "hr/hr",
    "hr/args",

    "vendors/base64",

    "models/repo",
    "models/message",
    "utils/github",
    "views/conversation",
    "views/repoinfos",

    "views/views",
    "resources/resources"
], function(_, hr, args, Base64, Repo, Message, github, ConversationView, RepoInfosView) {
    // Configure hr
    hr.configure(args);

    // Define base application
    var Application = hr.Application.extend({
        name: "Gitrap",
        template: "main.html",
        metas: {
            "description": ""
        },
        links: {
            "icon": hr.Urls.static("images/favicon.png")
        },
        routes: {
            ":owner/:name": "changeConversation"
        },
        events: {
            "click .action-init-repo": "initRepo"
        },

        /* Constructor */
        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);
            github.on("logged", this.render, this);
            this.repo = null;
            this.conversationArgs = [];
            return this;
        },

        /* Fnish rendering */
        finish: function() {
            if (_.size(this.conversationArgs) > 1) {
                this.changeConversation.apply(this, this.conversationArgs);
            }
            return Application.__super__.finish.apply(this, arguments);
        },

        /* Context for template */
        templateContext: function() {
            return {
                "logged": github.logged,
                "user": github.user
            }
        },

        /* (event) Change current conversation */
        changeConversation: function(owner, name) {
            var that, conv, i, curl, repoInfos;
            that = this;
            this.conversationArgs = _.values(arguments);
            
            if (!github.logged) return this;

            curl = owner+"/"+name;

            this.repo = new github.Repo();
            this.repo.load(owner, name).done(function() {
                that.$("*[data-gitrap]").each(function() {
                    $(this).toggleClass("active", curl.indexOf($(this).data("gitrap")) === 0);
                });
            
                that.repo.checkBranch("gitrap").then(function() {
                    that.$el.removeClass("mode-init-repo");
                    that.$(".main-conversations").empty();

                    repoInfos = new RepoInfosView({
                        "repo": that.repo
                    });
                    repoInfos.render();
                    repoInfos.$el.appendTo(that.$(".main-repoinfos"));

                    conv = new ConversationView({
                        "repo": that.repo,
                        "path": null
                    });
                    conv.render();
                    conv.$el.appendTo(that.$(".main-conversations"));
                }, function() {
                    that.$el.addClass("mode-init-repo");
                });
            });
            
            return this;
        },

        /* Init repo */
        initRepo: function(e) {
            var that = this;
            if (e != null) e.preventDefault();
            hr.Cache.clear();
            this.repo.checkBranch("gitrap", true, {
                cache: false
            }).done(function() {
                that.changeConversation.apply(that, that.conversationArgs);
            });
        }
    });

    var app = new Application();
    app.run();
});