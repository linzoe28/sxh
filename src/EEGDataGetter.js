const DataGetter = require('./DataGetter.js');

class EEGDataGetter extends DataGetter {
    constructor(name, applicationId, clientId, interval) {
        super(name, applicationId, clientId, interval);
        this.sample = {
            "applicationId": applicationId, content: {
                attention: 62, meditation: 94, delta: 560015, theta: 106147, lowAlpha: 13925, highAlpha: 13565, lowBeta: 23628, highBeta: 9185,
                lowGamma: 544, highGamma: 3732, poorSignalLevel: 192, timeStamp: 1545288310936
            }, messageId: 1540456077988,
            readBy: ["client1"], timestamp: 1540456077988, ttlMS: 30000
        };
    }

    transform(data){
        if(this.useSample){
            let ret={
                attention: Math.floor(Math.random()*100)+1,
                meditation: Math.floor(Math.random()*100)+1, 
                delta: Math.floor(Math.random()*600000)+1, 
                theta: Math.floor(Math.random()*120000)+1, 
                lowAlpha: Math.floor(Math.random()*15000)+1, 
                highAlpha: Math.floor(Math.random()*15000)+1, 
                lowBeta: Math.floor(Math.random()*30000)+1, 
                highBeta: Math.floor(Math.random()*10000)+1,
                lowGamma: Math.floor(Math.random()*600)+1, 
                highGamma: Math.floor(Math.random()*4000)+1, 
                poorSignalLevel: Math.floor(Math.random()*255)+1
            };
            this.sample.content=ret;
            return this.sample;
        }else{
            return data;
        }
    }

    getFields() {
        return ["attention", "meditation", "delta", "theta", "lowAlpha", "highAlpha", "lowBeta", "highBeta", "lowGamma", "highGamma", "poorSignalLevel"];
    }
}

module.exports = EEGDataGetter;