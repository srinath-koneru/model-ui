<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  data: () => ({
    // chartdata: {
    //   labels: [33.54985064718,33.54985064718,33.54985064718,33.54985064718,33.54985064718,33.54985064718,33.54985064718,33.54985064718,33.54985064718,33.54985064718,33.54985064718,33.54985064718,49.20667809308326,49.42920417022505,49.646193935893706],
    //   datasets: [
    //     {
    //       label: "LOC",
    //       borderColor: "#B96B00",
    //       backgroundColor: "transparent",
    //       data: [0.0013248941244910191,0.008063460331539159,0.008063460331539159,0.008063460331539159,0.008063460331539159,0.008063460331539159,0.008063460331539159,0.008063460331539159,0.008063460331539159,0.008063460331539159,0.008063460331539159,0.008063460331539159,0.0006287148625708655,0.000008935747199873616,0.000008713431324003547],
    //     },
    //   ],
    // },
    options: {
      title: {
        display: true,
        text: "iCem",
      },
      legend: {
        color: "B96B00",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              stepValue: 0.5,
            },
          },
        ],
        xAxes: [
          {
            title: {
              text: "Time in min",
              display: true,
            },
            ticks: {
              maxTicksLimit: 10,
            },
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  }),

  mounted() {
    this.renderChart(this.$attrs.chart, this.options);
  },

  updated() {
    console.log("updated");
    this._data._chart.destroy();
    this.renderChart(this.$attrs.chart, this.options);
  },
};
</script>
