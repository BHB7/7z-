import { createPinia } from 'pinia'
import piniaPlugins from 'pinia-plugin-persistedstate'
const pinia = createPinia()

pinia.use(piniaPlugins)

export default pinia

// 统一导入导出
export * from './modules/counter'
export * from './modules/audio'
export * from './modules/qqUser'
export * from './modules/wyUser'
export * from './modules/settings'
export * from './modules/kgUser'
export * from './modules/viewMsg' // 全局页面信息
export * from './modules/spotifyUser' // spotify 
