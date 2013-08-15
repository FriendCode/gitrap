define([
    "jQuery",
    "yapp/yapp",
    "utils/github",
    "models/message"
], function($, yapp, github, Message) {

    var ConversationView = yapp.View.extend({
        tagName: "div",
        className: "conversation",
        template: "conversation.html",
        defaults: {
            showPostMessage: true,
            ref: null
        },
        events: {
            "submit .message-input": "postMessage"
        },

        initialize: function() {
            ConversationView.__super__.initialize.apply(this, arguments);
            return this;
        },
        templateContext: function() {
            return {
                options: this.options
            }
        },
        finish: function() {
            return ConversationView.__super__.finish.apply(this, arguments);
        },

        /* (event) Post message */
        postMessage: function(e) {
            if (e != null) e.preventDefault();
            var content = this.$(".message-input textarea").val();

            var message = new Message();
            message.post(this.options.ref, null, content).then(_.bind(function() {
                this.$(".message-input textarea").val("");
            }, this), function() {
                alert("error posting");
            });
        }
    });

    return ConversationView;
});