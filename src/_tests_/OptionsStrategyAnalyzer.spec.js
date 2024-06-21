import { mount } from '@vue/test-utils';
jest.mock('@/components/OptionsStrategyAnalyzer.vue', () => ({
    name: 'OptionsStrategyAnalyzer',
    template: '<div></div>',
}));
import OptionsStrategyAnalyzer from './components/OptionsStrategyAnalyzer.vue';

describe('OptionsStrategyAnalyzer', () => {
    it('renders correctly', () => {
        const wrapper = mount(OptionsStrategyAnalyzer);
        expect(wrapper.exists()).toBe(true);
    });

    it('adds an option correctly', async () => {
        const wrapper = mount(OptionsStrategyAnalyzer);
        const addButton = wrapper.find('.add-button');

        await addButton.trigger('click');
        expect(wrapper.vm.options.length).toBe(3);

        await addButton.trigger('click');
        expect(wrapper.vm.options.length).toBe(4);
    });

    it('removes an option correctly', async () => {
        const wrapper = mount(OptionsStrategyAnalyzer);
        const removeButtons = wrapper.findAll('.remove-button');

        await removeButtons[0].trigger('click');
        expect(wrapper.vm.options.length).toBe(1);
    });

    it('calculates risk/reward correctly', async () => {
        const wrapper = mount(OptionsStrategyAnalyzer);

        // Simulate adding options
        const addButton = wrapper.find('.add-button');
        await addButton.trigger('click');
        await addButton.trigger('click');

        await wrapper.find('.calculate-button').trigger('click');
        expect(wrapper.vm.results.maxProfit).toBe();
        expect(wrapper.vm.results.maxLoss).toBe();
        expect(wrapper.vm.results.breakEvenPoints).toEqual();
    });
});
