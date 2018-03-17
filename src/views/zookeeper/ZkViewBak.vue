Vue.component('ZkView', {

<template>


    <el-row>
        <el-col :span="12">
            <div class="grid-content bg-purple">

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
                    message: '',
                    label: 'name',
                    children: 'zones',
                    isLeaf: 'leaf'
                },
                editableTabs: [],
                tabIndex: 1

            };
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
        },
        created() {
            this.newMessage = this.message;
        },
        methods: {


            filterNode(value, data) {
                if (!value.trim()) return true;
                return data.name.indexOf(value) !== -1;
            },

            handleNodeClick(data) {
                this.$refs.input.setCurrentValue(data.data);
            },
            loadNode(node, resolve) {
                console.log('i got message ' + this.newMessage);
                if (node.level === 0) {
                    return resolve([{name: 'zookeeper'}]);
                }

                let params = {id: this.newMessage}

                trees(params).then((res) => {

                    this.data = res.data.data;
                    resolve(this.data);
                });

            }
        }
    };
</script>

})