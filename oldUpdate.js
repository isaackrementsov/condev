Website.findOne({_id:req.params.websiteId}, function(err,doc){
            if(req.body.value){
                if(req.params.attr == "name"){
                    doc.name = req.body.value;
                    //Delete title keyword
                    doc.keywords = doc.keywords.filter(function(key){
                        return key.value !== 5
                    });
                    //Add new title
                    doc.keywords.push({name: req.body.value, value: 5});
                    doc.save()
                }else if(req.params.attr == "description"){
                    doc.keywords = doc.keywords.filter(function(key){
                        key.value !== 1
                    });
                    for(var y = 0; y < req.body.value.split(" ").length; y++){
                        if(illegalWords.indexOf(req.body.value.split(" ")[y].toLowerCase()[y]) == -1){
                            doc.keywords.push({name:req.body.value.split(" ")[y], value:1})
                        }                        
                    };
                    doc.description = req.body.value;
                    doc.save()
                }else if(req.params.attr == "keywords"){
                    for(var i = 0; i < req.body.value.split(",").length; i++ ){
                        doc.keywords.push({name:req.body.value.split(",")[i], value:2});
                    };
                    doc.keywords = doc.keywords.filter(function(key){
                        key.value !== 2
                    });
                    doc.save()
                }else if(req.body.number){
                    doc.jobs.push({name:req.body.value, payment:req.body.number});
                    doc.save()
                }
            }else if(req.params.attr.split("+")[0] == "jobs"){
                doc.jobs = doc.jobs.filter(function(key){
                    return key._id != req.params.attr.split("+")[1]
                });
                doc.save()
            }else if(req.params.attr.split("+")[0] == "applicant"){
                if(req.session.user && req.session.dev){
                    var job = doc.jobs.filter(function(key){
                        return key._id == req.params.attr.split("+")[1]
                    });
                    var nameCheck = job[0].applicants.filter(function(key){
                        return key.name == req.session.user
                    });
                    if(!nameCheck.length){
                        job[0].applicants.push({name:req.session.user});
                        doc.save()
                    }
                }else{
                    req.session.err = "You are not logged in as a developer!"
                }
            }
            res.redirect("/websites/" + doc._id)
        })      