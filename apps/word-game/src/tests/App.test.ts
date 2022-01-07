import { mount } from '@vue/test-utils'
import App from '../App.vue'


test('app is rendered', () => {
  const wrapper = mount(App)

  const routerView = wrapper.get('router-view')

  expect(routerView.isVisible()).toBe(true);
})