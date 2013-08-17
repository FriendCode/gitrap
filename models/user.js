define([
    "yapp/yapp",
    "models/github"
], function(yapp, GithubModel) {
    var User = GithubModel.extend({
        defaults: {

        },
    });

    return User;
});