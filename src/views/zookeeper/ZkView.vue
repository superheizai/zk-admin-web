Vue.component('ZkView', {

<template>

    <div style="font: 0px/0px sans-serif;clear: both;display: block">

        <el-row>
            <el-col :span="12">

                <!--<el-button type="primary">增加</el-button>-->
                <!--<el-button type="primary">删除</el-button>-->
                <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                </el-input>
                <div class="grid-content bg-purple" style="max-height: 550px;overflow-y: auto;">

                    <el-tree :props="props" :load="loadNode" lazy="" highlight-current
                             :filter-node-method="filterNode"
                             ref="tree2"
                             @node-click="handleNodeClick"
                    >
                    </el-tree>
                    {{message}}


                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple-light">

                    <!--<el-button type="primary">修改</el-button>-->

                    <el-input
                            placeholder="当前zk内容"
                            type="textarea"
                            ref="input"
                            :rows="10">
                    </el-input>
                    <el-input
                            placeholder="zk节点元信息"
                            type="textarea"
                            ref="zkmeta"
                            :rows="15">
                    </el-input>
                </div>
            </el-col>
        </el-row>
    </div>

</template>
<script>
    import {trees} from '../../api/api';

    export default {
        props: ['message'],

        data() {
            return {
                options: [],
                filterText: '',
                props: {
                    label: 'name',
                    children: 'zones',
                    isLeaf: 'leaf'
                }

            };
        },
        watch: {
            filterText(val) {

//                this.$refs.tree2.filter(val);

                if (!val.trim()) {
                } else {

                    this.$refs.tree2.filter(val);
                }
            }
        },
        mounted() {
        },
        created() {
            this.newMessage = this.message;
        },
        methods: {


            filterNode(value, data) {
                if (!value.trim()) return false;
                return data.name.indexOf(value) !== -1;
            },

            handleNodeClick(data) {
                if (data.stat) {
                    this.$refs.zkmeta.setCurrentValue(JSON.stringify(data.stat, null, 2));
                }
                if (data.content) {
                    this.$refs.input.setCurrentValue(data.content);
                }
            }
            ,
            loadNode(node, resolve) {

                if (node.level === 0) {
                    return resolve([{name: 'zookeeper'}]);
                }

                let params = {name: this.newMessage, path: node.data.path}

                trees(params).then((res) => {
                    this.data = res.data.data.Children;
                    node.data.content = res.data.data.content;
                    node.data.stat = res.data.data.stat;
                    this.$refs.zkmeta.setCurrentValue(JSON.stringify(res.data.data.stat, null, 2));
                    this.$refs.input.setCurrentValue(res.data.data.content);
                    resolve(this.data);
                });

            }
        }
    }
    ;
</script>

})