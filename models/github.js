define([
    "yapp/yapp"
], function(yapp) {
    var GithubModel = yapp.Model.extend({
    	/*
    	 *	Return api interface
    	 */
    	api: function() {
    		return require("utils/github");
    	}
    });
    return GithubModel;
});