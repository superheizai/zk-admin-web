<template>
    <el-tabs type="border-card" v-model="editableTabsValue" @tab-remove="removeTab">>
        <el-tab-pane name="zookeeper">
            <span slot="label"><i class="el-icon-date"></i> zookeeper列表</span>


            <el-button type="primary" @click="addTab()">添加</el-button>

            <el-row>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <el-select v-model="value8" filterable placeholder="请选择"
                                   ref="cluster">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-button type="primary">增加</el-button>
                        <el-button type="primary">删除</el-button>
                        <el-input
                                placeholder="输入关键字进行过滤"
                                v-model="filterText">
                        </el-input>

                        <el-tree :props="props" :load="loadNode" lazy="" highlight-current
                                 :filter-node-method="filterNode"
                                 ref="tree2"
                                 @node-click="handleNodeClick"
                        >
                        </el-tree>


                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple-light">

                        <el-button type="primary">修改</el-button>


                        <el-input
                                placeholder="当前zk内容"
                                type="textarea"
                                ref="input"
                                :rows="2">
                        </el-input>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>

        <el-tab-pane
                v-for="(item, index) in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                closable
        >
            <!--这里使用动态绑定，传递select的v-model值-->
            <ZkView :message="value8"/>
        </el-tab-pane>

        <!--<el-tab-pane label="消息中心" closable @tab-remove="removeTab">消息中心</el-tab-pane>-->
        <!--<el-tab-pane label="角色管理">角色管理</el-tab-pane>-->
        <!--<el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>-->
    </el-tabs>
</template>
<script>
    import {trees} from '../../api/api';
    import ZkView from './ZkView.vue'

    export default {

        components: {
            ZkView
        },
        name: "ZkTree",
        data() {
            return {
                options: [],
                value8:
                    '',
                filterText:
                    '',
                props:
                    {
                        label: 'name',
                        children:
                            'zones',
                        isLeaf:
                            'leaf'
                    }
                ,
                editableTabs: [],
                editableTabsValue: 'zookeeper',
                tabIndex:
                    1

            }
                ;
        },
        watch: {
            filterText(val) {
                if (!val.trim()) {
                    return;
                } else {

                    this.$refs.tree2.filter(val);
                }
            }
        },
        mounted() {
            this.value8 = this.options[0]
        },
        created() {
            this.load();
        },
        methods: {
            addTab() {


                let newTabName =
                    this.$refs.cluster.selectedLabel;


                let tabs = this.editableTabs;
                let existsTab = false
                tabs.forEach((tab, index) => {
                    if (tab.name === newTabName) {
                        this.editableTabsValue = tab.name;
                        existsTab = true;
                        return;
                    }
                });

                if (existsTab) {
                    return;
                }


                console.log("add tab " + newTabName);
                this.editableTabs.push({
                    title: newTabName,
                    name: newTabName,
                    content: newTabName
                });
                this.editableTabsValue = newTabName;
            },
            removeTab(targetName) {
                let tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue = activeName;
                this.editableTabs = tabs.filter(tab => tab.name !== targetName);
            },

            handleClusterChange(val) {
                console.log("cluster change " + val);
                for (var i = 0; i < this.$refs.tree2.store._getAllNodes().length; i++) {
                    this.$refs.tree2.store._getAllNodes()[i].expanded = false;
                }


            },
            load() {
                this.options = [{
                    value: '1',
                    label: '黄金糕'
                }, {
                    value: '2',
                    label: '双皮奶'
                }, {
                    value: '3',
                    label: '蚵仔煎'
                }, {
                    value: '4',
                    label: '龙须面'
                }, {
                    value: '5',
                    label: '北京烤鸭'
                }];
            },
            append(data) {
                const newChild = {id: id++, label: 'testtest', children: []};
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);
            },

            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            },

            filterNode(value, data) {
                if (!value.trim()) return true;
                return data.name.indexOf(value) !== -1;
            },

            handleNodeClick(data) {
                this.$refs.input.setCurrentValue(data.data);
            },
            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([{name: 'zookeeper'}]);
                }

                if (node.level > 2) {
                    return resolve([]);
                }

                let params =
                    trees(params).then((res) => {

                        this.data = res.data.data;
                        resolve(this.data);
                    });

            }
        }
    };
</script>

<style>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
