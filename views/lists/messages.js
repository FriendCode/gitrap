define([
    "Underscore",
    "yapp/yapp",
    "vendors/markdown",
    "models/message",
    "utils/github"
], function(_, yapp, markdown, Message, github) {
    var logging = yapp.Logger.addNamespace("messages");

    // Collection
    var Messages = yapp.Collection.extend({
        model: Message,
    });

    // List Item View
    var MessageItem = yapp.List.Item.extend({
        className: "message-item",
        template: "lists/message.html",
        events: {
            "click .message-body": "open"
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
        open: function() {
            yapp.History.navigate(this.model.url());
        }
    });

    // List View
    var MessagesList = yapp.List.extend({
        className: "list-messages",
        Collection: Messages,
        Item: MessageItem,
        defaults: _.defaults({
            loadAtInit: false
        }, yapp.List.prototype.defaults),
    }, {
        Collection: Messages,
        Item: MessageItem
    });

    yapp.View.Template.registerComponent("list.messages", MessagesList);

    return MessagesList;
});