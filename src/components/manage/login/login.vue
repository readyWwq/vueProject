<template>
    <div class="content">
        <div class="card">
            <div>

            </div>
            <div class="rightBox">
                <div class="loginBox" :class="{left:activeMove}">
                    <h3>Sign Up</h3>
                    <w-input title="用户名" placeholder="请输入QQ邮箱 / 账号" v-model="userName"></w-input>
                    <w-input type="password" @keyup.enter.native="loginBtn" title="密码" placeholder="输入您的密码" v-model="password"></w-input>
                    <div style="margin-top:20px;">
                        <div class="zc" @click="activeMove = true">
                            没有账号？立即注册
                        </div>
                        <button class="btn" @click="loginBtn">
                            登 录
                        </button>
                    </div>
                </div>
                <div class="zcBox" :class="{right:activeMove}">
                    <div class="iconLoad">
<!--                        <upload :fileType="1"  @change="fileChange"  :copper="true" :autoUp="true"></upload>-->
                        <img-edit :edit="true" folder="user_pic" v-if="activeMove"  @change="fileChange" :cropXY="{fixedBox:false}" :operation="['cover','delete','edit']" :imgList="[]"></img-edit>
                    </div>

                    <w-input title="用户名" placeholder="输入您的昵称" v-model="userName1"></w-input>
                    <w-input type="password" title="密码" v-model="password1"></w-input>
                    <w-input type="password" title="确认密码" v-model="password2"></w-input>
                    <w-input title="QQ邮箱" placeholder="邮箱将作为用户登录账号" v-model="email"></w-input>
                    <div>
                        <button class="btn codebtn" @click="judegeUserName(email,1)" :class="{disbled:codeTxt!='获取证码'?true:false}">
                            {{codeTxt}}
                        </button>
                        <div class="code">
                            <w-input v-model="code" placeholder="验证码"></w-input>
                        </div>
                    </div>

                    <div style="margin-top:20px;">
                        <div class="zc" @click="activeMove = false">
                            去登录
                        </div>
                        <button class="btn" @click="judegeUserName(userName1,2)">
                            立即注册
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        mapMutations,mapGetters
    } from 'vuex'
    import {
        routerMenuData
    } from '@/tool/public/routerData.js' //配置的路由表
    import wInput from '../components/wInput'
    import upload from '../components/uploade'
    import imgEdit from '../components/imageEdit/imgEdit'
    export default {
        components: {
            wInput,upload,imgEdit
        },
        data() {
            return {
                userName: '',
                password: '',

                userName1: '',
                password1: '',
                password2: '',
                email: '',
                code: '',
                imgurl:"",
                active: false,
                active1: false,
                active2: false,
                zc: false,
                login: false,
                activeMove: false,
                codeTxt: '获取证码',
                setTime: '',
                isview:"",
            }
        },
        mounted(){
            this.isview = this.$route.params.isview
        },
        methods: {
            // 将用户信息保存在vuex里面
            ...mapMutations(["setUserInfo","setRootMenu","setToast"]),

            getCode() {
                if (this.codeTxt !== "获取证码") return;
                let params = {
                    emailId: this.email
                }
                if (this.email == '') {
                    this.$message({
                        type: 'error',
                        message: '请输入验证码'
                    })
                    return;
                }
                let i = 120;
                this.setTime = setInterval(() => {
                    i--;
                    if (i >= 1) {
                        this.codeTxt = `${i} 秒`
                    } else {
                        window.clearInterval(this.setTime);
                        this.codeTxt = "获取证码"
                    }
                }, 1000)
                this.$post(this.$api.getCode, params).then((data) => {

                }).catch(() => {
                    this.codeTxt = "获取证码"
                    window.clearInterval(this.setTime);
                });
            },

            /*验证邮箱昵称*/
            judegeUserName(name,type=1){
                if (name == ""){
                    this.setToast({show:true,icon:"warning",title:"请输入用户名"})
                    return
                }
                this.$post(this.$api.judegeUserName, {userName:name}).then((data) => {
                    if(type == 1){
                        this.getCode()
                    }else{
                        this.addNewUser()
                    }
                })
            },
//上传图片
            fileChange(val){
                this.imgurl = val[0];
            },
            //注册用户
            addNewUser() {
                if (this.password1 != this.password2) {
                    this.$message({
                        type: 'error',
                        message: '两次密码不一致',
                    });
                    return;
                }
                let params = {
                    userName: this.userName1,
                    passWord: this.password1,
                    Email: this.email,
                    code: this.code,
                    imgurl:this.imgurl
                }
                this.$post(this.$api.addNewUser, params).then((data) => {
                    this.userName = this.userName1;
                    this.password = this.password1
                    this.$confirm('注册成功立即登录', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'success'
                    }).then(() => {
                        this.loginBtn();
                    }).catch(() => {
                        this.userName1 = ""
                        this.password1=""
                        this.email=""
                        this.email=""
                        this.imgurl=""
                    });
                });
            },
            // //设置路由
            // setPageRouter() {
            //     menuRouter(routerMenuData); //进入主页创建对应路由表
            // },
            loginBtn() {
                let params = {
                    userName: this.userName,
                    passWord: this.password
                }
                if (this.userName == "") {
                  this.setToast({show:true,icon:"warning",title:"请输入用户名"})
                } else if (this.password == "") {
                  this.setToast({show:true,icon:"warning",title:"请输入密码"})
                } else {
                    this.$post(this.$api.login, params).then((data) => {
                        if (data.isLogin) {
                            this.setUserInfo(data.data[0]);
                            //取得用户权限
                            this.$post(this.$api.queryRoot, {userId:data.data[0].id}).then((data1) => {
                                this.setPageRouter(data1);
                                this.$message({
                                    message: '登录成功' + data.data[0].userName,
                                    type: 'success'
                                });
                                if(this.isview){
                                    this.$router.back(-1);
                                }else{
                                    this.$router.push({
                                        path: '/home'
                                    })
                                }

                            })
                        } else {
                            this.$message({
                                message: data.msg,
                                type: 'error'
                            });
                        }
                    });
                }

            },
            //过滤权限
            setPageRouter(data) {
                let userRoot = routerMenuData;
                userRoot.forEach(item=>{
                    item.power = false;
                    item.rootMainList.forEach(elem=>{
                        elem.rootPower = false;
                    })
                });
                userRoot.forEach(item=>{
                    data.forEach(elem=>{
                        if(item.rootPath === elem.rootPath){
                            item.power = true;
                            if(elem.twoData.length>0){
                                elem.twoData.forEach(lis=>{
                                    item.rootMainList.forEach(chird=>{
                                        if(lis.rootPath === chird.rootPath){
                                            chird.rootPower = true;
                                        }
                                    })
                                });
                            }
                        }
                    })
                });
                this.setRootMenu(userRoot);
            },
        }
    }
