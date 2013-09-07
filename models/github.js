define([
    "hr/hr"
], function(hr) {
    var GithubModel = hr.Model.extend({
    	/*
    	 *	Return api interface
    	 */
    	api: function() {
    		return require("utils/github");
    	}
    });
    return GithubModel;
});