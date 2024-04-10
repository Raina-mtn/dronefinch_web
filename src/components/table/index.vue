<template>
	<div class="table-container">
		<el-table
      ref="tableRef"
			:data="list"
			:border="border"
			:stripe="stripe"
			v-bind="$attrs"
      scrollbar-always-on
			style="width: 100%;height: calc(100% - 40px);"
			@selection-change="onSelectionChange"
      @sort-change="onSortChange"
		>
      <!-- 多选 -->
			<el-table-column v-if="selection && list.length" type="selection" :reserve-selection="reserveSelection" width="30" :selectable="selectable" />
      <!-- 序号 -->
			<el-table-column v-if="showNum && list.length" align="center" label="序号" width="100" :fixed="numFixed" >
        <template  v-slot="scope">
          <slot name="numSlot" :row="scope.row" :num="scope.$index+1+((page.pageIndex-1)*page.pageSize)" :$index="scope.$index">
            <span style="margin-left: 10px">{{ scope.$index+1+((page.pageIndex-1)*page.pageSize) }}</span>
          </slot>
        </template>
      </el-table-column>
      <!-- slot自定义 -->
      <slot />
			<el-table-column
				v-for="item in columns"
        v-bind="item"
				:key="item.prop"
				:prop="item.prop"
				:label="item.label"
        :align="item.align||'center'"
			>
				<template v-slot="{ row, $index }">
					<w-table-item :row="row" :column="item" :index="$index" />
				</template>
			</el-table-column>
			<template #empty>
				<el-empty description="暂无数据" :image="NoContent" :image-size="250" />
			</template>
		</el-table>
		<el-pagination
      v-if="showPage"
      v-model:current-page="page.pageIndex"
      v-model:page-size="page.pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :layout="layout"
      :small="true"
      :background="pageBackground"
      @size-change="onHandleSizeChange"
      @current-change="onHandleCurrentChange"
      style="text-align: right; margin: 15px 20px;height: 40px;"
    >
    </el-pagination>
	</div> 
</template>

<script setup lang="ts" name="netxTable">
import WTableItem from './w-tableItem';
import { computed,ref } from 'vue';
import NoContent from '@/assets/images/noData.png';

// 表格 DOM 元素
const tableRef = ref();

// 定义父组件传过来的值
const props = defineProps({
  // 列表内容
  tableData: {
    type: Array<EmptyObjectType>,
    default: () => [],
  },
  // 表头内容
  columns: {
    type: Array<any>,
  },
  // 配置项
  config: {
    type: Object,
    default: () => {},
  },
  //边框
  border: {
    type: Boolean,
    default: true,
  },
  //斑马纹
  stripe: {
    type: Boolean,
    default: true,
  },
  //是否为多选
  selection: {
    type: Boolean,
    default: true,
  },
  //返回值用来决定这一行的 CheckBox 是否可以勾选
  selectable: {
    type: Function,
    default: () => {},
  },
  //数据刷新后是否保留选项
  reserveSelection: {
    type: Boolean,
    default: false,
  },
  //是否显示序号
  showNum: {
    type: Boolean,
    default: true,
  },
  //序号列标题
  // numTitle: {
  //   type: String,
  //   default: '序号'
  // },
  //是否固定序号列
  numFixed: Boolean,
  //是否显示页数等
  showPage: {
    type: Boolean,
    default: true,
  },
  //数据总数
  total: {
    type: Number,
    default: 0,
  },
  layout: {
    type: String,
    default: '->,total,sizes,prev, pager, next, jumper',
  },
  page: {
    type: Object,
    default: () => ({
      pageSize: 10,
      pageIndex: 1,
    }),
  },
  //控制pagination
  pageSizes: {
    type: Array,
    default () {
      return [10, 25, 50, 100];
    },
  },
  //是否显示pagination背景
  pageBackground: {
    type: Boolean,
    default:true,
  },
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['onSelectionChange','onSortChange','pageChange','sortHeader']);

//计算属性
const list = computed(() => {
  if (props.total || !props.showPage) {
    return props.tableData;
  }
  return props.tableData.filter((_, index) => {
    return (
      index >= (props.page.pageIndex - 1) * props.page.pageSize &&
          index < props.page.pageIndex * props.page.pageSize
    );
  });
});




//多选改变
const onSelectionChange = (row:object,event:object,column:object) => {
  emit('onSelectionChange', row,event,column);
};
//排序改变
const onSortChange = (row:object,event:object,column:object) => {
  emit('onSortChange', row,event,column);
};
// 分页改变
const onHandleSizeChange = (val: number) => {
  props.page.pageSize = val;
  emit('pageChange', props.page);
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
  props.page.pageIndex = val;
  emit('pageChange', props.page);
};
// 搜索时，分页还原成默认
const pageReset = () => {
  props.page.pageIndex = 1;
  props.page.pageSize = 10;
  emit('pageChange', props.page);
};

// 暴露变量
defineExpose({
  pageReset,
  element: tableRef,
});
</script>

<style scoped lang="scss">
.table-container {
	display: flex;
	flex-direction: column;
  width: 100%;
  background-color: #081F4D;
	.el-table {
		flex: 1;
	}
}
:deep(.el-table .cell.el-tooltip){
  white-space: pre-wrap !important;
}
:deep(.el-scrollbar__view){
  width: 100%;
}
:deep(.el-table__empty-text){
  height: 100%;
}
</style>
