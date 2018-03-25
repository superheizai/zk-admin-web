Vue.component('ZkView', {

<template>

    <div style="font: 0px/0px sans-serif;clear: both;display: block">

        <el-row>
            <el-col :span="12">

                <!--<el-button type="primary" @click.native="addNode">增加</el-button>-->
                <!--<el-button type="primary" @click.native="deleteNode">删除</el-button>-->
                <el-button type="primary" @click.native="refresh">刷新</el-button>
                <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                </el-input>
                <div class="grid-content bg-purple" style="max-height: 550px;overflow-y: auto;">

                    <el-tree :props="props" :load="loadNode" lazy="" highlight-current
                             :filter-node-method="filterNode"
                             node-key="path"
                             ref="tree2"
                             @node-click="handleNodeClick"
                    >
                    </el-tree>
                    {{message}}


                </div>
            </el-col>
            <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="30%"
            >
                <span>先选中一个树节点，才能操作添加/删除</span>
                <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
            </el-dialog>

            <!--新增界面-->
            <el-dialog title="新增" v-model="addNodeFormVisible" :close-on-click-modal="false" :before-close="closeAdd">
                <el-form :model="addNodeForm" label-width="80px" :rules="addNodeFormRules" ref="addNodeForm">
                    <el-form-item label="节点名" prop="name">
                        <el-input v-model="addNodeForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <el-input v-model="addNodeForm.content" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="closeAdd">取消
                        <!--<el-button @click.native="addNodeFormVisible = false">取消-->
                    </el-button>
                    <el-button type="primary" @click.native="handleAdd" :loading="addLoading">提交</el-button>
                </div>
            </el-dialog>
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
    import {trees, addZkNode, updateZkNode, deleteZkNode} from '../../api/api';

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
                },
                addNodeFormVisible: false,//新增界面是否显示
                dialogVisible: false,//错误提示是否显示
                addLoading: false,
                addNodeFormRules:
                    {
                        name: [
                            {required: true, message: '请输入节点名字', trigger: 'blur'}
                        ]
                    }
                ,
                //新增界面数据
                addNodeForm: {
                    name: '',
                    content: ''
                }

            }
                ;
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
            this.cluster = this.message;
            this.metaVersion = 0;
        },
        methods: {
            addNode: function () {
                if (this.currentNode == null) {

                    this.dialogVisible = true;
                } else {
                    this.addNodeFormVisible = true;
                }
            },
            closeAdd: function () {
                this.$refs['addNodeForm'].resetFields();
                this.addNodeFormVisible = false;
                this.addLoading = false;

            },

            filterNode(value, data) {
                if (!value.trim()) return false;
                return data.name.indexOf(value) !== -1;
            },
            handleNodeClick(data, node) {
                this.currentNode = node;
            },

            refresh() {

                let params = {name: this.cluster, path: this.currentNode.data.path}
                trees(params).then((res) => {
                    console.log(res);
                    console.log(this.data)
                    this.data = res.data.data.Children;
//                    this.currentNode.isLeaf = false
                    this.currentNode.data.content = res.data.data.content;
                    this.currentNode.data.stat = res.data.data.stat;
                    this.$refs.zkmeta.setCurrentValue(JSON.stringify(res.data.data.stat, null, 2));
                    this.$refs.input.setCurrentValue(res.data.data.content);
                    console.log(this.$refs.input);
                    console.log(this.$refs.tree2);
                    console.log(this.currentNode)
                    this.$refs.tree2.updateKeyChildren(this.currentNode.data.path, this.data);

                });


            }
            ,


            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            },
            handleAdd() {
                this.addLoading = true;
                //NProgress.start();
                let para = Object.assign({}, this.addNodeForm);
                console.log(para.path)
                if (para.path == undefined) {
                    para.path = "/" + para.name;
                } else {
                    para.path = this.currentNode.data.path + "/" + para.name;

                }
                para.cluster = this.cluster;
                parent = this;
                addZkNode(para).then((res) => {
                    this.addLoading = false;
                    this.addNodeFormVisible = false;
                    //NProgress.done();

                    console.log(this.$refs)
                    const newChild = {name: para.name, path: para.path, content: para.content, children: [], stat: ''};

                    parent.$refs['tree2'].children.push(newChild);
                    this.$refs['tree2'].children.push(newChild);

                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });


                }).catch((e) => {
//                        this.addLoading = false;
//                        this.$message({
//                            message: '添加失败',
//                            type: 'error'
//                        });

                    }
                );
                ;
            },


            loadNode(node, resolve) {

                if (node.level === 0) {
//                    return resolve([{name: 'zookeeper'}]);
                    return resolve([{name: '/'}]);
                }

                let params = {name: this.cluster, path: node.data.path}

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