require([
    "Underscore",
    "yapp/yapp",
    "yapp/args",

    "models/repo",
    "models/message",
    "utils/github",
    "views/conversation",

    "views/views",
    "ressources/ressources"
], function(_, yapp, args, Repo, Message, github, ConversationView) {
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
            "click .main-toolbar .action-new-conversation": "newConversation",
            "submit .main-new-conversation": "startConversation"
        },

        /* Constructor */
        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);
            this.currentConversation = null;
            this.conversations = [];

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
            var parts, repo, that, maxconvs, conversation;
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
                maxconvs = _.max([1, Math.floor(that.$(".main-conversations").width()/600)]);
                console.log("max conv ", maxconvs);
                this.$(".main-body").removeClass("mode-newconversation");

                if (maxconvs == _.size(that.conversations)) {
                    that.conversations[0].remove();
                    that.conversations.splice(0, 1);
                }
                conversation = new ConversationView({
                    "ref": that.currentConversation,
                    "showPostMessage": _.size(parts) > 2
                });
                conversation.render();
                conversation.$el.appendTo(that.$(".main-conversations"));
                that.conversations.push(conversation)

                that.$("*[data-gitrap='"+that.currentConversation+"']").addClass("active");
                that.$("*[data-gitrap!='"+that.currentConversation+"']").removeClass("active");
            }, function(err) {
                console.log("error with repo", err);
            });
            
            return this;
        },

        /* (event) New conversation */
        newConversation: function(e) {
            if (e != null) e.preventDefault();
            this.$(".main-body").toggleClass("mode-newconversation");
        },

        /* (event) Start conversation */
        startConversation: function(e) {
            if (e != null) e.preventDefault();
            var title = this.$(".main-new-conversation .title").val();
            var content = this.$(".main-new-conversation .content").val();

            var message = new Message();
            message.post(this.currentConversation, title, content).then(_.bind(function() {
                this.$(".main-body").removeClass("mode-newconversation");
                this.$(".main-new-conversation .title").val("");
                this.$(".main-new-conversation .content").val("");
            }, this), function() {
                alert("error posting");
            });
        }
    });

    var app = new Application();
    app.run();
});