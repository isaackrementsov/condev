function opendiv(value, d){
    var div = document.getElementById(value);
    if(div.style.display == "block"){
        div.style.display = " none "
        if(d){
            d.parentElement.style.right = "0vw";
            d.parentElement.style.backgroundColor = "transparent";
            d.parentElement.style.color = "#474747";
            d.parentElement.innerHTML = `<i class="material-icons" onclick="opendiv('vertical', this)">menu</i>`
        }
    }else{
        div.style.display = "block ";
        if(d){
            d.parentElement.style.right = "16vw";
            d.parentElement.style.backgroundColor = "darkslategrey";
            d.parentElement.style.color = "white";
            d.parentElement.innerHTML = `<i class="material-icons" onclick="opendiv('vertical', this)">close</i>`
        }
    }
}
function opendivstrong(value){
    var div = document.getElementById(value);
    if(div.style.display == "block"){
        div.style.display = " none !important"
    }else{
        div.style.display = "block !important"
    }
}
function closediv(value){
    var div = document.getElementById(value);
    div.style.display = "none"
}
function openMany(div1, div2){
    opendiv(div1);
    closediv(div2)
}
var jobName = {
    elemType: "input",
    type: "text",
    placeholder: "Name (ex. 'Java dev')",
    class: "titleUpd jobName", 
} 
var numName = {
    elemType: "input",
    type: "number",
    placeholder: "Payment (USD)",
    class: "titleUpd numName"
}
function createDiv(atts, prnt){
    var elem = document.createElement(atts.elemType);
    for(key in atts){
        if(key !== "elemType"){
            var att = document.createAttribute(key);
            att.value = atts[key];
            elem.setAttributeNode(att);
        }
    }
    document.getElementById(prnt).appendChild(elem)
}
function multiExec(function1, function2, function3){
    function1;
    function2;
    function3
}
function amalg(cls, cls2, id){
    var array = document.getElementsByClassName(cls);
    var array2 = document.getElementsByClassName(cls2);
    var input = document.getElementById(id);
    var jobs = [];
    for(var i = 0; i < array.length; i++){
        jobs.push({name:array[i].value, payment:array2[i].value})
    }
    input.value = JSON.stringify(jobs)
}
function styleAtt(attribute, value){
    this.style[attribute] = value
}
var ajax = {
    GET: function(req, cb){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200) {
               if(cb){
                   var self = this;
                   cb(req, self)
               }
            }
        }
        xhttp.open('GET', req, true);
        xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
        xhttp.send()
    },
    POST: function(req){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200) {
               if(cb){
                   var self = this;
                   cb(req, self)
               }
            }
        }
        xhttp.open('POST', req, true);
        xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
        xhttp.send()
    }
}
window.onload = function(){
    document.getElementById('search').addEventListener('keyup', function(){ajax.GET('/?search=' + this.value, function(req, self){
        var container = document.getElementById('cont');
        var res = self.response;
        if(req.split('=')[1] && req.split('=')[1] != 'undefined'){
            var html = '';
            res = JSON.parse(res);
            for(let i = 0; i < res.length; i++){
                var end = res[i].document.description.split(' ').length < 10 ? '' : '...';
                html += 
                `<a href="/websites/${res[i].document._id}" class="shade result">
                    <h2>${res[i].document.name}</h2>
                    <p>${res[i].document.description.split(' ').slice(0, 10).join(' ')} ${end}</p>
                </a>`
            }
            container.innerHTML = html;
        }else{
            container.innerHTML = null;
        }
    })})
}
