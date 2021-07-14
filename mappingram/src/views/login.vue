<template>
    <div class = "login">
        <v-container>
            <div class = "caption text-center title">
                <font size="6"><i><b>mappingram</b></i></font>
            </div>
            <br><br><br>

            <v-flex xs12>
                <v-flex xs10 sm6 md4 class="select">
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field v-model="email" :rules="emailRules" label="mail adress" outlined required></v-text-field>
        		        <v-text-field v-model="password" :rules="passwordRules" @click:append = "showPassword = !showPassword" :type = "showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" label="your password" outlined required></v-text-field>
                        <div class="text-center">
                            <v-btn @:disabled="!valid" @click="login" class="ma-3">login</v-btn>
                        </div>
                    </v-form>
                </v-flex>
                <div class = "text-center" v-if="error == 'auth/user-not-found'">
                    このメールアドレスは登録されていません。
                </div>
            </v-flex>
        </v-container>
    </div>
</template>

<script>
    import firebase from 'firebase';
    export default{
        name: "login",
        data: function() {
            return {
                email: null,
                password: null,
                showPassword: false,
                valid: true,
                emailRules: [
                    v => !!v || '',
                    v => /\w+@.+/.test(v) || '英数字、_(アンダーバー)で入力してください',
    	        ],
		        passwordRules: [
			        v => !!v || '',
			        v => /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,12}$/.test(v) || '6文字以上12文字以下で半角の小文字、大文字、数字を1文字以上含めて入力してください',
		        ],
                error:null,
            }
        },

        methods: {
            login: function() {
                this.$refs.form.validate();
                let _this = this;
                if(this.valid) {
                    firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
                        result => {
                            result;

                            try {
                                firebase.database().ref('users/' + firebase.auth().currentUser.uid +'/').on('value', snapshot => {
                                    this.$store.commit('setUserInfo', snapshot.val());
                                });
                                this.$router.push('/home');
                            }
                            catch(e) {
                                /* eslint-disable */
                                console.error(e);
                            }
                        }
                    ).catch(function(error) {
                        _this.error = error["code"];
                    })
                }
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