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
                    <v-file-input v-model = "file" accept="image/*">
                    </v-file-input>
                </v-card-text>
                <v-card-text>
                    場所を選択
                    <div>
                        <GmapMap
                         :center="center"
                         :zoom="7"
                         :options="{
                             zoomControl: false,
                             mapTypeControl: false,
                             scaleControl: false,
                             streetViewControl: false,
                             rotateControl: false,
                             fullscreenControl: false,
                             disableDefaultUi: false
                         }"
                         @rightclick="place($event)"
                         map-type-id="terrain"
                         style="height:300px"
                        >
                            <GmapMarker
                             :position="pos"
                             :draggable="true"
                            />
                        </GmapMap>
                    </div>
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
                    <v-btn @click="send">
                        投稿
                    </v-btn>
                </v-card-actions>
                
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import firebase from "firebase";

export default {
    name: "PostDialog",
    data: function(){
        return{
            showDialog:false,
            comment:null,
            file:null,
            center:{lat:35.68562,lng:139.75127},
            pos: null
        }
    },
    mounted: function() {
        
    },
    methods: {
        send: function() {
            if(!this.file){
                alert("画像を選択してください。");
                return;
            }

            this.attachImage(this.file, "post/"+this.$store.getters.user["uid"]+"/");
        },
        attachImage: function(inputFile, bucket) {
            const file = inputFile;
            let _this = this;
            if(!file || !bucket)
                return;
            var date = new Date();
            var str_date = this.getStringFromDate(date);
            console.log(str_date);

            const uploadTask = firebase.storage().ref().child(`${bucket}${str_date}`).put(file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    snapshot;
                    console.log('success!');
                },
                (error) => {
                    console.log('error', error);
                },
                () => {
                   uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
                        let commitdata = {};
                        commitdata["author"] = _this.$store.getters.user["uid"];
                        commitdata["likeNum"] = 0;
                        commitdata["commentNum"] = 0;
                        commitdata["date"] = str_date;
                        commitdata["url"] = downloadURL;
                        commitdata["authorComment"] = _this.comment;
                        commitdata["lat"] = 81.0101001;
                        commitdata["lng"] = 135.11111111;
                        firebase.database().ref("post/"+_this.$store.getters.user["uid"]+str_date).update(commitdata);
                        let list = [];
                        if(_this.$store.getters.user["postNum"] == 0) {
                            list = [_this.$store.getters.user["uid"]+str_date];
                        }
                        else {
                            list = _this.$store.getters.user["postList"];
                            list.push(_this.$store.getters.user["uid"]+str_date);
                        }
                        firebase.database().ref("users/"+_this.$store.getters.user["uid"]+"/postList").set(list);
                        firebase.database().ref("users/"+_this.$store.getters.user["uid"]+"/postNum").set(_this.$store.getters.user["postNum"] + 1);
                   }) 
                }
            )
        },
        getStringFromDate: function (date) {
 
            var year_str = date.getFullYear();
            //月だけ+1すること
            var month_str = 1 + date.getMonth();
            var day_str = date.getDate();
            var hour_str = date.getHours();
            var minute_str = date.getMinutes();
            var second_str = date.getSeconds();
            
            month_str = ('0' + month_str).slice(-2);
            day_str = ('0' + day_str).slice(-2);
            hour_str = ('0' + hour_str).slice(-2);
            minute_str = ('0' + minute_str).slice(-2);
            second_str = ('0' + second_str).slice(-2);
            
            var format_str = 'YYYY-MM-DD hh:mm:ss';
            format_str = format_str.replace(/YYYY/g, year_str);
            format_str = format_str.replace(/MM/g, month_str);
            format_str = format_str.replace(/DD/g, day_str);
            format_str = format_str.replace(/hh/g, hour_str);
            format_str = format_str.replace(/mm/g, minute_str);
            format_str = format_str.replace(/ss/g, second_str);
 
            return format_str;
        },

        place(event){
            if (event) {
                this.pos ={lat:event.latLng.lat(), lng:event.latLng.lng()};
            }
        },
 
    }
}
</script>

<style scoped>
</style>

