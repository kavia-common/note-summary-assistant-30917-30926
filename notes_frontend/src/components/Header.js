import Blits from '@lightningjs/blits'

export default Blits.Component('Header', {
  template: `
    <Element w="1920" h="100">
      <!-- Gradient top bar -->
      <Element x="0" y="0" w="1920" h="100" :color="{top: '#E8F0FF', bottom: '#ffffff'}" />
      <!-- Title row -->
      <Element x="80" y="24">
        <Text size="54" color="#111827" content="Ocean Notes" />
        <Text x="440" y="18" size="28" color="#2563EB" content="· Professional" />
      </Element>
      <!-- Underline accent -->
      <Element x="80" y="90" w="280" h="6" color="#2563EB" :effects="[$shader('radius', {radius: 3})]" />
    </Element>
  `,
})
