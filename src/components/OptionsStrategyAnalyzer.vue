<template>
  <div class="options-strategy-analyzer">
    <h1 class="heading">Options Strategy Analyzer</h1>
    <form @submit.prevent="calculateRiskReward" class="options-form">
      <div v-for="(option, index) in options" :key="index" class="option-inputs">
        <input v-model.number="option.strike" placeholder="Strike Price" type="number" required />
        <input v-model.number="option.premium" placeholder="Premium" type="number" required />
        <select v-model="option.type" required>
          <option value="call">Call</option>
          <option value="put">Put</option>
        </select>
        <select v-model="option.position" required>
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
        <button type="button" @click="removeOption(index)" class="remove-button">Remove</button>
      </div>
      <!-- Buttons for adding and calculating -->
      <div class="form-buttons">
        <button type="button" @click="addOption" :disabled="options.length >= 4" class="add-button">Add Option</button>
        <button type="submit" class="calculate-button">Calculate</button>
      </div>
    </form>
    <!-- Display results and chart -->
    <div v-if="results" class="results">
      <line-chart :chart-data="chartData"></line-chart>
      <div class="result-details">
        <p>Max Profit: {{ results.maxProfit }}</p>
        <p>Max Loss: {{ results.maxLoss }}</p>
        <p>Break-even Points: {{ results.breakEvenPoints.join(', ') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue';
import LineChart from './LineChart.vue';

export default {
  name: 'OptionsStrategyAnalyzer',
  components: {
    LineChart
  },
  setup() {
    const options = reactive([
      { strike: 100, premium: 10, type: 'call', position: 'long' },
      { strike: 110, premium: 5, type: 'put', position: 'short' }
    ]);
    const results = ref(null);
    const chartData = ref({});

    const addOption = () => {
      if (options.length < 4) {
        options.push({ strike: null, premium: null, type: 'call', position: 'long' });
      }
    };

    const removeOption = (index) => {
      options.splice(index, 1);
    };

    const calculateRiskReward = () => {
      const underlyingPrices = Array.from({ length: 201 }, (_, i) => i); // Generate prices from 0 to 200
      const data = underlyingPrices.map(price => calculateTotalPL(price, options));
      
      const maxProfit = Math.max(...data);
      const maxLoss = Math.min(...data);
      const breakEvenPoints = underlyingPrices.filter((_, i) => data[i] === 0);

      results.value = {
        maxProfit,
        maxLoss,
        breakEvenPoints
      };

      chartData.value = {
        labels: underlyingPrices,
        datasets: [
          {
            label: 'Profit/Loss',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            data: data,
            fill: false,
          }
        ]
      };
    };

    const calculateTotalPL = (price, options) => {
      return options.reduce((totalPL, option) => {
        const strike = parseFloat(option.strike);
        const premium = parseFloat(option.premium);
        const type = option.type;
        const position = option.position;

        let pl = 0;
        if (type === 'call') {
          pl = position === 'long' ? Math.max(price - strike, 0) - premium : premium - Math.max(price - strike, 0);
        } else if (type === 'put') {
          pl = position === 'long' ? Math.max(strike - price, 0) - premium : premium - Math.max(strike - price, 0);
        }

        return totalPL + pl;
      }, 0);
    };

    watch(
      options,
      () => {
        calculateRiskReward();
      },
      { deep: true }
    );

    onMounted(() => {
      calculateRiskReward();
    });

    return {
      options,
      results,
      chartData,
      addOption,
      removeOption,
      calculateRiskReward
    };
  }
};
</script>

<style scoped>
.options-strategy-analyzer {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffffcc;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.heading {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.options-form {
  display: flex;
  flex-direction: column;
}

.option-inputs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.option-inputs input,
.option-inputs select {
  margin-right: 10px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  flex: 1;
}

.remove-button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.add-button,
.calculate-button {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.results {
  margin-top: 20px;
}

.result-details {
  margin-top: 10px;
}

canvas {
  width: 100%;
  height: 400px;
}
</style>
