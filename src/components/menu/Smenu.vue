<script setup>
import {
  SendOutlined,
  HeartOutlined,
  SearchOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
const route = useRoute()
const selectedKeys = ref([route.path])
watch(
  () => route.path,
  (newVal) => {
    selectedKeys.value = [newVal]
  }
)

const props = defineProps({
  isLogin: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="main">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      theme="light"
      mode="inline"
      style="background-color: #fff; margin-top: 10px; border: none"
    >
      <a-menu-item key="/recommended" @click="$router.push('/recommended')">
        <SendOutlined class="icon" />
        <span class="nav-text">为你推荐</span>
      </a-menu-item>
      <!-- <a-menu-item key="/search" @click="$router.push('/search')">
        <SearchOutlined class="icon" />
        <span class="nav-text">搜索</span>
      </a-menu-item> -->
      <a-menu-item-group title="我的" v-if="props.isLogin">
        <a-menu-item key="/likedSongs" @click="$router.push(`/likedSongs`)">
          <HeartOutlined class="icon" />
          <span class="nav-text">我喜欢的音乐</span>
        </a-menu-item>
      </a-menu-item-group>

      <a-menu-item key="/introduce" @click="$router.push(`/introduce`)">
        <InfoCircleOutlined class="icon" />
        <span class="nav-text">关于本项目</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<style lang="scss" scoped>
.main {
  // 样式穿透
  // 选中菜单状态
  &:deep(.ant-menu) {
    .ant-menu-item-selected {
      color: #fff;
      background-color: dodgerblue !important;
    }
    .ant-menu-item {
      margin-bottom: 20px;
    }
  }
}
</style>
