<template>
    <div class="postDialog">
        <v-dialog v-model = "showDialog" width = "500">
            <template v-slot:activator="{on}">
                <v-btn v-on = "on">
                    投稿追加
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    投稿
                </v-card-title>
                <v-card-text>
                    写真を追加
                    <v-file-input accept="image/*">
                    </v-file-input>
                </v-card-text>
                <v-card-text>
                    場所を選択
                </v-card-text>
                <v-card-text>
                    コメントを追加
                    <v-text-field v-model="comment">
                    </v-text-field>
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                    <div class = "flex-grow-1">
                    </div>
                    <v-btn>
                        投稿
                    </v-btn>
                </v-card-actions>
                
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "PostDialog",
    data: function(){
        return{
            showDialog:false,
            comment:null,
            
        }
    }
}
</script>

<style scoped>
</style>

