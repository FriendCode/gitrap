define([
    "jQuery",
    "hr/hr",
    "utils/github",
    "models/message"
], function($, hr, github, Message) {

    var ConversationView = hr.View.extend({
        tagName: "div",
        className: "conversation",
        template: "conversation.html",
        defaults: {
            showPostMessage: true,
            repo: null,
            path: null
        },
        events: {
            "submit .message-input": "postMessage",
            "click .message-input .refresh": "actionRefresh"
        },

        initialize: function() {
            ConversationView.__super__.initialize.apply(this, arguments);
            this.repo = this.options.repo;
            return this;
        },
        templateContext: function() {
            return {
                options: this.options
            }
        },
        finish: function() {
            this.refreshMessages();
            return ConversationView.__super__.finish.apply(this, arguments);
        },

        /* Refersh messages list */
        refreshMessages: function(options) {
            this.repo.listMessages(this.options.path, options).done(_.bind(function(messages) {
                this.components.messages.collection.reset(messages);
            }, this));
        },

        /* Refersh all messages list */
        actionRefresh: function(e) {
            e.preventDefault();
            this.refreshMessages({
                cache: false
            });
        },

        /* (event) Post message */
        postMessage: function(e) {
            if (e != null) {
                e.preventDefault();
                e.stopPropagation();
            }
            var content = this.$(".message-input textarea").val();

            var message = new Message({repo: this.repo});
            message.post(this.options.path, content).then(_.bind(function() {
                this.$(".message-input textarea").val("");
                this.refreshMessages({
                    cache: false
                });
            }, this), function() {
                alert("Error posting");
            });
        }
    });

    return ConversationView;
});