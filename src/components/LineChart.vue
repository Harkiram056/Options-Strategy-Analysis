<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    const renderChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
      chartInstance = new Chart(canvas.value, {
        type: 'line',
        data: props.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Underlying Price at Expiration'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Profit/Loss'
              }
            }
          }
        }
      });
    };

    onMounted(() => {
      renderChart();
    });

    watch(
      () => props.chartData,
      () => {
        renderChart();
      },
      { deep: true }
    );

    return {
      canvas
    };
  }
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 400px;
}
</style>
