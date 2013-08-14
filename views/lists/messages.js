define([
    "Underscore",
    "yapp/yapp",
    "models/message"
], function(_, yapp, Message) {
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
            var self = this;
            if (ref == null) {
                throw "Empty repoid or sha for getting diffs";
            }
        },
    });

    // List Item View
    var MessageItem = yapp.List.Item.extend({
        className: "message-item",
        template: "lists/message.html",
        events: {
            
        },
        templateContext: function() {
            return {
                object: this.model,
            }
        },
        finish: function() {
            return MessageItem.__super__.finish.apply(this, arguments);
        },
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