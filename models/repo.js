define([
    "yapp/yapp",
    "utils/github"
], function(yapp, github) {
    var Repo = yapp.Model.extend({
        defaults: {

        },

        /*
         *	Load informations
         */
        load: function(username, reponame) {
        	var d = new yapp.Deferred();
        	var repo = github.api.getRepo(username, reponame);
        	repo.show(_.bind(function(err, repo) {
        		if (repo != null) {
        			this.set(repo);
        			d.resolve(repo);
        		} else {
        			d.reject(err);
        		}
        	}, this));

        	return d;
        },

        /*
         *	Get repo api
         */
        _repoApi: function() {
        	return github.api.getRepo(this.get("owner.login"), this.get("name"));
        },

        /*
         *	Check branch exists or create ir
         */
        initBranch: function(branch) {
        	var d = new yapp.Deferred();
        	var repo = this._repoApi();
            repo.listBranches(function(err, branches) {
                if (!_.contains(branches, branch)) {
                    // Branch  doesn't exists : create the branch
                    repo.getRef('heads/master', function(err, sha) {
                        if (sha != null) {
                            repo.createRef({
                              "ref": "refs/heads/"+branch,
                              "sha": sha
                            }, function(err) {
                                if (err == null) {
                                	d.reject(err);
                                } else {
                                	d.resolve();
                                }
                            });
                        }
                    });
                } else {
                	d.resolve();
                }
            });

            return d;
        }
    });

    return Repo;
});