
Vue.component("data-chart", {
    props: {
        aggregator:{
            type: Object
        },
        id:{
            type: String
        },
        datamapper:{//a function to pre process the collected data before rendering
            type: Function
        },
        mintick:{
            type: String,
            default: "0"
        },
        maxtick:{
            type: String,
            default: "100"
        }
    },
    mounted: function () {
        const colors = ["black", "blue", "red", "purple", "BlueViolet", "Brown", "CadetBlue",
            "DarkCyan", "green", "DarkSlateBlue", "DarkSlateGray", "DeepPink", "gray", "indigo",
            "skyblue", "orange", "yellow", "lightsalmon", "lawngreen", "limegreen", "steelblue",
            "thistle", "plum", "lightgray"];
        var labels = [];
        for(let getter of this.aggregator.getDataGetters()){
            for (let label of getter.getFields()) {
                labels.push(label);
            }
        }

        var startTime = 0;
        var ctx = document.getElementById(this.id);
        var dataConfigs = {};
        var datasets = [];
        var rawData = {};

        for (let i in labels) {
            let name = labels[i];
            dataConfigs[name] = {
                data: [],
                label: name,
                fill: false,
                backgroundColor: colors[i],
                borderColor: colors[i],
                borderWidth: 1
            };
            rawData[name] = [];
            datasets.push(dataConfigs[name]);
        }

        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                "labels": [],
                "datasets": datasets,
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            min: parseInt(this.mintick),
                            max: parseInt(this.maxtick)
                        }
                    }]
                },
                plugins: {
                    datalabels: {
                        display: function (context) {
                            return !context.dataset._meta[0].hidden;
                        }
                    }
                }
            }
        });

        let dataAggregator = this.aggregator;
        dataAggregator.on('data', data => {
            if (startTime == 0) {
                startTime = data.timestamp;
            }
            if(this.datamapper){
                data=this.datamapper(data);
            }
            if (myLineChart.data.labels.length >= 50) {
                myLineChart.data.labels.shift();
                for (let i in labels) {
                    myLineChart.data.datasets[i].data.shift();
                }
            }
            myLineChart.data.labels.push(Math.round((data.timestamp - startTime) / 1000));
            for (let i in labels) {
                myLineChart.data.datasets[i].data.push(data.content[labels[i]]);
            }
            myLineChart.update();
        });

        /*for(let getter of this.aggregator.getDataGetters()){
            getter.start(true);
        }*/
    },
    template: `
    <div>
        <canvas v-bind:id="id" width="100%" height="90%"></canvas>
    </div>
    `
});

Vue.component('test', {
    props: {
        a: {
            type: Object
        }
    },
    data: function () {
        return {
            count: 0
        }
    },
    methods: {
        hello: function () {
            return "hello";
        }
    },
    mounted: function () {
        /*console.log(this.$el);
        console.log(this.a);
        console.log(this.count);
        console.log(this.hello());*/
    },
    template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
});