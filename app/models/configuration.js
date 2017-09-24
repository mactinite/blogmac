var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate')

var Schema = mongoose.Schema;
var validator = require('validator');

var Configuration = new Schema({
    key: String,
    value: String,
});

Configuration.statics.updateConfiguration = function(configuration, new_value){
    new_value = new_value + "";
    configuration = configuration + "";
    return new Promise((resolve, reject) => {
        if (validator.isAscii(new_value)) {
            query = {key : configuration};
            this.update(query,{ $set :{ value : new_value}},(err) =>{
                if(err){
                    reject({error : "Database error, please try again later."});
                }
                else{
                    resolve({value: new_value , status : "SUCCESS"});
                }
            });
        }
        else{
            reject({error:"Invalid characters."});
        }
    });
};

Configuration.statics.getConfiguration = function(configuration){
    configuration = configuration + "";
    return new Promise((resolve, reject) => {
        query = {key : configuration};
        this.findOne(query,(err, result) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        });
    });
};


Configuration.plugin(mongoosePaginate);

mongoose.model('Configuration', Configuration);