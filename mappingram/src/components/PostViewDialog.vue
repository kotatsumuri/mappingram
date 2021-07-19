<template>
    <div class="postViewDialog">
        <v-dialog v-model="show" :persistent="true" width="500">
            <v-card>
                <v-img height="250" :src="$store.getters.post[postKey]['url']" :contain="true">
                </v-img>
                <v-divider/>
                <v-card-text style="padding: 10px;">
                    <p>{{userName}}が{{$store.getters.post[postKey]['date']}}に投稿</p>
                    <p>{{$store.getters.post[postKey]["authorComment"]}}</p>
                    <p class="text-right">
                        いいね {{$store.getters.post[postKey]['likeNum']}} <v-btn icon @click="pushLike"><v-icon v-bind:color="liked ? 'red':'gray'">mdi-heart</v-icon></v-btn>
                    </p>
                    <!--
                    <div class = "d-flex flex-no-wrap justify-space-between">
                    <p class="text-left">ユーザ2 良い</p>
                    <p class="text-right">2021/5/5 14:30</p>
                    </div>
                    <v-text-field class="text-left" label="コメントを追加">
                        <template v-slot:append-outer>
                            <v-btn icon><v-icon>mdi-send</v-icon></v-btn>
                        </template>
                    </v-text-field>
                    -->
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                    <div class = "flex-grow-1">
                    </div>
                    <v-btn @click="close">
                        閉じる
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import firebase from 'firebase';

    export default {
        name: "PostViewDialog",
        props: {
            postKey: {
                type: String,
                default: null
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        data: function() {
            return {
                liked: false
        }},
        computed: {
            userName: function() {
                return this.userNameFromPostKey(this.postKey);
            }
        },
        mounted: function() {
            if(this.$store.getters.post[this.postKey]["likeNum"] > 0 && this.$store.getters.post[this.postKey]["likeList"].includes(this.$store.getters.user["uid"]))
                this.liked = true;
        },
        watch: {
            show: function(newVal) {
                if(newVal) {
                    if(this.$store.getters.post[this.postKey]["likeNum"] > 0 && this.$store.getters.post[this.postKey]["likeList"].includes(this.$store.getters.user["uid"]))
                        this.liked = true;
                    else
                        this.liked = false;
                }
            }
        },
        methods: {
            pushLike: function() {
                if(this.liked) {
                    this.liked = false;
                    let list = this.$store.getters.user["likeList"].filter((value) => { return value != this.postKey });
                    firebase.database().ref("users/"+this.$store.getters.user["uid"]+"/likeList").set(list);
                    let likeNum = this.$store.getters.user["likeNum"];
                    firebase.database().ref("users/"+this.$store.getters.user["uid"]+"/likeNum").set(likeNum - 1);
                    let llist = this.$store.getters.post[this.postKey]["likeList"].filter((value) => { return value != this.$store.getters.user["uid"]});
                    firebase.database().ref("post/"+this.postKey+"/likeList").set(llist);
                    let llikeNum = this.$store.getters.post[this.postKey]["likeNum"];
                    firebase.database().ref("post/"+this.postKey+"/likeNum").set(llikeNum - 1);
                    console.log("success");
                }
                else {
                    this.liked = true;
                    let likeNum = this.$store.getters.user["likeNum"];
                    let list = [];
                    if(likeNum > 0)
                        list = this.$store.getters.user["likeList"];
                    list.push(this.postKey);
                    firebase.database().ref("users/"+this.$store.getters.user["uid"]+"/likeList").set(list);
                    console.log(likeNum);
                    firebase.database().ref("users/"+this.$store.getters.user["uid"]+"/likeNum").set(likeNum + 1);
                    let llikeNum = this.$store.getters.post[this.postKey]["likeNum"];
                    let llist = [];
                    if(llikeNum > 0)
                        llist = this.$store.getters.post[this.postKey]["likeList"];
                    llist.push(this.$store.getters.user["uid"]);
                    firebase.database().ref("post/"+this.postKey+"/likeList").set(llist);
                    firebase.database().ref("post/"+this.postKey+"/likeNum").set(llikeNum + 1);
                    console.log("success");
                }
            },
            close: function() {
                this.$emit('close');
            },
            userNameFromPostKey: function(postKey) {
                var uid = this.$store.getters.post[postKey]['author'];
                var userName = Object.keys(this.$store.getters.userNames).filter((key) => { return this.$store.getters.userNames[key] == uid})[0];
                return userName;
            }
        }
    }
</script>

<style scoped>
.like {
    color: red;
}
.notlike {
    color: gray;
}
.text-right {
    margin-bottom: 0;
}
</style>
