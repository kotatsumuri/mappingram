<template>
  <div class="login">
    <v-container>
      <div class="caption text-center title">
        <font size="6"><i><b>mappingram</b></i></font>
      </div>

      <br /><br /><br />

      <v-flex xs12>
		
        <v-flex xs10 sm6 md4 class="select">
			<v-form ref="form" v-model="valid" lazy-validation>
        		<v-text-field v-model="email" :rules="emailRules" label="メールアドレス" outlined required></v-text-field>
        		<v-text-field v-model="password" :rules="passwordRules" @click:append = "showPassword = !showPassword" :type = "showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" label="パスワード" outlined required></v-text-field>
        		<v-text-field v-model="userName" :rules="userNameRules" label="ユーザーID" outlined required></v-text-field>
				<div class="text-center">
          			<v-btn :disabled="!valid" @click="signin" class="ma-3">アカウント作成</v-btn>
        		</div>
				
			</v-form>
			
        </v-flex>
		<div v-if = "e != null && e['i']['code'] == 'auth/email-already-in-use'" class = "text-center">
			このメールアドレスはすでに使用されています。
		</div>
        
      </v-flex>

    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "newaccount",

  data: function() {
	return {
		email: null,
		password: null,
		userName: null,
		showPassword:false,
		valid:true,
		emailRules: [
            v => !!v || '',
            v => /\w+@.+/.test(v) || '英数字、_(アンダーバー)で入力してください',
    	],
		passwordRules: [
			v => !!v || '',
			v => /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,12}$/.test(v) || '6文字以上12文字以下で半角の小文字、大文字、数字を1文字以上含めて入力してください',
		],
		userNameRules: [
			v => !!v || "",
			v => /^\w{0,12}$/.test(v) || '英数字、_(アンダーバー)、12文字以下で入力してください',
			v => this.userNameisOK(v) || 'すでに使われています'
		],
		e:null,
  	}
  },

  mounted: function() {
	try {
	  	firebase.database().ref('userNames/').on('value', snapshot => {
			this.$store.commit('setUserNames', snapshot.val());
		});
	} catch(e) {
		/* eslint-disable */
		console.error(e);
	}
  },

  computed: {
	  
  },

  methods: {
	  signin:function () {
		  this.$refs.form.validate();
		  let _this = this;
		  if(this.valid) {
			  var ret = firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
                result => {
                    result;
                    try {
						let updates = {};
						updates[_this.userName] = firebase.auth().currentUser.uid;
						firebase.database().ref('userNames/').update(updates);
						let userinfo = {};
						userinfo["email"] = firebase.auth().currentUser.email;
						userinfo["name"] = _this.userName;
						userinfo["followNum"] = 0;
						userinfo["follwerNum"] = 0;
						userinfo["likeNum"] = 0;
						userinfo["postNum"] = 0;
						userinfo["uid"] = firebase.auth().currentUser.uid;
						firebase.database().ref('users/' + firebase.auth().currentUser.uid).update(userinfo);
						firebase.database().ref('users/' + firebase.auth().currentUser.uid).on('value', snapshot => {
							this.$store.commit('setUserInfo', snapshot.val(),firebase.auth().currentUser.uid);
						});
						firebase.database().ref('post/').on('value', snapshot => {
                            this.$store.commit('setPost', snapshot.val());
                        });
						this.$router.push('/home');
                    }
                    catch(e) {
                        /* eslint-disable */
                        console.error(e);
                    }
                }
            )
			_this.e = ret;
		  }
	  },
	  userNameisOK: function(str) {
		  if(this.$store.getters.userNames == null)
		  	return true;
		  return !Object.keys(this.$store.getters.userNames).includes(str);
	  },
  },
};
</script>

<style scoped>
.title {
  margin-top: 20vh;
}
.select {
  margin: auto;
}
</style>