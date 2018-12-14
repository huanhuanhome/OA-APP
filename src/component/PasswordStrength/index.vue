/*
 * @Author: zhanglianhao 
 * @Date: 2018-11-15 16:39:03 
 * @Last Modified by: zhanglianhao
 * @Last Modified time: 2018-11-15 16:39:32
 */

/**
|--------------------------------------------------
| 密码复杂度检测
|--------------------------------------------------
*/

<template>
    <div class="Password__strength-meter">
        <div class="Password__strength-meter--fill" :data-score="passwordStrength"></div>
    </div>
</template>

<script>
import zxcvbn from 'zxcvbn'
export default {
    name: 'PasswordStrength',
    props: {
        password: {
            type: String,
            default: ''
        }
    },
    computed: {
        passwordStrength() {
            return this.password ? zxcvbn(this.password).score : null
        }
    },
    watch: {
        passwordStrength(score) {
            // 密码复杂度分数
            this.$emit('score', score)
        }
    }
}
</script>

<style lang="scss" scoped>
.Password__strength-meter {
    position: relative;
    height: 3px;
    background: #DDD;
    margin: 10px auto 4px;
    border-radius: 3px;
}

.Password__strength-meter:before, .Password__strength-meter:after {
    content: '';
    height: inherit;
    background: transparent;
    display: block;
    border-color: #FFF;
    border-style: solid;
    border-width: 0 5px 0 5px;
    position: absolute;
    width: 20%;
    z-index: 10;
}

.Password__strength-meter:before {
    left: 56px;
}

.Password__strength-meter:after {
    right: 56px;
}

.Password__strength-meter--fill {
    background: transparent;
    height: inherit;
    position: absolute;
    width: 0;
    border-radius: inherit;
    transition: width 0.5s ease-in-out, background 0.25s;
}

.Password__strength-meter--fill[data-score='0'] {
    background: darkred;
    width: 20%;
}

.Password__strength-meter--fill[data-score='1'] {
    background: orangered;
    width: 40%;
}

.Password__strength-meter--fill[data-score='2'] {
    background: orange;
    width: 60%;
}

.Password__strength-meter--fill[data-score='3'] {
    background: yellowgreen;
    width: 80%;
}

.Password__strength-meter--fill[data-score='4'] {
    background: green;
    width: 100%;
}
</style>
