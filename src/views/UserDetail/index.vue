<script setup>
import { useWyUserStore, useSettingsStore, useViewMsgStore } from '@/stores'
// 获取用户歌单
// wyy
import { getUserPlaylistService as getWyyUserPlaylistService } from '@/api/wyy/user'
// kg
import { getUserPlaylistService as getKgUserPlaylistService } from '@/api/kg/user'
import { FormOutlined } from '@ant-design/icons-vue'
import { onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import playListItem from './components/playListItem.vue'
import songListDetail from '@/components/songList/songListDetail.vue'
const wyUserStore = useWyUserStore()
const viewMsgStore = useViewMsgStore() // 全局视图信息
const settingsStore = useSettingsStore()
const route = useRoute()
const router = useRouter()
// tag默认选中
const activeKey = ref('1')
viewMsgStore.setCNavTitle(route.query.uid ? 'TA的歌单' : '我的')
const playList = ref([])
// 收藏的歌单
const collectPlayList = ref([])
switch (settingsStore.settings.apiSelect) {
  case 'wyy':
    getWyyUserPlaylistService(route.query.uid || wyUserStore.user.userInfo.userId).then((res) => {
      console.log(res)
      console.time('循环筛选收藏歌单 耗时')
      res.playlist.forEach((item) => {
        if (route.query.uid) {
          playList.value = res.playlist
          return
        }
        if (item.ordered) {
          console.log('收藏歌单')
          collectPlayList.value.push(item)
        } else {
          playList.value.push(item)
        }
      })
      viewMsgStore.setPlayListDetailIsLoaded(false) // 详情加载完成
      console.timeEnd('循环筛选收藏歌单 耗时')
    })
    break
  case 'kg':
    getKgUserPlaylistService().then((res) => {
      console.log(res)
    })
    break
}

// 跳转歌单详情
const goPlayListDetail = (item) => {
  if (item.name === `${wyUserStore.user.userInfo.nickname}喜欢的音乐`) {
    router.push('likedSongs')
    return
  }
  router.push({
    path: '/playListDetail',
    query: {
      id: item.id
    }
  })
}

// 当页面不可见时 destroyed，设置歌单详情加载状态false
onUnmounted(() => {
  console.log('离开歌单详情页')
  // viewMsgStore.setPlayListDetailIsLoaded(true)
})
</script>

<template>
  <songListDetail
    :list="route.query.uid ? playList[0].creator : wyUserStore.user.userInfo"
    :isUser="true"
    art="1"
  >
    <template #content>
      <h2>{{ route.query.uid ? 'TA创建的歌单' : '我创建的歌单' }}</h2>
      <div class="play-list">
        <playListItem
          class="item"
          v-for="item in playList"
          :item="item"
          @click="goPlayListDetail(item)"
        ></playListItem>
      </div>
      <h2 v-if="!route.query.uid">我收藏的歌单</h2>
      <div v-if="!route.query.uid" class="play-list">
        <playListItem
          class="item"
          v-for="item in collectPlayList"
          :item="item"
          @click="goPlayListDetail(item)"
        ></playListItem>
      </div>
    </template>
  </songListDetail>
</template>

<style lang="scss" scoped>
.main {
  height: 100vh;
  .header {
    display: flex;
    align-items: center;
    padding: 20px;
    .user-avatar {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user-info {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .r {
        margin-bottom: 10px;
      }
      .user-name {
        font-size: 20px;
        font-weight: 700;
        margin: 10px 0;
        .edit-icon {
          cursor: pointer;
          font-size: 20px;
          color: #999;
        }
      }
    }
  }
  // 内容
  .content {
    height: 100vh;
    .play-list {
      width: 100%;
      // height: 100%;
      margin: 10px 0;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 100px;
      // 每个歌单
      .item {
        margin-right: 20px;
        margin-top: 20px;
      }
    }
  }
}
</style>
