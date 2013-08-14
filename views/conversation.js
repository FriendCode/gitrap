define([
    "jQuery",
    "yapp/yapp",
    "utils/github"
], function($, yapp, github) {

    var ConversationView = yapp.View.extend({
        tagName: "div",
        className: "conversation",
        template: "conversation.html",
        events: {
            
        },

        initialize: function() {
            ConversationView.__super__.initialize.apply(this, arguments);
            return this;
        },
        templateContext: function() {
            return {
                
            }
        },
        finish: function() {

            return ConversationView.__super__.finish.apply(this, arguments);
        }
    });

    return ConversationView;
});