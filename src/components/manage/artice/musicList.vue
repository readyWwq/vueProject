<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-button type="primary" size="small" @click="creatPhoto = true" icon="el-icon-circle-plus-outline">
                    创建乐集
                </el-button>
            </el-col>
        </el-row>

        <div class="content">
            <div :span="6" v-for="elem in listData" :key="elem.id" class="photoBox" @click.stop="photoBox(elem)">
                <div class="img">
                    <img :src="elem.imgUrl" alt="">
                </div>
                <div class="title">
                    <h4>{{elem.columnName}}</h4>
                    <p>{{elem.describe}}</p>
                </div>
                <el-dropdown class="box">
                    <span class="el-dropdown-link">
                      <i class="el-icon-arrow-down"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <div @click="update(elem, 2)">
                                <i class="el-icon-edit"></i>编辑
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <div @click="delect(elem.id,true)">
                                <i class="el-icon-delete"></i>删除
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>


        <!-- 弹窗 -->
        <el-dialog title="创建相册" :close-on-click-modal="false" width="420px" :visible.sync="creatPhoto">
            <el-form v-model="fromData" label-width="85px">
                <el-form-item label="乐集名称：">
                    <el-input v-model="fromData.columnName" placeholder="乐集名" size="small"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="乐集描述：">
                    <el-input v-model="fromData.describe" placeholder="乐集描述" type="textarea" rows="5"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="封面图：" prop="imgUrl">
