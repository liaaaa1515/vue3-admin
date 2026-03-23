<script setup lang="ts">
// 引入 Vue 核心 API
import { onMounted, ref } from "vue"
// 引入虚拟列表组件和样式
import "vue-virtual-scroller/dist/vue-virtual-scroller.css"

// 1. 定义响应式数据
// 大数据列表（10万条）
const bigDataList = ref<any[]>([])
// 性能指标
const renderTime = ref(0) // 渲染耗时
const memoryUsage = ref(0) // 内存占用
const dataTotal = ref(0) // 数据总量
const visibleCount = ref(20) // 可视区域渲染数量（固定20条）
// 行悬浮索引
const hoverIndex = ref(-1)

// 2. 生成10万条测试数据（模拟后端返回的大数据）
function generateBigData() {
  // 记录开始时间（用于计算渲染耗时）
  const startTime = performance.now()

  // 生成10万条数据
  const tempList: any[] = []
  for (let i = 1; i <= 100000; i++) {
    tempList.push({
      id: i, // 唯一ID
      name: `用户${i}`, // 用户名
      phone: `138${Math.floor(Math.random() * 100000000)}`, // 手机号
      address: `北京市朝阳区${Math.floor(Math.random() * 100)}号`, // 地址
      createTime: new Date().toLocaleString() // 创建时间
    })
  }

  // 赋值给列表
  bigDataList.value = tempList
  // 更新数据总量
  dataTotal.value = tempList.length
  // 计算渲染耗时（四舍五入）
  renderTime.value = Math.round(performance.now() - startTime)
  // 计算内存占用（转换为MB）
  memoryUsage.value = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100
}

// 3. 页面挂载后执行数据生成
onMounted(() => {
  generateBigData()
})
</script>

<template>
  <!-- 大数据表格页面容器 -->
  <div class="big-data-table-container">
    <!-- Element Plus 卡片组件（和项目风格统一） -->
    <el-card
      title="高性能大数据表格（虚拟列表实现）"
      class="table-card"
      shadow="hover"
    >
      <!-- 性能指标展示区 -->
      <div class="performance-stats">
        <el-tag type="primary">
          数据总量：{{ dataTotal }} 条
        </el-tag>
        <el-tag type="success">
          渲染耗时：{{ renderTime }} ms
        </el-tag>
        <el-tag type="info">
          内存占用：{{ memoryUsage }} MB
        </el-tag>
        <el-tag type="warning">
          可视区域渲染：{{ visibleCount }} 条
        </el-tag>
      </div>

      <!-- 虚拟列表核心组件 -->
      <!-- item-size：每行高度（px）；key-field：唯一标识字段；height：列表容器高度 -->
      <VirtualScroll
        class="virtual-list-container"
        :items="bigDataList"
        :item-size="52"
        key-field="id"
        height="600px"
        :style="{ width: '100%' }"
      >
        <!-- 列表项模板（对应每一行数据） -->
        <template #default="{ item, index }">
          <div
            class="table-row"
            :class="{ 'row-hover': index === hoverIndex }"
            @mouseenter="hoverIndex = index"
            @mouseleave="hoverIndex = -1"
          >
            <!-- 表格列：ID、用户名、手机号、地址、创建时间 -->
            <div class="table-col col-id">
              {{ item.id }}
            </div>
            <div class="table-col col-name">
              {{ item.name }}
            </div>
            <div class="table-col col-phone">
              {{ item.phone }}
            </div>
            <div class="table-col col-address">
              {{ item.address }}
            </div>
            <div class="table-col col-time">
              {{ item.createTime }}
            </div>
          </div>
        </template>

        <!-- 空数据提示 -->
        <template #empty>
          <div class="empty-tip">
            暂无数据
          </div>
        </template>
      </VirtualScroll>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
// 页面容器样式
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

// 性能指标样式
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

// 表格行样式
.table-row {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 16px;
  border-bottom: 1px solid var(--el-border-color-light);
  box-sizing: border-box;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &.row-hover {
    background-color: var(--el-fill-color-light);
  }
}

// 表格列样式
.table-col {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.col-id {
    flex: 0 0 80px; // ID列固定宽度
  }

  &.col-name {
    flex: 0 0 120px; // 用户名列固定宽度
  }

  &.col-phone {
    flex: 0 0 150px; // 手机号列固定宽度
  }

  &.col-address {
    flex: 1; // 地址列自适应
  }

  &.col-time {
    flex: 0 0 180px; // 时间列固定宽度
  }
}

// 空数据提示
.empty-tip {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-placeholder);
  font-size: 14px;
}
</style>
