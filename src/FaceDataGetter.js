const DataGetter = require('./DataGetter.js');
class FaceDataGetter extends DataGetter {
    constructor(name, applicationId, clientId, interval) {
        super(name, applicationId, clientId, interval);
        this.sample = {
            "applicationId": applicationId, content: {
                mlel: 0.5,
                mrer: 0.6,
                nlml: 0.5,
                nrmr: 0.8,
                nlel: 0.5,
                nrer: 0.3
            }, messageId: 1540456077988,
            readBy: ["client1"], timestamp: 1540456077988, ttlMS: 30000
        };
    }

    transform(data){
        if(this.useSample){
            let ret={
                "mlel": Math.random(), 
                "mrer": Math.random(), 
                "nlml": Math.random(), 
                "nrmr": Math.random(), 
                "nlel": Math.random(), 
                "nrer": Math.random()
            };
            this.sample.content=ret;
            return this.sample;
        }else{
            return data;
        }
    }

    getFields() {
        return ["mlel", "mrer", "nlml", "nrmr", "nlel", "nrer"];
    }
}

module.exports = FaceDataGetter;