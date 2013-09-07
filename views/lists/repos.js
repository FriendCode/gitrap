define([
    "Underscore",
    "hr/hr",
    "models/repo",
    "utils/github"
], function(_, hr, Repo, github) {
    var logging = hr.Logger.addNamespace("repos");

    // List Item View
    var RepoItem = hr.List.Item.extend({
        className: "repo-item",
        template: "lists/repo.html",
        events: {
            "click": "open"
        },
        templateContext: function() {
            return {
                object: this.model,
            }
        },
        finish: function() {
            this.$el.attr("data-gitrap", this.model.get("owner.login")+"/"+this.model.get("name"));
            return RepoItem.__super__.finish.apply(this, arguments);
        },
        open: function() {
            hr.History.navigate(":username/:repo", {
                username: this.model.get("owner.login"),
                repo: this.model.get("name")
            });
        }
    });

    // List View
    var ReposList = hr.List.extend({
        className: "list-repos",
        Item: RepoItem,
        defaults: _.defaults({
            collection: github.repos
        }, hr.List.prototype.defaults),

        /* Constructor */
        initialize: function() {
            ReposList.__super__.initialize.apply(this, arguments);
            github.getUserRepos();
            return this;
        },
    }, {
        Item: RepoItem
    });

    hr.View.Template.registerComponent("list.repos", ReposList);

    return ReposList;
});