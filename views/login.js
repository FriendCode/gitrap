define([
    "jQuery",
    "hr/hr",
    "utils/github"
], function($, hr, github) {

    var LoginView = hr.View.extend({
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
                username: hr.Storage.get("github-username"),
                password: hr.Storage.get("github-password")
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
            hr.Storage.set("github-username", username);
            hr.Storage.set("github-password", password);
        }
    });
    hr.View.Template.registerComponent("login", LoginView);

    return LoginView;
});