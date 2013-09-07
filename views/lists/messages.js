define([
    "Underscore",
    "hr/hr",
    "vendors/markdown",
    "models/message",
    "utils/github"
], function(_, hr, markdown, Message, github) {
    var logging = hr.Logger.addNamespace("messages");

    // Collection
    var Messages = hr.Collection.extend({
        model: Message,
    });

    // List Item View
    var MessageItem = hr.List.Item.extend({
        className: "message-item",
        template: "lists/message.html",
        events: {
            "click .message-reply": "open"
        },
        templateContext: function() {
            return {
                object: this.model,
                content: markdown.toHTML(this.model.get("body") || "")
            }
        },
        render: function() {
            if (this.model.get("body") == null) {
                this.model.getBody().done(_.bind(this.render, this));
                return this;
            }
            if (this.model.get("author") == null) {
                this.model.getInfos().done(_.bind(this.render, this));
                return this;
            }
            return MessageItem.__super__.render.apply(this, arguments);
        },
        open: function(e) {
            if (e != null) {
                e.preventDefault();
                e.stopPropagation();
            }
            var Conversations = require("views/conversation");
            var conversation = new Conversations({
                "repo": this.model.repo,
                "path": this.model.get("path")
            });
            this.$(".sub-conversation").empty();
            conversation.$el.appendTo(this.$(".sub-conversation"));
            conversation.render();
        }
    });

    // List View
    var MessagesList = hr.List.extend({
        className: "list-messages",
        Collection: Messages,
        Item: MessageItem,
        defaults: _.defaults({
            loadAtInit: false
        }, hr.List.prototype.defaults),
    }, {
        Collection: Messages,
        Item: MessageItem
    });

    hr.View.Template.registerComponent("list.messages", MessagesList);

    return MessagesList;
});