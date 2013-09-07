define([
    "hr/hr",
    "models/github"
], function(hr, GithubModel) {
    var User = GithubModel.extend({
        defaults: {

        },
    });

    return User;
});