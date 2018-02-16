var dbFind = require("../core/dbFind");
module.exports = {
    index: async function(req,res){
        var Website = require("../models/websites");
        if(req.session.search){
            var websites = await dbFind.searchSites({});
            for(var i = 0; i < req.session.search.length; i++){
                var docsArr = [];
                var arr = [];
                //Iterate through DB documents
                for(var x = 0; x < websites.length; x++){
                    //Iterate through document keywords
                    for(var y = 0; y < websites[x].keywords.length; y++){
                        //Check if keyword matches search query
                        if(websites[x].keywords[y].name.toLowerCase().indexOf(req.session.search[i].toLowerCase()) != -1){
                            //Check if result has already been found
                            if(arr.indexOf(websites[x]._id) == -1){
                                //Add document to data which will be sent to client side
                                docsArr.push({document:websites[x], relevance:websites[x].keywords[y].value});
                                arr.push(websites[x]._id)
                            }else{
                                //Make the website more important if multiple keywords are matched
                                docsArr[arr.indexOf(websites[x]._id)].relevance += websites[x].keywords[y].value
                            }
                        }
                    }
                }
            }
            res.render("search", {
                docs:docsArr.sort(function (a, b){
                    return b.relevance - a.relevance
                }), 
                session:req.session
            })
        }else{
            res.redirect("/")
        }
    }
}