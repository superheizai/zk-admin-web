Vue.component('ZkView', {

<template>

    <div style="font: 0px/0px sans-serif;clear: both;display: block">

        <el-row>
            <el-col :span="12">
                <div class="grid-content bg-purple">

                    <!--<el-button type="primary">增加</el-button>-->
                    <!--<el-button type="primary">删除</el-button>-->
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

            arrayToJson(o) {
                var r = [];
                if (typeof o == "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
                if (typeof o == "object") {
                    if (!o.sort) {
                        for (var i in o)
                            r.push(i + ":" + arrayToJson(o[i]));
                        if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                            r.push("toString:" + o.toString.toString());
                        }
                        r = "{" + r.join() + "}";
                    } else {
                        for (var i = 0; i < o.length; i++) {
                            r.push(arrayToJson(o[i]));
                        }
                        r = "[" + r.join() + "]";
                    }
                    return r;
                }
                return o.toString();
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