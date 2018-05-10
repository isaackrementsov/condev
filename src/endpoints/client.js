var dbFind = require('../core/dbFind');
module.exports = {    
    index: async function(req,res){
        //Wait for queries to execute
        //Make sure that no sensitive user information is imported (such as passwords, credit card numbers)
        var user = await dbFind.find('User', {'username':req.params.username, dev:false}, {'password':false, 'creditCardNumber':false, '_id':false});
        var websites = await dbFind.search('Website', {'author':req.params.username});
        //Sort websites by date
        var websites = websites.reverse();
        res.render('client', {websites:websites, user:user, session:req.session})
    }
}