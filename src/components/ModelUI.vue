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
                <v-select
                  v-model="myCase"
                  :items="['My Own Case', 'Case 2']"
                  label="Case"
                />
              </v-col>
            </v-row>

            <h4 class="my-4">Loss Zone Information</h4>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="lossZoneType"
                  :items="['Natural Fracture', 'Fracture']"
                  label="Loss Zone Type"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="lossRate"
                  label="Loss rate"
                  placeholder="Loss rate (bph)"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="length"
                  label="Length"
                  placeholder="Length (ft)"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="depth"
                  label="Depth"
                  placeholder="Depth (ft)"
                />
              </v-col>
            </v-row>

            <h4 class="my-4">LCM</h4>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="fluid"
                  :items="['Natural Fracture', 'Fracture']"
                  label="Fluid"
                />
              </v-col>

              <v-col cols="3">
                <v-select
                  v-model="lcm"
                  :items="['Natural Fracture', 'Fracture']"
                  label="LCM"
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
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="finePorosity"
                  label="Fines Porosity"
                  placeholder="Fines Porosity"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="d50"
                  label="D50 Fines"
                  placeholder="D50 Fines"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="fraction"
                  label="Vol Fraction of fines"
                  placeholder="Vol Fraction of fines"
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
            <Chart :chart="pressureChartData" />
          </v-col>

          <v-col cols="12" v-if="show">
            <Chart :chart="rateChartData" />
          </v-col>

          <v-col cols="12" v-if="show">
            <Chart :chart="zoneChartData" />
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
  file = null;
  tab = null;
  myCase = "";
  items = ["1", "2", "3"];
  case = "";
  lossZoneType = "";
  lossRate = "";
  length = "";
  depth = "";
  fluid = "";
  lcm = "";
  cnoc = "";
  porosity = "";
  finePorosity = "";
  d50 = "";
  fraction = "";

  loading = false;
  show = false;

  rateChartData = {};
  rateChartOptions = {};

  pressureChartData = {};
  pressureChartOptions = {};

  zoneChartData = {};
  zoneChartOptions = {};

  uploadFile(): any {
    console.log(this.file);
  }

  loadChart() {
    this.loading = true;
    axios
      .get("http://localhost:5000/model/merlin_hydraulics/", {
        params: {
          CaseName: this.myCase,
          type: this.lossZoneType,
          rate: this.lossRate,
          length: this.length,
          perm: 0,
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
          label: "Pressure",
          borderColor: "#B96B00",
          backgroundColor: "transparent",
          data: Object.values(res.data.PumpingPressure),
        },
      ],
    };
  }

  loadRateChart(res: any) {
    this.rateChartData = {
      labels: Object.values(res.data.Volume),
      datasets: [
        {
          label: "Pump Rate",
          borderColor: "#B96B00",
          backgroundColor: "transparent",
          data: Object.values(res.data.PumpRate),
        },
        {
          label: "Return Rate",
          borderColor: "#00FF00",
          backgroundColor: "transparent",
          data: Object.values(res.data.ReturnRate),
        },
      ],
    };
  }

  loadZoneChart(res: any) {
    this.zoneChartData = {
      labels: Object.values(res.data.Volume),
      datasets: [
        {
          label: "Pump Rate",
          borderColor: "#B96B00",
          backgroundColor: "transparent",
          data: Object.values(res.data.PumpRate),
        },
        {
          label: "Return Rate",
          borderColor: "#00FF00",
          backgroundColor: "transparent",
          data: Object.values(res.data.ReturnRate),
        },
      ],
    };
  }
}
</script>
