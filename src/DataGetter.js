const request = require('request-promise');
const EventEmitter = require('events');
class DataGetter {
    constructor(name, applicationId, clientId, interval) {
        this.name = name;
        this.url = "http://imsofa.rocks:8080/LabUtils/ws/app-messages/" + applicationId + "/" + clientId;
        this.eventEmitter = new EventEmitter();
        this.interval = interval;
        this.sample = {};
        this.running = false;
    }

    start(useSample = false) {
        this.running = true;
        this.useSample = useSample;
        setTimeout(() => { this.processARound(); }, this.interval);
    }

    stop() {
        this.running = false;
    }

    transform(data) {
        return data;
    }

    processARound() {
        let p = request(this.url);
        if (!this.running) {
            setTimeout(() => { this.processARound(); }, this.interval);
        } else {
            if (this.useSample) {
                this.sample.timestamp = new Date().getTime();
                this.eventEmitter.emit('data', this.transform(this.sample));
                setTimeout(() => { this.processARound(); }, this.interval);
            } else {
                p.then(data => {
                    if ((""+data).length > 1) {
                        let o = JSON.parse(data);
                        o.content = JSON.parse(""+o.content);
                        let result = this.transform(o);
                        this.eventEmitter.emit('data', result);
                    }
                    setTimeout(() => { this.processARound(); }, this.interval);
                }).catch(err => {
                    setTimeout(() => { this.processARound(); }, this.interval);
                });
            }
        }
    }

    getFields() {
        return [];
    }

    on(event, callback) {
        this.eventEmitter.on(event, callback);
    }
}

module.exports = DataGetter;