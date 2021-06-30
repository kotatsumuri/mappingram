<template>
    <div class = "login">
        <v-container>

        <div class = "caption text-center title">
            <font size="6"><i><b>mappingram</b></i></font>
        </div>
        <br><br><br>
        <v-flex xs12>
            <v-flex xs10 sm6 md4 class="select">
          <v-text-field
            label="maill adress"
            outlined
          ></v-text-field>
            </v-flex>
        </v-flex>
        <v-flex xs12>
            <v-flex xs10 sm6 md4 class="select">
          <v-text-field
            label="your password"
            outlined
          ></v-text-field>
            </v-flex>
        </v-flex>
        <v-flex xs12>
            <v-flex xs10 sm6 md4 class="select">
          <v-text-field
            label="user ID"
            outlined
          ></v-text-field>
            </v-flex>
        </v-flex>
        <v-flex xs12>
            <div class="text-center">
          <v-btn @click="login"
          class = "ma-3"
          
          >アカウント作成</v-btn>
            </div>
        </v-flex>

        
        </v-container>
    </div>
</template>

<script>
    export default{
        name: "newaccount",
    methods: {
        login: function() {
            this.$router.push('');
        }
    }
    }

</script>

<style scoped>
    .title{
        margin-top: 20vh;
    }
    .select{
    margin: auto;
    }

</style>