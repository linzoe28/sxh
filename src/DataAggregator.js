const math = require('mathjs');
const EventEmitter=require('events');
var fs=null;
class DataAggregator{
    constructor(dataGetters, interval, csvPath=null, aggregator=math.mean){
        this.dataGetters=dataGetters;
        this.interval=interval;
        this.propertyBuffers={};
        this.eventEmitter=new EventEmitter();
        this.aggregator=aggregator;
        this.csvPath=csvPath;
        this.properties=[];
        this.minTime=-1;
        this.maxTime=-1;
 
        for(let dataGetter of dataGetters){
            for(let property of dataGetter.getFields()){
                this.propertyBuffers[dataGetter.name+property]=[];
            }
            dataGetter.on('data', data=>{
                if(this.minTime==-1 || data.timestamp<this.minTime){
                    this.minTime=data.timestamp;
                }
                if(this.maxTime==-1 || data.timestamp>this.maxTime){
                    this.maxTime=data.timestamp;
                }
                for(let property of dataGetter.getFields()){
                    let value=data.content[property];
                    let array=this.propertyBuffers[dataGetter.name+property];
                    array.push(value);
                }
            });
        }
        for(let key in this.propertyBuffers){
            this.properties.push(key);
        }
        if(this.csvPath!=null){
            fs=require('fs');
            fs.writeFileSync(this.csvPath, this.properties.join(",")+",timestamp");
        }
        setInterval(()=>{this.calculateMed();}, interval);
    }

    getDataGetters(){
        return this.dataGetters;
    }

    getProperties(){
        return this.properties;
    }

    calculateMed(){
        let ret={};
        for(let key in this.propertyBuffers){
            //validate the collected array
            if(this.propertyBuffers[key].length==0){
                return;
            }
        }

        let dataArray=[];
        for(let key in this.propertyBuffers){
            ret[key]=this.aggregator(this.propertyBuffers[key]);
            dataArray.push(ret[key]);
            this.propertyBuffers[key]=[];
        }
        let timestamp=Math.floor((this.minTime+this.maxTime)/2);
        //console.log("timestamp="+timestamp);
        if(isNaN(timestamp)){
            return;
        }
        dataArray.push(timestamp);
        let result={content: ret, timestamp: timestamp};
        this.eventEmitter.emit('data', result);
        ////////////////////////////////////
        if(this.csvPath!=null){
            fs.appendFileSync(this.csvPath, "\r\n"+dataArray.join(","));
        }
        ////////////////////////////////////
        this.minTime=-1;
        this.maxTime=-1;
    }

    on(event, callback){
        this.eventEmitter.on(event, callback);
    }
}

module.exports=DataAggregator;