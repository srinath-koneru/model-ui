<script>
import { Line } from "vue-chartjs";

export default {
  name: "Chart",
  extends: Line,
  mounted() {
    this.renderChart(this.$attrs.chart, this.$attrs.options);
  },
  updated() {
    console.log("updated");
    this._data._chart.destroy();
    this.renderChart(this.$attrs.chart, this.$attrs.options);
  },
};
</script>
