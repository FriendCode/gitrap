define([
    "yapp/yapp",
    "utils/github"
], function(yapp, github) {
    var Message = yapp.Model.extend({
        defaults: {
        	"ref": "",
        	"path": "",
        	"content": "",
        	"author": {},
        	"date": null
        },

        /*
         *	Get repo api
         */
        _repoApi: function() {
        	var parts = this.get("ref").split("/");
            return github.api.getRepo(parts[0], parts[1]);
        },

        /*
         *	Get repo api
         */
        _ref: function() {
        	var parts = this.get("ref").split("/");
            return parts[2];
        },

        /*
         *	Post a message in a ref
         *	@ref
         *	@title
         *	@content
         */
        post: function(ref, title, content) {
        	var d = new yapp.Deferred();
        	var parts = ref.split("/");
        	var repo = github.api.getRepo(parts[0], parts[1]);
        	path = path || "";

        	if (title != null) {
        		content = "# "+title+"\n\n"+content;
        	}

        	var path = parts.slice(2).join("/")+"/"+(new Date())+"/README.md";
        	console.log("create in path ", path, content);

        	repo.write('gitrap', path, content, 'GitRap message', function(err) {
        		if (err != null) {
        			d.reject();
        		} else {
        			d.resolve();
        		}
        	});
        	return d;
        },

        /*
         *	Load messages infos
         */
        loadChildren: function(ref) {
        	ref = ref || this.get("ref");
        	var d = new yapp.Deferred();
        	var parts = ref.split("/");
            var repo = github.api.getRepo(parts[0], parts[1]);

            repo.getSha('gitrap', parts.slice(2).join("/"), function(err, sha) {
            	repo.getTree(sha, _.bind(function(err, data) {
	            	console.log("tree ", err, data);
	                if (err != null) {
	                	return d.reject(err);
	                }
	                return d.resolve(_.map(_.filter(data, function(file) {
	                	return file.type == "tree"
	                }), function(file) {
	                	var m = new Message({}, {
	                		"ref": parts[0]+"/"+parts[1]+"/"+file.path,
	                		"path": file.path
	                	});
	                	m.loadInfos();
	                	m.loadContent();
	                	return m;
	                }));
	            }, this));
            });
        	return d;
        },

        /*
         *	Load content
         */
        loadContent: function() {
        	var d = new yapp.Deferred();
        	var repo = this._repoApi();
        	repo.read('gitrap', this.get("path")+"/README.md", _.bind(function(err, data) {
        		this.set("content", data);
        	}, this));

        	return d;
        },

        /*
         *	Load content
         */
        loadInfos: function() {
        	var d = new yapp.Deferred();
        	var repo = this._repoApi();
        	repo.listCommits("gitrap", this.get("path"), _.bind(function(err, data) {
        		this.set("author", data[0].author);
        		d.resolve();
        	}, this));

        	return d;
        }
    });

    return Message;
});