</script>
<style scoped lang="less">
    .content {
        display: flex;
        justify-content: center;
        align-items: Center;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        position: relative;
    }

    .content::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: inherit;
        filter: blur(8px);

    }

    .card {
        background: url("../../../../static/images/l_bg2.jpg");
        background-size: cover;
        background-color: white;
        background-position: center center;
        box-shadow: 0 0 40px black;
        z-index: 15;

        & > div {
            float: left;
            height: 600px;
        }

        & > div:nth-child(1) {
            width: 600px;
            transition: all 0.36s ease;
        }

        & > div:nth-child(2) {
            width: 370px;
            background: rgba(0, 0, 0, 0.6);

            & > div {
                margin-top: 100px;
                padding: 0 60px;
                font-family: "Times New Roman";

                h3 {
                    color: white;
                    font-size: 22px;
                }
            }

        }
    }

    @media screen and (max-width: 1005px) {
        .card > div:nth-child(1) {
            width: 0;
        }
    }

    @inputColor: #b1b1b1;

    .zc {
        float: right;
        font-size: 12px;
        color: @inputColor;

        &:hover {
            cursor: pointer;
            color: white;
        }
    }

    .btn {
        font-size: 12px;
        width: 100px;
        line-height: 30px;
        text-align: center;
        color: @inputColor;
        border: 1px solid @inputColor;
        transition: all 0.46s ease;
        background: none;
    }

    .btn:hover {
        color: white;
        border-color: white;
        cursor: pointer;
    }

    .disbled {
        cursor: not-allowed !important;
    }

    .code {
        width: 140px;
    }

    .codebtn {
        float: right;
        line-height: 25px;
        width: 80px;
        margin-top: 5px;

    }

    .rightBox {
        position: relative;
        overflow: hidden;

        .loginBox {
            position: absolute;
            width: 250px;
            left: 0;
            transition: all 0.36s ease;

            &.left {
                left: -370px;
            }
        }

        .zcBox {
            position: absolute;
            width: 250px;
            left: 370px;
            top: -80px;
            transition: all 0.46s ease;

            &.right {
                left: 0;
            }
        }
    }
    .iconLoad{
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
