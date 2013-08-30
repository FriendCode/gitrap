define([
    "jQuery",
    "yapp/yapp",
    "utils/github"
], function($, yapp, github) {

    var RepoInfosView = yapp.View.extend({
        tagName: "div",
        className: "repo-infos",
        template: "repoinfos.html",
        events: {

        },

        initialize: function() {
            var that = this;
            RepoInfosView.__super__.initialize.apply(this, arguments);
            this.collaborators = [];
            this.repo = this.options.repo;
            this.repo.listCollaborators().done(function(users) {
                that.collaborators = users;
                that.render();
            })
            return this;
        },
        templateContext: function() {
            return {
                repo: this.repo,
                collaborators: this.collaborators
            }
        },
    });

    return RepoInfosView;
});