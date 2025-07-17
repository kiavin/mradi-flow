import MainAssets from '~/bundles/MainAssets'

export default {
  install(app) {
    const components = MainAssets.getComponents()

    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component)
    })
  }
}
