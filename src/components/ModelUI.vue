<template>
  <v-container fluid style="height: 100%">
    <v-tabs v-model="tab">
      <v-tab>Hydraulic Model</v-tab>
      <v-tab>2D-Displacement Model</v-tab>
      <v-tab>3D-Displacement Model</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" style="height: 100%">
      <v-tab-item v-for="item in items" :key="item">
        <v-card flat>
          <v-container fluid>
            <h4 class="my-4">iCem Design Data</h4>
            <v-row>
              <v-col cols="3">
                <v-file-input
                  chips
                  label="Upload File"
                  truncate-length="30"
                  v-model="file"
                  @change="uploadFile"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="caseId"
                  label="Case"
                  placeholder="Case"
                  type="number"
                />
              </v-col>
            </v-row>

            <h4 class="my-4">Loss Zone Information</h4>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="lossZoneType"
                  :items="[
                    'Natural Fracture',
                    'Induced Fracture',
                    'High Perm Zone',
                    'High Perm Zone2',
                  ]"
                  label="Loss Zone Type"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="lossRate"
                  label="Loss rate"
                  placeholder="Loss rate (bpm)"
                  type="number"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="length"
                  label="Length"
                  placeholder="Length (ft)"
                  type="number"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="depth"
                  label="Depth"
                  placeholder="Depth (ft)"
                  type="number"
                />
              </v-col>
            </v-row>

            <h4 class="my-4">LCM</h4>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  v-model="fluid"
                  label="Fluid"
                  placeholder="Fluid ID"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="lcm"
                  label="LCM"
                  placeholder="LCM Name ID"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="cnoc"
                  label="Loading/Cnoc"
                  placeholder="Loading/Cnoc (lb/gal)"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="porosity"
                  label="Porosity"
                  placeholder="Porosity"
                  type="number"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="finePorosity"
                  label="Fines Porosity"
                  placeholder="Fines Porosity"
                  type="number"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="d50"
                  label="D50 Fines"
                  placeholder="D50 Fines"
                  type="number"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="fraction"
                  label="Vol Fraction of fines"
                  placeholder="Vol Fraction of fines"
                  type="number"
                />
              </v-col>
            </v-row>
          </v-container>

          <v-btn
            class="ma-2"
            :loading="loading"
            :disabled="loading"
            color="info"
            @click="loadChart"
          >
            Load Chart
            <template v-slot:loader>
              <span>Loading...</span>
            </template>
          </v-btn>
        </v-card>

        <v-row>
          <v-col cols="12" v-if="show">
            <Chart :chart="pressureChartData" :options="pressureChartOptions" />
          </v-col>

          <v-col cols="12" v-if="show">
            <Chart :chart="rateChartData" :options="rateChartOptions" />
          </v-col>

          <v-col cols="12" v-if="show">
            <Chart :chart="zoneChartData" :options="zoneChartOptions" />
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Chart from "@/components/Chart.vue";
import axios from "axios";
import { data } from "@/mock/data";

@Component({
  components: {
    Chart,
  },
})
export default class ModelUI extends Vue {
  file: any = null;
  tab = null;
  items = ["1", "2", "3"];
  caseId = 0;
  lossZoneType = "";
  lossRate = 5.75;
  length = 100;
  depth = 8046;
  fluid = "";
  lcm = "Bridgemaker_2";
  cnoc = "";
  porosity = 0.3;
  finePorosity = 0.3;
  d50 = "";
  fraction = 0.0;

  loading = false;
  show = false;

