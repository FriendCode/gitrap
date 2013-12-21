define([
    "hr/hr",
    "models/github",
    "models/message",
    "models/user"
], function(hr, GithubModel, Message, User) {
    var Repo = GithubModel.extend({
        defaults: {

        },

        /*
         *  Gte base repository path
         */
        _path: function(owner, name) {
            return "repos/"+this.get("owner.login", owner)+"/"+this.get("name", name);
        },

        /*
         *  Get infos about this repo
         */
        load: function(owner, name, options) {
            var that = this;
            var d = new hr.Deferred();
            this.api().request("GET", this._path(owner, name), null, _.extend({
                cache: true
            }, options || {})).then(function(data) {
                that.set(data);
                d.resolve(that);
            }, function(err) { d.reject(err); });
            return d;
        },

        /*
         *  List branches
         */
        listBranches: function(options) {
            var d = new hr.Deferred();
            this.api().request("GET", this._path()+"/git/refs/heads", null, _.extend({
                cache: true
            }, options || {})).then(function(heads) {
                d.resolve(_.map(heads, function(head) { return _.last(head.ref.split('/')); }));
            }, function(err) { d.reject(err); });
            return d;
        },

        /*
         *  Get the sha for a ref
         *  @ref : git ref
         */
        getRef: function(ref, options) {
            return this.api().request("GET", this._path()+"/git/refs/"+ref, null, _.extend({
                cache: true
            }, options || {}));
        },

        /*
         *  Create a ref
         *  @ref : git ref
         *  @sha : git sha
         */
        createRef: function(ref, sha, options) {
            return this.api().request("POST", this._path()+"/git/refs", {
                "sha": sha,
                "ref": ref
            }, _.extend({
                cache: false
            }, options || {}));
        },

        /*
         *  Get blob content
         *  @sha : git sha for the blob
         */
        getBlob: function(sha, options) {
            return this.api().request("GET", this._path()+"/git/blobs/"+sha, null, _.extend({
                cache: true,
                raw: "raw"
            }, options || {}));
        },

        /*
         *  Create a new commit
         *  @content : Blob content
         *  @encoding : encoding for content (base utf8)
         */
        createBlob: function(content, encoding, options) {
            encoding = encoding || "utf-8";
            return this.api().request("POST", this._path()+"/git/blobs", {
                "content": content,
                "encoding": encoding
            }, _.extend({
                cache: false
            }, options || {}));
        },

        /*
         *  Create a new tree
         *  @args.base_tree : (optional) String of the SHA1 of the tree you want to update with new data.
         *  @args.tree : Array of Hash objects (of path, mode, type and sha) specifying a tree structure
         */
        createTree: function(args, options) {
            return this.api().request("POST", this._path()+"/git/trees", args, _.extend({
                cache: false
            }, options || {}));
        },

        /*
         *  Create a new commit
         *  @message : String of the commit message
         *  @tree : String of the SHA of the tree object this commit points to
         *  @parents : Array of the SHAs of the commits that were the parents of this commit.
         */
        createCommit: function(message, tree, parents, options) {
            return this.api().request("POST", this._path()+"/git/commits", {
                "message": message,
                "tree": tree,
                "parents": parents
            }, _.extend({
                cache: false
            }, options || {}));
        },

        /*
         *  Create branch
         *  @name : name of the branch (ex: dev)
         *  @base : base ref (ex: heads/dev)
         */
        createBranch: function(name, base, options) {
            var that = this;
            var d = new hr.Deferred();

            if (base == null) {
                this.createTree({
                    "tree": [{
                      "path": "README.md",
                      "mode": "100644",
                      "type": "blob",
                      "content": "GitRap base branch"
                    }]
                }).done(function(tree) {
                    console.log("create tree ", tree);
                    return that.createCommit("Create base for GitRap", tree.sha, []);
                }).then(function(commit) {
                    console.log("create commit ", commit);
                    d.resolve(that.createRef("refs/heads/"+name, commit.sha));
                }, function(err) { d.reject(err); })
            } else {
                this.getRef(base, options).done(function (sha) {
                    d.resolve(that.createRef("refs/heads/"+name, sha.object.sha));
                }, function(err) { d.reject(err); });
            }
            return d;
        },

        /*
         *  Create if not exists a branch
         *  @name : branch name to check
         */
        checkBranch: function(name, create, options) {
            var that = this;
            var d = new hr.Deferred();
            this.listBranches(options).done(function(branches) {
                if (_.contains(branches, name)) return d.resolve();
                if (create) return d.resolve(that.createBranch(name));
                return d.reject();
            }, function(err) { d.reject(err); });
            return d;
        },

        /*
         *  List tree for a sha
         *  @sha : sha for the tree
         */
        listTree: function(sha, options) {
            var d = new hr.Deferred();
            this.api().request("GET", this._path()+"/git/trees/"+sha, null, _.extend({
                cache: true
            }, options || {})).then(function(data) {
                d.resolve(data.tree);
            }, function(err) { d.reject(err); });
            return d;
        },

        /*
         *  Get commits
         */
        getCommits: function(condition, options) {
            var d = new hr.Deferred();
            this.api().request("GET", this._path()+"/commits?"+$.param(condition), null, _.extend({
                cache: true
            }, options || {})).then(function(data) {
                d.resolve(data);
            }, function(err) { d.reject(err); });
            return d;
        },

        /*
         *  Get contents
         *  @ref : branch, sha, ...
         *  @path ; path to the file/dir
         */
        getContent: function(ref, path, options) {
            var d = new hr.Deferred();
            this.api().request("GET", this._path()+"/contents?ref="+ref+"&path="+path, null, _.extend({
                cache: true
            }, options || {})).then(function(data) {
                d.resolve(data);
            }, function(err) { d.reject(err); });
            return d;
        },

        /*
         *  List tree for a sha
         *  @branch : branch name
         *  @path : path to the file
         *  @content : content for the file
         *  @message : message for the commit
         */
        write: function(branch, path, content, message, options) {
            return this.api().request("PUT", this._path()+"/contents/"+path, {
                "branch": branch,
                "content": Base64.encode(content),
                "message": message
            }, _.extend({
                cache: false
            }, options || {}));
        },

        /*
         *  List messages for a sha
         *  @sha : sha for the tree
         */
        listMessages: function(path, options) {
            path = path || "";
            var that = this;
            var d = new hr.Deferred();
            this.getContent("gitrap", path, options).then(function(tree) {
                var messages = _.map(_.filter(tree, function(file) {
                    return file.type == "dir";
                }), function(file) {
                    return new Message({
                        "repo": that
                    }, {
                        "sha": file.sha,
                        "path": file.path
                    });
                });
                d.resolve(messages);
            }, function(err) { d.reject(err); });
            return d;
        },

        /*
         *  List collaborators
         */
        listCollaborators: function(options) {
            var d = new hr.Deferred();
            this.api().request("GET", this._path()+"/collaborators", null, _.extend({
                cache: true
            }, options || {})).then(function(collaborators) {
                d.resolve(_.map(collaborators, function(collaborator) { return new User({}, collaborator); }));
            }, function(err) { d.reject(err); });
            return d;
        },
    });

    return Repo;
});
