<template>
    <tree-grid
        :items='data'
        :columns='columns'
        @on-row-click='rowClick'
        @on-selection-change='selectionClick'
        @on-sort-change='sortClick'
      ></tree-grid>
</template>
<script>
    import TreeGrid from './TreeGrid'
    	import { firstRows, secondRows } from '../../api/api';
    export default {
        data() {
            return {
                columns: [{
                    type: 'selection',
                    width: '50',
                }, {
                    title: '编码',
                    key: 'code',
                    sortable: true,
                    width: '150',
                }, {
                    title: '名称',
                    key: 'name',
                    width: '150',
                }, {
                    title: '状态',
                    key: 'status',
                    width: '150',
                }, {
                    title: '备注',
                    key: 'remark',
                    width: '150',
                }, {
                    title: '操作',
                    type: 'action',
                    actions: [{
                        type: 'primary',
                        text: '编辑'
                    }, {
                        type: 'error',
                        text: '删除'
                    }],
                    width: '150',
                }],
                data:[]
            }
        },
        components: {
            TreeGrid
        },
        methods: {
            rowClick(data, index, event) {
                console.log('当前行数据:' + data)
                console.log('点击行号:' + index)
                console.log('点击事件:' + event)
            },
            selectionClick(arr) {
                console.log('选中数据id数组:' + arr)
            },
            sortClick(key, type) {
                console.log('排序字段:' + key)
                console.log('排序规则:' + type)
            },
           load() {
            				let para = {
            				};
            				this.listLoading = true;
            				//NProgress.start();

            				firstRows(para).then((res) => {
            				console.log('mock data is '+res.data)
            					this.data = res.data.data;

            					//NProgress.done();
            				});
            			},
            loadSecond(){
            }
        },
                     	mounted() {
                     	console.log('this is mounted');
                     			this.load();
                     		},
    }
</script>