  rateChartData = {};
  rateChartOptions = {
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
            callback: function (tick: string) {
              return `${tick}, bpm`;
            },
            beginAtZero: true,
            padding: 16,
            fontColor: "#53565A",
            fontSize: 12,
            lineHeight: 0.1,
            fontStyle: "bold",
            maxTicksLimit: 6,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            callback: function (tick: string) {
              return `${tick}, bbl`;
            },
            padding: 16,
            fontColor: "#53565A",
            fontSize: 13,
            fontStyle: "bold",
            lineHeight: 1.5,
            maxRotation: 0,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10,
            source: "data",
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  pressureChartData = {};
  pressureChartOptions = {
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
            callback: function (tick: string) {
              return `${tick}, bpm`;
            },
            beginAtZero: true,
            padding: 16,
            fontColor: "#53565A",
            fontSize: 12,
            lineHeight: 0.1,
            fontStyle: "bold",
            maxTicksLimit: 6,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            callback: function (tick: string) {
              return `${tick}, bbl`;
            },
            padding: 16,
            fontColor: "#53565A",
            fontSize: 13,
            fontStyle: "bold",
            lineHeight: 1.5,
            maxRotation: 0,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10,
            source: "data",
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  zoneChartData = {};
  zoneChartOptions = {
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
          display: true,
          id: "rate",
          type: "linear",
          position: "right",
          ticks: {
            callback: function (tick: string) {
              return `${tick}, bpm`;
            },
            beginAtZero: true,
            padding: 16,
            fontColor: "#53565A",
            lineHeight: 0.1,
            max: 3,
            min: 0,
            fontStyle: "bold",
            maxTicksLimit: 7,
          },
        },
        {
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
          display: true,
          id: "pressure",
          type: "linear",
          position: "left",
          ticks: {
            callback: function (tick: string) {
              return `${tick}, psi`;
            },
            padding: 16,
            fontColor: "#53565A",
            fontSize: 12,
            lineHeight: 0.1,
            fontStyle: "bold",
            maxTicksLimit: 7,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            callback: function (tick: string) {
              return `${tick}, bbl`;
            },
            padding: 16,
            fontColor: "#53565A",
            fontSize: 13,
            fontStyle: "bold",
            lineHeight: 1.5,
            maxRotation: 0,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10,
            source: "data",
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  uploadFile(e: any): any {
    const formData = new FormData();
    formData.append("file", e);
    axios.post("http://localhost:5000/load", formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  }

  loadChart() {
    this.loading = true;
    axios
      .get("http://localhost:5000/model/merlin_hydraulics/", {
        params: {
          file_name: this.file.name,
          case_id: this.caseId,
          lzkwargs: {
            Type: this.lossZoneType,
            Rate: this.lossRate,
            Length: this.length,
            Depth: this.depth,
            Perm: 0,
          },
          lcmkwargs: {
            fluid_id: this.fluid,
            lcm_name_id: this.lcm,
            d50_fines: this.d50,
            po_lcm: this.porosity,
            por_fines: this.finePorosity,
            vol_fraction_fines: this.fraction,
            lcm_conc: this.cnoc,
          },
        },
      })
      .then((res) => {
        this.loadPressureChart(res);
        this.loadRateChart(res);
        this.loadZoneChart(res);
        this.show = true;
      })
      .catch(() => {
        this.loadPressureChart({ data });
        this.loadRateChart({ data });
        this.loadZoneChart({ data });
        this.show = true;
      })
      .finally(() => (this.loading = false));
  }

  loadPressureChart(res: any) {
    this.pressureChartData = {
      labels: Object.values(res.data.Volume),
      datasets: [
        {
          label: "Pressure, psi",
          borderColor: "#B96B00",
          backgroundColor: "transparent",
          data: Object.values(res.data.PumpingPressure),
          borderDash: [0, 0],
          pointRadius: 0.01,
        },
      ],
    };
  }

  loadRateChart(res: any) {
    this.rateChartData = {
      labels: Object.values(res.data.Volume),
      datasets: [
        {
          label: "Pump Rate, bpm",
          borderColor: "#B96B00",
          backgroundColor: "transparent",
          data: Object.values(res.data.PumpRate),
          borderDash: [0, 0],
          pointRadius: 0.01,
        },
        {
          label: "Return Rate, bpm",
          borderColor: "#00FF00",
          backgroundColor: "transparent",
          data: Object.values(res.data.ReturnRate),
          borderDash: [0, 0],
          pointRadius: 0.01,
        },
      ],
    };
  }

  loadZoneChart(res: any) {
    this.zoneChartData = {
      labels: Object.values(res.data.Volume),
      datasets: [
        {
          label: "Loss Zone Pressure, psi",
          borderColor: "#0700ff",
          backgroundColor: "transparent",
          data: Object.values(res.data.LossZonePressure),
          borderDash: [0, 0],
          pointRadius: 0.01,
          yAxisID: "pressure",
        },
        {
          label: "Loss Rate, bpm",
          borderColor: "#ff0026",
          backgroundColor: "transparent",
          data: Object.values(res.data.LossRate),
          borderDash: [0, 0],
          pointRadius: 0.01,
          yAxisID: "rate",
        },
      ],
    };
  }
}
</script>

<style lang="scss">
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
