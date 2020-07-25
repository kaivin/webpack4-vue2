<template>
    <el-form v-bind:model="loginForm" v-bind:rules="rules" ref="loginForm" class="login-form">
        <div class="login-title">红星机器工作台</div>
        <el-form-item prop="username">
            <el-input 
                v-model="loginForm.username" 
                placeholder="用户名" 
                clearable
                ref='username'
                name='username'
            ></el-input>
        </el-form-item>
        <el-tooltip v-model="capsTooltip" placement="right" manual>
            <div slot="content">大写锁定已开启</div>
            <el-form-item prop="password">
                <el-input 
                    placeholder="密码" 
                    v-model="loginForm.password" 
                    show-password
                    ref='password'
                    name='password'
                    v-on:keyup.native="checkCapslock"
                    v-on:blur="capsTooltip = false"
                    v-on:keyup.enter.native="handleLogin('loginForm')"
                ></el-input>
            </el-form-item>
        </el-tooltip>
        <el-form-item>
            <el-button type="primary" v-on:click.native.prevent="handleLogin('loginForm')">登录</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import { mapGetters } from 'vuex';
import { isEmpty } from '@/utils/validate';
export default {
    name:'LoginFormModule',
    data(){
        const validateUsername = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            }else if(!this.checkeUsername(this.loginForm.username)){
                callback(new Error('用户名格式错误'));
            }else{
                callback();
            }
        };
        const validatePassword =  (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            }else if(!this.checkePassword(this.loginForm.password)){
                callback(new Error('密码格式错误'));
            }else{
                callback();
            }
        };
        return{
            loginForm:{
                username:'',
                password:''
            },
            rules: {
                username:[
                    {required: true, trigger: 'blur',validator: validateUsername,}
                ],
                password:[
                    {required: true, trigger: 'blur',validator: validatePassword,}
                ]
            },
            capsTooltip:false,
        }
    },
    computed:{
        ...mapGetters([
            'info'
        ]),
    },
    mounted(){
        var $this = this;
        if(isEmpty($this.loginForm.username)){
            $this.$refs.username.focus();
        }else if(isEmpty($this.loginForm.password)){
             $this.$refs.password.focus();
        }
    },
    methods:{
        // 验证大写是否开启
        checkCapslock({ shiftKey, key } = {}) {
            if (key && key.length === 1) {
                if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
                this.capsTooltip = true
                } else {
                this.capsTooltip = false
                }
            }
            if (key === 'CapsLock' && this.capsTooltip === true) {
                this.capsTooltip = false
            }
        },
        // 验证用户名是否由3-10位的字母、数字和下划线组成
        checkeUsername(username){
            var str=username;
            //在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
            var Expression=/^(\w){3,20}$/; 
            var objExp=new RegExp(Expression);          //创建正则表达式对象
            if(objExp.test(str)==true){                   //通过正则表达式验证
                return true;
            }else{
                return false;
            }
        },
        // 验证密码是否由6-20位的字母、数字、下划线和点“.”组成，并且只能以英文字符做开头
        checkePassword(password){
            var str=password;
            //在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
            //var Expression=/^[A-Za-z]{1}([A-Za-z0-9]|[._]){5,19}$/; 
            var Expression=/([A-Za-z0-9]|[._]){5,19}$/; 
            var objExp=new RegExp(Expression);          //创建正则表达式对象
            if(objExp.test(str)==true){                   //通过正则表达式验证
                return true;
            }else{
                return false;
            }
        },
        handleLogin(formName){
            var $this = this;
            $this.$refs[formName].validate(valid => {
                if (valid) {
                    $this.$store.dispatch('user/login', $this.loginForm).then(() => {
                        $this.$store.dispatch('user/getInfo', $this.$store.state.user.token).then(() => {
                            $this.$store.dispatch('user/getMenuData', $this.$store.state.user.token).then(() => {
                                $this.$router.push({ path: $this.redirect || '/' })
                                // $this.loading = false
                            }).catch((error) => {
                                console.log(error);
                                // $this.loading = false
                            });
                            // $this.loading = false
                        }).catch((error) => {
                            console.log(error);
                            // $this.loading = false
                        });
                        // $this.loading = false
                    }).catch((error) => {
                        console.log(error);
                        // $this.loading = false
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.login-form{
    position: absolute;
    width:360px;
    text-align:center;
    left:50%;
    top:50%;
    margin-left:-180px;
    transform: translateY(-50%);
    .login-title{
        width:100%;
        height:48px;
        line-height: 48px;
        text-align: center;
        font-size:24px;
        color: #ffffff;
        margin-bottom:40px;
    }
    .el-input{
        /deep/ input.el-input__inner{
            width:100%;
            height:50px;
            line-height:50px;
            background:#2d2d2d;
            *background-color:transparent;
            background:rgba(45,45,45,.15);
            border-radius:6px;
            border:1px solid #3d3d3d;
            border:1px solid rgba(255,255,255,.15);
            box-shadow:0 2px 3px 0 rgba(0,0,0,.1) inset;
            font-size:14px;
            color:#fff;
            text-shadow:0 1px 2px rgba(0,0,0,.1);
            transition:all .2s;
        }
        /deep/ input:-moz-placeholder{color:#fff}
        /deep/ input:-ms-input-placeholder{color:#fff}
        /deep/ input::-webkit-input-placeholder{color:#fff}
        /deep/ input:focus{
            outline:0;
            box-shadow:0 2px 3px 0 rgba(0,0,0,.1) inset,0 2px 7px 0 rgba(0,0,0,.2)
        }
    }
    button.el-button{
        cursor:pointer;
        width:100%;
        height:48px;
        padding:0;
        border-radius:6px;
        border:0;
        box-shadow:0 15px 30px 0 rgba(255,255,255,.25) inset,0 2px 7px 0 rgba(0,0,0,.2);
        font-size:14px;
        font-weight:700;
        color:#fff;
        text-shadow:0 1px 2px rgba(0,0,0,.1);
        transition:all .2s;
    }
    button.el-button:hover{
        box-shadow:0 15px 30px 0 rgba(255,255,255,.15) inset,0 2px 7px 0 rgba(0,0,0,.2)
    }
    button.el-button:active{
        box-shadow:0 5px 8px 0 rgba(0,0,0,.1) inset,0 1px 4px 0 rgba(0,0,0,.1);
        border:0;
    }
}
</style>
