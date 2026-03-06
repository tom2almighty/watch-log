import { createWatchLogWidgetElement } from './widget-element'

const tagName = 'watch-log-widget'

if (!customElements.get(tagName)) {
  customElements.define(tagName, createWatchLogWidgetElement())
}

export { createWatchLogWidgetElement }