<!--                    <fileupload :img="fromData.imgUrl" @change="fileChange" :autoUp="false" dirName="music_pic"-->
<!--                                :copper="false"></fileupload>-->
                    <img-edit :edit="true" folder="music_pic" v-if="creatPhoto"  @change="fileChange" :cropXY="{fixedBox:false}" :operation="['cover','delete','edit']" :imgList="fromData.imgUrl?[fromData.imgUrl]:[]"></img-edit>

                </el-form-item>
                <el-col :span="10">
                    <el-form-item label="是否显示：">
                        <el-switch v-model="fromData.checkRoot" active-color="#13ce66" inactive-color="#ff4949"
                                   active-text="是" inactive-text="否"></el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="排序:" prop="relPassword">
                        <el-input-number v-model="fromData.sort" size="small" :min="0" label="排序"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="creatPhoto = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="addPhoto(submitType)" size="mini">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="添加MP3" :close-on-click-modal="false" width="80%" :visible.sync="addPhotoDia">
            <div class="photoList">
                <div class="list" v-for="(item,index) in photoList" :key="index">
                    <div class="close el-icon-delete" @click="delectPhoto(item.id,index)"></div>
                    <div class="boxP">
                        <img :src="item.imgurl" alt="有误">
                    </div>
                    <div class="titleBox">
                        <div class="author">{{item.articeTitle}}</div>
                        <div class="author">{{item.author}}</div>
                    </div>
                </div>
                <div class="upload el-icon-circle-plus-outline" @click="MP3dia = true"></div>
            </div>
            <div class="block">
                <wPage @pageSize="pageSize" @pageNo="pageNo" :size="paging.pageSize" :total="paging.total"></wPage>
            </div>
        </el-dialog>

        <!-- 弹窗 -->
        <el-dialog title="上传歌曲" :close-on-click-modal="false" width="500px" :visible.sync="MP3dia">
            <el-form v-model="fromData" label-width="85px">
                <el-form-item label="乐集名称：">
                    <el-input v-model="fromArtie.articeTitle" placeholder="歌名" size="small"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="歌手：">
                    <el-input v-model="fromArtie.author" placeholder="歌手"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                    <el-form-item label="封面图：" prop="imgUrl">
                        <fileupload :img="fromArtie.imgurl" @change="fileChangeMP3" :autoUp="false" dirName="music_pic"
                                    :copper="true"></fileupload>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上传MP3：" prop="imgUrl">
                            <fileupload fileType="2" :img="fromArtie.content" @change="mp3Change" :autoUp="true" dirName="music_mp3"></fileupload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="是否显示：">
                            <el-switch v-model="fromArtie.checkRoot" active-color="#13ce66" inactive-color="#ff4949"
                                       active-text="是" inactive-text="否"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="MP3dia = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="addMp3()" size="mini">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import fileupload from "../components/uploade";
    import imgEdit from '../components/imageEdit/imgEdit'
    export default {
        components: {
            fileupload,imgEdit
        },
        data() {
            return {
                addPhotoDia: false,
                creatPhoto: false,
                isCompress: true, //是否压缩
                MP3dia:false,
                imgFormData: '', //图片file对象
                updateID: '',
                submitType: 1, //1：增加  2：修改
                listData: [],
                fromData: {
                    columnName: '',
                    describe: '',
                    checkRoot: true,
                    sort: '',
                    isType: 2,
                    belongId: {
                        id: '0',
                        name: '顶级栏目'
                    },
                    imgUrl: '',
                },
                photoList: [],
                selectRow: {},
                paging: {
                    pageNo: 1,
                    pageSize: 30,
                    total: 0,
                    type: 0
                },
                fromArtie: {
                    articeTitle: '',
                    abstract: '',
                    imgurl: '',
                    content: '',
                    columnId: {},
                    author: '',
                    checkRoot: true,
                    setTime: new Date(),
                    creatTime: new Date(),
                    articeType:2,
                },
                articeId:"",
            }
        },
        watch: {
            creatPhoto: function (val) {
                if (!val) {
                    this.fromData = {
                        columnName: '',
                        describe: '',
                        checkRoot: true,
                        sort: '',
                        isType: 2,
                        belongId: {
                            id: '0',
                            name: '顶级栏目'
                        },
                        imgUrl: '',
                    };
                    this.submitType = 1;
                }
            },
            MP3dia(val) {
                if (!val) {
                    this.fromArtie = {
                        articeTitle: '',
                        abstract: '',
                        imgurl: '',
                        content: '',
                        columnId: {},
                        author: '',
                        checkRoot: true,
                        setTime: new Date(),
                        creatTime: new Date(),
                    }
                }
            },
        },
        mounted() {
            //do something after mounting vue instance
            this.queryPhoto();
        },
        methods: {
            queryPhoto() {
                this.$post(this.$api.queryPhoto, {isType: 2}).then((data) => {
                    this.listData = data;
                });
            },
            addPhoto(type) {
                let params = this.fromData;
                if (type === 1) {
                    if (this.fromData.columnName != "") {
                        this.$post(this.$api.addColumn, params).then((data) => {
                            this.creatPhoto = false;
                            this.queryPhoto();
                        });
                    } else {
                        this.$message({
                            message: '请输入栏目名称',
                            type: 'info'
                        });
                    }
                } else if (type === 2) { //修改接口
                    params.id = this.updateID;
                    this.$post(this.$api.updateColumn, params).then((data) => {
                        this.creatPhoto = false;
                        this.queryPhoto();
                    });
                }
            },
            //删除栏目
            delect(id = "", type) {
                let params = {}
                if (type) {
                    params.id = id;
                } else {
                    if (this.idList == "" || this.idList.length == 0) {
                        this.$message({
                            message: '请选择记录',
                            type: 'info',
                            duration: 1500,
                        });
                        return;
                    } else {
                        params.idList = this.idList;
                    }

                }
                this.$confirm('此操作将永久删除该栏目, 是否继续?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post(this.$api.delectColumn, params).then((data) => {
                        this.queryPhoto();
                    });
                }).catch(() => {
                });

            },
            /*保存MP3*/
            addMp3() {
                var params = this.fromArtie;
                if (this.fromArtie.articeTitle == "") {
                    this.$message({
                        message: '请输入标题',
                        type: 'info'
                    });
                }else {
                    params.columnId = this.selectRow
                    if (this.articeId == '') {
                        this.$post(this.$api.addArtice, params).then((data) => {
                            this.photoList.push(params);
                            this.MP3dia = false;
                        });
                    } else {
                        params.id = this.articeId;
                        this.$post(this.$api.updateArtice, params).then((data) => {
                            this.MP3dia = false;
                        });
                    }
                }

            },
            // 修改栏目
            update(val, type) {
                this.creatPhoto = true;
                this.submitType = type;
                var num = "";
                if (val.checkRoot == 1) {
                    num = true;
                } else {
                    num = false;
                }
                this.fromData.columnName = val.columnName;
                this.fromData.describe = val.describe;
                this.fromData.checkRoot = num;
                this.fromData.sort = val.sort;
                this.fromData.imgUrl = val.imgUrl;
                this.updateID = val.id;
            },

            photoBox(row) {
                this.selectRow["id"] = row.id;
                this.selectRow["name"] = row.columnName;
                this.addPhotoDia = true;
                this.paging["columnId"] = row.id
                this.queryArtice()
            },
            fileChange(val) {
                this.fromData.imgUrl = val[0];
            },
            mp3Change(val){
                this.fromArtie.content = val
            },
            fileChangeMP3(val){
              this.fromArtie.imgurl = val
            },
            pageSize(val) {
                this.paging.pageSize = val;
                this.queryArtice();
            },
            pageNo(val) {
                this.paging.pageNo = val;
                this.queryArtice();
            },

            queryArtice() {
                let params = this.paging;
                this.$post(this.$api.queryArtice, params).then((data) => {
                    this.photoList = data.data;
                    this.paging.total = data.total;
                });
            },

            delectPhoto(id, index) {
                let params = {
                    idList: [id]
                }
                this.$confirm('此操作将永久删除照片, 是否继续?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post(this.$api.delectRecycle, params).then((data) => {
                        this.photoList.splice(index, 1);
                    });
                }).catch(() => {
                });

            },

        }
    }
