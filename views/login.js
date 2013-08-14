define([
    "jQuery",
    "yapp/yapp",
    "utils/github"
], function($, yapp, github) {

    var LoginView = yapp.View.extend({
        tagName: "div",
        className: "login-box",
        template: "login.html",
        events: {
            "submit form": "submit"
        },

        initialize: function() {
            LoginView.__super__.initialize.apply(this, arguments);
            return this;
        },
        templateContext: function() {
            return {
                username: yapp.Storage.get("github-username"),
                password: yapp.Storage.get("github-password")
            }
        },

        /* (event) Submit login */
        submit: function(e) {
            e.preventDefault();

            var username = this.$("input[name='username']").val();
            var password = this.$("input[name='password']").val();

            // Login
            github.login(username, password);

            // Store username
            yapp.Storage.set("github-username", username);
            yapp.Storage.set("github-password", password);
        }
    });
    yapp.View.Template.registerComponent("login", LoginView);

    return LoginView;
});