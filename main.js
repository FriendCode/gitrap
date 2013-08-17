require([
    "Underscore",
    "yapp/yapp",
    "yapp/args",

    "vendors/base64",

    "models/repo",
    "models/message",
    "utils/github",
    "views/conversation",

    "views/views",
    "ressources/ressources"
], function(_, yapp, args, Base64, Repo, Message, github, ConversationView) {
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
            ":owner/:name": "changeConversation",
            ":owner/:name/:sha": "changeConversation"
        },
        events: {
            "keyup .main-repos .search-query": "searchRepos"
        },

        /* Constructor */
        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);
            github.on("logged", this.render, this);
            this.repo = null;
            this.path = null;
            this.conversations = [];
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

        /* (event) Search repos */
        searchRepos: function(e) {
            var q = $(e.currentTarget).val();
            this.components.repos.search(q);
        },

        /* (event) Change current conversation */
        changeConversation: function(owner, name, path) {
            var that, conv, i, curl;
            that = this;
            this.conversationArgs = _.values(arguments);
            
            if (!github.logged) return this;

            if (this.repo != null
            && (this.repo.get("owner.login") != owner
            || this.repo.get("name") != name)) {
                this.clearConversations();
            }

            curl = owner+"/"+name;
            if (path != null) curl = curl+"/"+path;

            this.path = path == null ? "" : Base64.decode(path);
            this.repo = new github.Repo();
            this.repo.load(owner, name).done(function() {
                return that.repo.checkBranch("gitrap");
            }).then(function() {
                i = that.path.length == 0 ? 0 : _.size(that.path.split("/"));
                that.clearConversations(i);

                conv = new ConversationView({
                    "repo": that.repo,
                    "path": that.path
                });
                conv.render();
                conv.$el.appendTo(that.$(".main-conversations"));
                that.conversations[i] = conv;

                that.$("*[data-gitrap]").each(function() {
                    $(this).toggleClass("active", curl.indexOf($(this).data("gitrap")) === 0);
                });
            });
            
            return this;
        },

        /* Clear conversations */
        clearConversations: function(n) {
            var maxConvs = _.max([1, Math.floor(this.$(".main-conversations").width()/600)]);
            _.each(this.conversations, function(conversation, i) {
                if (n != null && i < n && i < maxConvs && i != n) return;
                conversation.remove();
                this.conversations.splice(i, 1);
            }, this);
        },
    });

    var app = new Application();
    app.run();
});