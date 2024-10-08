import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAudioStore = defineStore('audio', () => {
  const audio = ref(new Audio())
  const timer = ref(null)
  const playStatus = ref({
    currentTime: 0, // 当前播放时间
    duration: 0, // 总时长
    isPlay: false,
    // 暂停时的播放进度
    pauseTime: 0,
    // 计算的播放进度
    progress: 0,
    // 当前播放歌曲索引
    currentIndex: 0,
    // 播放模式
    mode: 'loop', // loop: 循环播放, random: 随机播放, single: 单曲循环
    // 播放顺序
    order: 'normal', // normal: 正常播放, reverse: 倒序播放
    // 播放顺序索引
    orderIndex: 0,
    isWaiting: false, // 是否正在等待播放
    isMute: false, // 是否静音
    isNext: false
  })
  const playList = ref([
  ])

  const addSong = (song) => {
    // 清除之前的播放进度
    playStatus.value.pauseTime = 0
    playList.value.push(song)
    playStatus.value.currentIndex = playList.value.length - 1
  }
  const play = () => {
    if (!Object.keys(playList.value[playStatus.value.currentIndex])) {
      message.error('暂无歌曲')
      return
    }
    audio.value.load()
    if (playStatus.value.pauseTime > 0) {
      audio.value.currentTime = playStatus.value.pauseTime
    }
    console.log(playList.value[playStatus.value.currentIndex].url)
    console.log(playStatus.value.currentIndex)
    console.log(playList.value.length)
    console.log(playList.value)
    audio.value.src = playList.value[playStatus.value.currentIndex].url
    audio.value.play()
  }

  const pause = () => {
    let timer = setInterval(() => {
      audio.value.volume -= 0.01
      if (audio.value.volume <= 1) {
        clearInterval(timer)
        audio.value.pause()
      }
    }, 100)
  }
  // 设置播放进度
  const setProgress = (progress, type = 'input') => {
    if (!playStatus.value.isPlay) {
      playStatus.value.pauseTime = playStatus.value.duration * (progress / 100)
    }
    // 防抖
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      if (type !== 'input') {
        audio.value.currentTime = progress
        return
      }
      // console.log('progress')
      audio.value.currentTime = playStatus.value.duration * (progress / 100)
    }, 100)
  }
  // 设置音量
  const setVolume = (volume) => {
    audio.value.volume = volume / 100
  }
  // 获取音频的播放时长
  audio.value.oncanplay = () => {
    console.info('进入可播放状态,音频总长度:' + audio.value.duration)
    playStatus.value.duration = audio.value.duration
  }
  // 开始播放
  audio.value.onplay = () => {
    playStatus.value.isNext = false
    audio.value.volume = 0// 默认音量
    playStatus.value.isPlay = true
    let timer = setInterval(() => {
      audio.value.volume += 0.01
      if (audio.value.volume >= 0.5) {
        clearInterval(timer)
      }
    }, 100)
    console.info('开始播放')
  }

  // 加载
  audio.value.onloadstart = () => {
    playStatus.value.isWaiting = true
    console.log('开始加载')
  }
  audio.value.onloadedmetadata = () => {
    playStatus.value.isWaiting = false
    console.info('加载完成')
  }
  audio.value.onwaiting = () => {
    // message.loading('缓冲中...')
    console.info('缓冲中...')
  }
  // 播放结束
  audio.value.onended = () => {
    playStatus.value.isPlay = false
    console.info('播放结束')
    playStatus.value.isNext = true
  }
  audio.value.onerror = () => {
    playStatus.value.isPlay = false
    console.info('播放出错')
    message.error('播放出错')
  }
  // 暂停播放
  audio.value.onpause = () => {
    playStatus.value.isPlay = false
    // console.info('暂停播放, 记录进度:' + audio.value.currentTime)
    // 记录播放进度
    playStatus.value.pauseTime = audio.value.currentTime
  }
  // 音频/视频（audio/video）的播放位置发生改变时触发
  audio.value.ontimeupdate = () => {
    // console.info('播放进度:' + audio.value.currentTime)
    playStatus.value.currentTime = audio.value.currentTime

    // 计算播放进度的百分比 进度条的百分比可以通过当前播放进度除以歌曲的总时长，然后乘以100来得到。
    const playProgress = audio.value.currentTime
    const duration = playStatus.value.duration
    // console.log('百分比' + (playProgress / duration) * 100)
    playStatus.value.progress = (playProgress / duration) * 100
  }
  // 上一曲
  const prev = () => {
    console.log('上一曲')
    if (playStatus.value.currentIndex === 0) {
      playStatus.value.currentIndex = playList.value.length - 1
    } else {
      playStatus.value.currentIndex--
    }
    play()
  }
  // 下一曲
  const next = () => {
    console.log('下一曲')
    if (playStatus.value.currentIndex === playList.value.length - 1) {
      playStatus.value.currentIndex = 0
    } else {
      playStatus.value.currentIndex++
    }
    play()
  }
  return {
    audio,
    play,
    pause,
    prev,
    next,
    addSong,
    playList,
    setVolume,
    playStatus,
    setProgress,
  }
})
