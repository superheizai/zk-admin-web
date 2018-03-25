<template>
    <el-tabs type="border-card" v-model="editableTabsValue" @tab-remove="removeTab">
        <el-tab-pane name="zookeeper" label="zookeeper" key="zookeeper">
            <span slot="label"><i class="el-icon-date"></i> zookeeper列表</span>

            <section>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="filters">
                        <el-form-item>
                            <el-input v-model="filters.name" placeholder="集群名"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="filters.ip" placeholder="包含的一个IP"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getZks">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleAdd">新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <!--列表-->
                <el-table :data="zks" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                          style="width: 100%;">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="id" label="ID" width="60" sortable>
                    </el-table-column>
                    <el-table-column prop="name" label="集群名" width="120" sortable>
                    </el-table-column>
                    <el-table-column prop="ips" label="IPs" width="400" sortable>
                    </el-table-column>
                    <el-table-column prop="version" label="Version" width="100" sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" @click="addTab(scope.$index, scope.row)">集群</el-button>
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                                   :total="total" style="float:right;">
                    </el-pagination>
                </el-col>

                <!--编辑界面-->
                <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
                    <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                        <el-form-item label="集群名" prop="name">
                            <el-input v-model="editForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="IPs" prop="ips">
                            <el-input v-model="editForm.ips"></el-input>
                        </el-form-item>
                        <el-form-item label="版本" prop="version">
                            <el-input v-model="editForm.version"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="editFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                    </div>
                </el-dialog>

                <!--新增界面-->
                <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" :before-close="closeAdd">
                    <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                        <el-form-item label="集群名" prop="name">
                            <el-input v-model="addForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="IPs" prop="ips">
                            <el-input v-model="addForm.ips"></el-input>
                        </el-form-item>

                        <el-form-item label="版本" prop="version">
                            <el-input v-model="addForm.version"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="closeAdd">取消
                            <!--<el-button @click.native="addFormVisible = false">取消-->
                        </el-button>
                        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                    </div>
                </el-dialog>
            </section>
        </el-tab-pane>
        <el-tab-pane
                v-for="(item, index) in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                closable>

            <!--这里使用动态绑定，传递select的v-model值-->
            <ZkView :message="newZk"/>
        </el-tab-pane>

        <!--<el-tab-pane label="消息中心" closable @tab-remove="removeTab">消息中心</el-tab-pane>-->
        <!--<el-tab-pane label="角色管理">角色管理</el-tab-pane>-->
        <!--<el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>-->
    </el-tabs>

</template>

<script>
    import ZkView from './ZkView.vue'
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getUserListPage, removeUser, batchRemoveUser, editUser, addUser} from '../../api/api';
    import {listZks, addZk, updateZk, deleteZk} from '../../api/api';


    export default {
        components: {
            ZkView
        },
        data() {
            return {
                editableTabs: [],
                editableTabsValue: 'zookeeper',
                tabIndex: 1,
                newZK: '',

                filters: {
                    name: '',
                    ip: ''
                },
                users: [],
                zks: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    ips: [
                        {required: true, message: '请输入地址', trigger: 'blur'}
                    ],
                    version: [
                        {required: true, message: '请输入版本', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    ips: '',
                    version: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    ips: [
                        {required: true, message: '请输入地址', trigger: 'blur'}
                    ],
                    version: [
                        {required: true, message: '请输入版本', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    id: 0,
                    name: '',
                    ips: '',
                    version: ''
                }

            }
        },
        methods: {
            addTab(idx, row) {

                let newTabName =
                    row.name;
                this.newZk = row.name;
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


                this.editableTabs.push({
                    title: newTabName,
                    name: newTabName
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

                if (this.editableTabs.length === 0) {
                    this.editableTabsValue = "zookeeper";
                }
            },
            getZks: function () {
                let para = {
                    name: this.filters.name,
                    ip: this.filters.ip
                };
                this.loading = true;
                //NProgress.start();
                listZks(para).then((res) => {
                    this.zks = res.data.data;
                    this.loading = false;
                    //NProgress.done();
                }).catch(function (e) {
                        console.log(e)
                    }
                );
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getZks();
            },
            //获取用户列表
//            getUsers() {
//                let para = {
//                    page: this.page,
//                    name: this.filters.name
//                };
//                this.listLoading = true;
//                //NProgress.start();
//                getUserListPage(para).then((res) => {
//                    this.total = res.data.total;
//                    this.users = res.data.users;
//                    this.listLoading = false;
//                    //NProgress.done();
//                });
//            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id, name: row.name};
                    deleteZk(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getZks();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    ips: '',
                    version: ''
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            updateZk(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getZks();
                            });
                        });
                    }
                });
            },
            closeAdd: function () {
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.addLoading = false;
                this.listLoading = false;
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            addZk(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getZks();
                            });
                        });
                    }
                });
            },

            selsChange: function (sels) {
                this.sels = sels;
            }

            //批量删除
//           , batchRemove: function () {
//                var ids = this.sels.map(item => item.id).toString();
//                this.$confirm('确认删除选中记录吗？', '提示', {
//                    type: 'warning'
//                }).then(() => {
//                    this.listLoading = true;
//                    //NProgress.start();
//                    let para = {ids: ids};
//                    batchRemoveUser(para).then((res) => {
//                        this.listLoading = false;
//                        //NProgress.done();
//                        this.$message({
//                            message: '删除成功',
//                            type: 'success'
//                        });
//                        this.getUsers();
//                    });
//                }).catch(() => {
//
//                });
//            }
        },
        mounted() {
//            this.getUsers();
            this.getZks();

        }
    }

</script>

<style scoped>

</style>