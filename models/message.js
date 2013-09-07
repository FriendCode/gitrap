define([
    "hr/hr",
    "vendors/base64",
    "models/github"
], function(hr, Base64, GithubModel) {
    var Message = GithubModel.extend({
        defaults: {
        	sha: null,
            path: null,
            body: null
        },

        /*
         *  Constructor
         */
        initialize: function() {
            Message.__super__.initialize.apply(this, arguments);
            this.repo = this.options.repo;
            return this;
        },

        /*
         *  Get url for a message
         */
        url: function() {
            return this.repo.get("owner.login")+"/"+this.repo.get("name")+"/"+Base64.encode(this.get("path"));
        },

        /*
         *  Post a message
         */
        post: function(path, content) {
            var that = this;
            var date = new Date();
            var newpath = ""+date.getTime()+"/README.md";
            newpath = (path != null && path.length > 0) ? path+"/"+newpath : newpath;

            return this.repo.write("gitrap", newpath, content, "GitRap message").done(function() {
                hr.Cache.clear();
            });
        },

        /*
         *  Get message body
         */
        getBody: function(options) {
            var that = this;
            var d = new hr.Deferred();
            this.repo.getContent("gitrap", this.get("path")+"/README.md", {
                "raw": true
            }).then(function(content) {
                that.set("body", content);
                d.resolve(content);
            }, function(err) { d.reject(err); })
            return d;
        },

        /*
         *  Get message infos
         */
        getInfos: function(options) {
            var that = this;
            var d = new hr.Deferred();
            this.repo.getCommits({
                "sha": "gitrap",
                "path": this.get("path")
            }, options).then(function(data) {
                that.set("author", data[0].author);
                that.set("date", data[0].commit.author.date);
                that.set("link", "https://github.com/"+that.repo.get("owner.login")+"/"+that.repo.get("name")+"/tree/gitrap/"+that.get("path"));
                d.resolve(data[0]);
            }, function(err) { d.reject(err); })
            return d;
        },


        /*
         *  List messages in this message
         *  @path : path for the tree
         */
        listMessages: function(path, options) {
            path = path || this.get("path");
            return that.repo.listMessages(path, options);
        },
    });

    return Message;
});