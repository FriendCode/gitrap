define([
	"Underscore",
	"yapp/yapp",
	"vendors/base64",
	"models/repo",
	"models/user"
], function(_, yapp, Base64, Repo, User) {

	var Repos = yapp.Collection.extend({model: Repo});

	var Github = yapp.Class.extend({
		API_URL: 'https://api.github.com/',
		Repo: Repo,
		User: User,

		defaults: {
			auth: {}
		},

		/*
		 *	Constructor
		 */
		initialize: function() {
			Github.__super__.initialize.apply(this, arguments);
			this.logged = false;
			this.cache = yapp.Cache.namespace("github");
			this.user = new User();
			this.repos = new Repos();
			return this;
		},

		/*
		 *	Do a request to the api
		 */
		request: function(method, path, data, options) {
			var that = this;
			var d = new yapp.Deferred();
			var url = that.API_URL + path;

			options = _.extend({
				raw: false,
				cache: false
			}, options || {});

		    function cb(err, data) {
		    	if (options.cache) that.cache.set(url, data);
		    	if (err) return d.reject(err);
		    	return d.resolve(data);
		    }


		    if (options.cache) {
		    	var data = this.cache.get(url);
		    	if (data != null) {
		    		d.resolve(data);
		    		return d;
		    	}
		    }
		    
		    var xhr = new XMLHttpRequest();
		    if (!options.raw) {xhr.dataType = "json";}

		    xhr.open(method, url);
		    xhr.onreadystatechange = function () {
		        if (this.readyState == 4) {
		          if (this.status >= 200 && this.status < 300 || this.status === 304) {
		            cb(null, options.raw ? this.responseText : this.responseText ? JSON.parse(this.responseText) : true);
		          } else {
		            cb({request: this, error: this.status});
		          }
		        }
		    };
		    xhr.setRequestHeader('Accept','application/vnd.github.raw');
		    xhr.setRequestHeader('Content-Type','application/json');
		    if (that.options.auth != null && that.options.auth.username && that.options.auth.password) {
		           xhr.setRequestHeader('Authorization', 'Basic ' + Base64.encode(that.options.auth.username + ':' + that.options.auth.password));
		     }
		    data ? xhr.send(JSON.stringify(data)) : xhr.send();

		    return d;
		},

		/*
		 *	Login user
		 *	@username : (string)
		 *	@password : (string)
		 */
		login: function(username, password, options) {
			var that = this;

			this.options.auth = {
				username: username,
				password: password
			};
			this.cache = yapp.Cache.namespace("github:"+username);

			return this.getUser(null, _.extend({
				cache: true
			}, options || {})).done(function() {
				that.logged = true;
				that.trigger("logged", that.logged);
			});
		},

		/*
		 *	Get user by username
		 *	@username : (string)
		 */
		getUser: function(username, options) {
			var d = new yapp.Deferred();
			var user = username ? new User({}) : this.user;
			this.request("GET", username ? "users/"+username : "user").then(function(data) {
				user.set(data);
				d.resolve(user);
			}, function(err) { d.reject(err); });
			return d;
		},

		/*
		 *	Get repos for a user
		 *	@user : (string) username or (User) user object
		 */
		getRepos: function(user, options) {
			user = _.isString(user) ? user : user.get("login");
			var d = new yapp.Deferred();
			this.request("GET", "users/"+user+"/repos", null, options).then(function(data) {
				d.resolve(_.map(data, function(repo) {
					return new Repo({}, repo);
				}));
			}, function(err) { d.reject(err); });
			return d;
		},

		/*
		 *	Load repos for current user
		 */
		getUserRepos: function(options) {
			var that = this;
			options = _.extend({
				cache: true
			}, options || {});
			return this.getRepos(this.user, options).done(function(repos) {
				that.repos.reset(repos);
			});
		}
	});

	return new Github();
});