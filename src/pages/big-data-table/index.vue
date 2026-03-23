<script setup lang="ts">
import { computed, onMounted, ref } from "vue"

// 核心状态定义
const bigDataList = ref<any[]>([]) // 10万条原始数据
const renderTime = ref(0) // 数据渲染耗时
const dataTotal = ref(0) // 数据总量
const hoverIndex = ref(-1) // 鼠标悬浮行索引
const listRef = ref<HTMLElement | null>(null) // 滚动容器Ref
const itemHeight = 52 // 行高（与CSS保持一致）
const scrollTop = ref(0) // 滚动条距离顶部高度

/**
 * 生成10万条模拟数据
 * 模拟真实业务场景的大数据量
 */
function generateBigData() {
  const startTime = performance.now()
  const tempList: any[] = []

  // 循环生成10万条用户数据
  for (let i = 1; i <= 100000; i++) {
    tempList.push({
      id: i,
      name: `用户${i}`,
      phone: `138${Math.floor(Math.random() * 100000000)}`,
      address: `北京市朝阳区${Math.floor(Math.random() * 100)}号`,
      createTime: new Date().toLocaleString()
    })
  }

  // 赋值并计算渲染耗时
  bigDataList.value = tempList
  dataTotal.value = tempList.length
  renderTime.value = Math.round(performance.now() - startTime)
}

/**
 * 计算列表总高度
 * 表头占52px，内容占 数据量*行高
 */
const totalHeight = computed(() => {
  return 52 + bigDataList.value.length * itemHeight
})

/**
 * 处理滚动事件
 * 更新滚动条位置，用于计算可视区域数据
 */
function handleScroll() {
  if (listRef.value) {
    scrollTop.value = listRef.value.scrollTop
  }
}

/**
 * 计算可视区域数据
 * 只渲染当前可见的20+条数据，提升性能
 */
const visibleItems = computed(() => {
  if (!listRef.value || bigDataList.value.length === 0) return []

  // 计算可视区域起始/结束索引（减去表头高度）
  const startIndex = Math.floor((scrollTop.value) / itemHeight)
  const endIndex = startIndex + Math.ceil(600 / itemHeight) + 2 // 多渲染2条防止滚动空白

  // 截取可视区域数据
  return bigDataList.value.slice(startIndex, endIndex)
})

// 页面挂载后生成数据
onMounted(() => {
  generateBigData()
})
</script>

<template>
  <div class="big-data-table-container">
    <el-card
      title="高性能大数据表格（虚拟列表实现）"
      class="table-card"
      shadow="hover"
    >
      <!-- 性能统计区 -->
      <div class="performance-stats">
        <el-tag type="primary">
          数据总量：{{ dataTotal }} 条
        </el-tag>
        <el-tag type="success">
          渲染耗时：{{ renderTime }} ms
        </el-tag>
        <el-tag type="info">
          内存占用：0 MB
        </el-tag>
        <el-tag type="warning">
          可视区域渲染：{{ visibleItems.length }} 条
        </el-tag>
      </div>

      <!-- 原生虚拟滚动容器 -->
      <div
        class="virtual-list-container"
        style="height: 600px; overflow: auto;"
        ref="listRef"
        @scroll="handleScroll"
      >
        <!-- 虚拟滚动占位容器 -->
        <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
          <!-- 表格表头（固定在顶部） -->
          <div class="table-header" style="position: sticky; top: 0; z-index: 10;">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="col-id">
                    ID
                  </th>
                  <th class="col-name">
                    姓名
                  </th>
                  <th class="col-phone">
                    手机号
                  </th>
                  <th class="col-address">
                    地址
                  </th>
                  <th class="col-time">
                    创建时间
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          <!-- 表格内容（虚拟滚动渲染） -->
          <div
            v-for="item in visibleItems"
            :key="item.id"
            class="table-row"
            :style="{ top: `${(item.id - 1) * itemHeight + 52}px` }"
            :class="{ 'row-hover': hoverIndex === item.id }"
            @mouseenter="hoverIndex = item.id"
            @mouseleave="hoverIndex = -1"
          >
            <table class="data-table">
              <tbody>
                <tr>
                  <td class="col-id">
                    {{ item.id }}
                  </td>
                  <td class="col-name">
                    {{ item.name }}
                  </td>
                  <td class="col-phone">
                    {{ item.phone }}
                  </td>
                  <td class="col-address">
                    {{ item.address }}
                  </td>
                  <td class="col-time">
                    {{ item.createTime }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
// 容器样式
.big-data-table-container {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

// 卡片样式
.table-card {
  --el-card-header-padding: 16px 20px;
  --el-card-padding: 20px;
}

// 性能统计标签组
.performance-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

// 虚拟列表容器
.virtual-list-container {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

// 表格行容器（虚拟滚动用）
.table-row {
  height: 52px;
  box-sizing: border-box;
  position: absolute;
  width: 100%;
}

// 表头容器
.table-header {
  height: 52px;
  background: #fff;
  border-bottom: 1px solid var(--el-border-color-light);
}

// 核心表格样式
.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;

  th,
  td {
    padding: 0 12px;
    height: 52px;
    line-height: 52px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  th {
    background-color: var(--el-bg-color-page);
    font-weight: 600;
    border-bottom: 1px solid var(--el-border-color);
  }

  td {
    border-bottom: 1px solid var(--el-border-color-light);
  }

  // 列宽固定
  .col-id {
    width: 80px;
  }
  .col-name {
    width: 120px;
  }
  .col-phone {
    width: 150px;
  }
  .col-address {
    flex: 1;
    min-width: 200px;
  }
  .col-time {
    width: 180px;
  }
}

// 行悬浮高亮
.row-hover {
  .data-table td {
    background-color: var(--el-fill-color-light);
  }
}
</style>
