<template>
    <div class = "welcome">
        <div class = "caption text-center title">
            <font size="6"><i><b>mappingram</b></i></font>
        </div>
        <br><br>
        <div class = "text-center">
            みんなの思い出をより体験できるように。
        </div>
        <br><br>
        <div class = "text-center">
        <v-btn 
        class = "ma-3"
        @click="login"
        >ログイン</v-btn>
        <v-btn 
        class = "ma-3"
        @click="newaccount"
        >新規会員登録</v-btn>
        </div>
    </div>
</template>

<script>
 export default{
     name:"welcome",
     
     methods: {
        login: function() {
            this.$router.push('/login');
        },
        newaccount: function() {
            this.$router.push('/newaccount');
        }
     },
 }

</script>

<style scoped>
    .title{
        margin-top: 20vh;
    }

</style>