</script>
<style lang="less" scoped>
    .content {
        padding: 20px;
    }

    .photoBox {
        margin: 15px;
        box-shadow: 1px 2px 3px #f2f2f2f2;
        background-color: white;
        transition: all .36s ease;
        border-bottom: 2px solid white;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        float: left;
        width: 230px;
    }

    .img {
        height: 200px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
    }

    .img img {
        height: 100%;
    }

    .title {
        padding: 5px;
    }

    .title .h4 {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        height: 40px;
    }

    .title p {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 40px;
    }

    .photoBox:hover {
        border-color: #f56c6c;
    }

    .photoBox:hover .box {
        top: 5px;
    }

    .photoBox:hover .num {
        color: #f56c6c;
        right: 8px;
    }

    .photoBox .box {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: #f56c6c;
        width: 30px;
        line-height: 30px;
        border-radius: 50%;
        text-align: center;
        color: white;
        top: -30px;
        transition: all .36s ease;
        z-index: 999
    }

    .num {
        position: absolute;
        top: 150px;
        font-size: 30px;
        color: white;
        right: 5px;
        transition: all .36s ease;
    }

    .photoList {
        height: 600px;
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: content-box;
        margin-top: 10px;
        position: relative;
        &>div{
            width: 200px;
            height: 50px;
            overflow: hidden;
            float: left;
            margin-left: 15px;
        }
        .block {
            position: absolute;
            text-align: right;
            bottom: 0;
            width: 100%;
        }
        .upload{
            font-size: 50px;
            color: #3a8ee6;
            &:hover{
                color: #e64f2a;
                cursor: pointer;
            }
        }
        .list {
            margin-bottom: 10px;
            position: relative;
            .titleBox{
                position: absolute;
                width: 100%;
                height: 80px;
                width: 130px;
                left: 60px;
                top: 0;
                &>div{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display:-webkit-box; //作为弹性伸缩盒子模型显示。
                    -webkit-box-orient:vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
                    -webkit-line-clamp:1; //显示的行
                }
            }
            .close {
                position: absolute;
                top: 0px;
                right: 0px;
                transition: all .36s ease;
                z-index: 999;
                width: 15px;
                height: 15px;
                &:hover{
                    cursor: pointer;
                    color: red;
                }
            }
        }

        .boxP {
            width: 50px;
            height: 50px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
            img {
                height: 100%;
            }
        }
    }
</style>
