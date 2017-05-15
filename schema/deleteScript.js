const models = require('./schema');
models.Message.find({Room: "york 2622"}, function(err, documents){
  for(var i = 0; i < documents.length; i++){
    documents[i]["Room"] = "york 2722";
    documents[i].save();
  }
}).then(function(){
  console.log("I am done!");
});