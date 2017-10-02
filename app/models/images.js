var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
    name : String,
    uploadedBy : {
        username : String,
        email : String
    },
    uploadedOn : Date,
    altText : String,
    uri : String
});

Image.statics.AddImage = function(file, imageName, user, altText){
    return new Promise((resolve, reject) => {
        var image = new this();
        image.name = imageName;
        image.uploadedBy = {username : user.username, email : user.email};
        image.uploadedOn = new Date();
        image.altText = altText;
        uri = file.path;

        image.save(function(err){
            if(err){
                reject({error : "Could not save image"});
            }
            else{
                resolve({status : "success", uri : file.path});
            }
        })
    });
}

Image.statics.DeleteImage = function(id){
    //TODO
}



mongoose.model('Image',Image);