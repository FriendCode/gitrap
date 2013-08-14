define([
    "yapp/yapp",
    "utils/github"
], function(yapp, github) {
    var Message = yapp.Model.extend({
        defaults: {
        	"title": "",
        	"content": "",
        	"author": {
        		"name": "",
        		"avatar": ""
        	},
        	"date": null
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

        	if (title != null) {
        		content = "# "+title+"\n\n"+content;
        	}

        	var path = parts.slice(2).join("/")+(new Date())+"/README.md";
        	console.log("create in path ", path, content);

        	repo.write('gitrap', path, content, 'GitRap message', function(err) {
        		if (err != null) {
        			d.reject();
        		} else {
        			d.resolve();
        		}
        	});
        	return d;
        }
    });

    return Message;
});