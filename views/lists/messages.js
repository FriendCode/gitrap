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
        defaults: _.defaults({
            loader: "get",
            loaderArgs: [],
            limit: 10
        }, yapp.Collection.prototype.defaults),

        /*
         *  Load diffs using repository id and commit sha
         */
        get: function(ref) {
            var that = this;
            var message = new Message();
            var d = new yapp.Deferred();
            if (ref == null) {
                throw "Empty repoid or sha for getting diffs";
            }

            return message.loadChildren(ref).done(function(messages) {
                console.log("messages : ", messages);
                that.reset(messages);
            });
        },
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
                content: markdown.toHTML(this.model.get("content"))
            }
        },
        finish: function() {
            return MessageItem.__super__.finish.apply(this, arguments);
        },
        open: function() {
            yapp.History.navigate(this.model.get("ref"));
        }
    });

    // List View
    var MessagesList = yapp.List.extend({
        className: "list-messages",
        Collection: Messages,
        Item: MessageItem,
        defaults: _.defaults({
            
        }, yapp.List.prototype.defaults),

        loadByRef: function(ref) {
            this.collection.options.loaderArgs = [ref];
            return this.refresh();
        }
    }, {
        Collection: Messages,
        Item: MessageItem
    });

    yapp.View.Template.registerComponent("list.messages", MessagesList);

    return MessagesList;
});