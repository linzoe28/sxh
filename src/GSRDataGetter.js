const DataGetter=require('./DataGetter.js');
class GSRDataGetter extends DataGetter{
    constructor(name, applicationId, clientId, interval){
        super(name, applicationId, clientId, interval);
        this.sample={"applicationId":applicationId,"content":JSON.parse("{\"data\":651}"),"readBy":["client1"],"timestamp":-1,"ttlMS":30000};
    }

    transform(data){
        if(this.useSample){
            let ret={
                data: Math.floor(Math.random()*700)+1
            };
            this.sample.content=ret;
            return this.sample;
        }else{
            return data;
        }
    }

    getFields(){
        return ["data"];
    }
}

module.exports=GSRDataGetter;