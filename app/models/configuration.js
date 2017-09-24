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
            var query = {key : configuration},
            update = {value : new_value},
            options = {upsert : true};

            this.findOneAndUpdate(query, update, options,(err, result) =>{                
                if(!err){
                    if(!result){
                        result = new this();
                    }
                    result.save(function(err){
                        if(!err){
                            resolve({value: new_value , status : "SUCCESS"});
                        }
                        else{
                            reject({error : "Database error, please try again later."});
                        }
                    })
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