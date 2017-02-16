import { Meteor } from 'meteor/meteor';
const Future = Npm.require('fibers/future')
import { CustomWidgets } from '../imports/api/custom_widget.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
	"getWidgets": function(username,apikey,projectID) {
		console.log(username);
		console.log(apikey);
		console.log(projectID);
		var myWrapAsync = function (fn, context) {
		  var wrapped = Meteor.wrapAsync(fn, context);
		  return function (/* arguments */) {
		    try {
		      return wrapped.apply(context, _.toArray(arguments));
		    } catch (err) {
		      var newErr = new Error(err.message || err);
		      newErr["text"] = err;
		      throw newErr;
		    }
		  };
		};
		var get_widgets = myWrapAsync(CustomWidgets.getWidgets,CustomWidgets);
		try {
			var res = get_widgets(username,apikey,projectID);
		}
		catch (error) {
			return {"response":"error","message":error};
		}
		
		//CustomWidgets.getWidgets(username,apikey,projectID,function(error) { console.log(error);});
		
		return {"response":"success","widgets":res};
	}
})