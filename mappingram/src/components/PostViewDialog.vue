<template>
    <div class="postViewDialog">
        <v-flex xs12>
            <v-flex xs10 sm6 md4 class="select">
                <v-card>
                    <v-img height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png">
                    </v-img>
                    <v-card-text>
                        <p>ユーザ１が2021年5月5日に投稿</p>
                        <p class="text-right">
                            いいね 101 <v-btn icon @click="pushLike"><v-icon v-bind:color="liked ? 'red':'gray'">mdi-heart</v-icon></v-btn>
                        </p>
                        <div class = "d-flex flex-no-wrap justify-space-between">
                        <p class="text-left">ユーザ2 良い</p>
                        <p class="text-right">2021/5/5 14:30</p>
                        </div>
                        <v-text-field class="text-left" label="コメントを追加">
                            <template v-slot:append-outer>
                                <v-btn icon><v-icon>mdi-send</v-icon></v-btn>
                            </template>
                        </v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-flex>
    </div>
</template>

<script>
    export default {
        name: "PostViewDialog",
        data: function() {return {
            liked: false
        }},
        methods: {
            pushLike: function() {
                if(this.liked) {
                    this.liked = false;
                }
                else {
                    this.liked = true;
                }
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
</style>
