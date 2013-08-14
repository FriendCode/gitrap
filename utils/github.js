define([
	"Underscore",
	"yapp/yapp",
    "vendors/github",
    "models/user"
], function(_, yapp, Github, User) {

	var GithubInt = yapp.Class.extend({
		/*
		 *	Constructor
		 */
		initialize: function() {
			GithubInt.__super__.initialize.apply(this, arguments);
			this.api = null;
			this.logged = false;
			this.repos = [];
			this.user = null;
			return this;
		},

		/*
		 *	Login an user
		 */
		login: function(username, password) {
			this.api = new Github({
				"username": username,
				"password": password,
				"auth": "basic"
			});
			var user = this.api.getUser();
			user.show(username, _.bind(function(err, user) {
				console.log("user ", user);
				this.user = new User({}, user);
				this.refreshRepos();
			}, this));

			return this;
		},

		/*
		 *	Login an user
		 */
		logout: function() {
			this.logged = false;
			this.trigger("logged", this.logged);

			return this;
		},

		/*
		 *	Refresh reposities list
		 */
		refreshRepos: function() {
			var user = this.api.getUser();
			user.repos(_.bind(function(err, repos) {
				this.repos = repos;
				this.logged = repos != undefined;
				this.trigger("logged", this.logged);
			}, this));

			return this;
		}
	});

	var github = new GithubInt();

	return github;
});