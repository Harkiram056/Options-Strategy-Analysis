import { ref, watchEffect } from 'vue';
import LineChart from './LineChart.vue';

export default {
  components: {
    LineChart
  },
  setup() {
    const options = ref([
      { strike: 100, premium: 10, type: 'call', position: 'long' },
      { strike: 110, premium: 5, type: 'put', position: 'short' }
    ]);
    const results = ref(null);
    const chartData = ref({});

    const addOption = () => {
      if (options.value.length < 4) {
        options.value.push({ strike: null, premium: null, type: 'call', position: 'long' });
      }
    };

    const removeOption = (index) => {
      options.value.splice(index, 1);
    };

    const calculateRiskReward = () => {
      const underlyingPrices = Array.from({ length: 201 }, (_, i) => i); // Generate prices from 0 to 200
      const data = underlyingPrices.map(price => calculateTotalPL(price, options.value));
      
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
            data: data
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

    watchEffect(calculateRiskReward);

    return {
      options,
      results,
      chartData,
      addOption,
      removeOption
    };
  }
};
