define([
    "yapp/yapp",
    "models/github",
    "models/message"
], function(yapp, GithubModel, Message) {
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
            var d = new yapp.Deferred();
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
            var d = new yapp.Deferred();
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
         *  Create branche
         *  @name : name of the branc (ex: dev)
         *  @base : base ref (ex: heads/dev)
         */
        createBranche: function(name, base, options) {
            var that = this;
            var d = new yapp.Deferred();
            base = base || 'heads/master';
            this.getRef(base, options).done(function (sha) {
                d.resolve(that.createRef("refs/heads/"+name, sha.object.sha));
            }, function(err) { d.reject(err); })
            return d;
        },

        /*
         *  Create if not exists a branch
         *  @name : branche name to check
         */
        checkBranch: function(name, options) {
            var that = this;
            var d = new yapp.Deferred();
            this.listBranches(options).done(function(branches) {
                if (_.contains(branches, name)) return d.resolve();
                d.resolve(that.createBranche(name));
            }, function(err) { d.reject(err); });
            return d;
        },

        /*
         *  List tree for a sha
         *  @sha : sha for the tree
         */
        listTree: function(sha, options) {
            var d = new yapp.Deferred();
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
            var d = new yapp.Deferred();
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
            var d = new yapp.Deferred();
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
            var d = new yapp.Deferred();
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
    });

    return Repo;
});