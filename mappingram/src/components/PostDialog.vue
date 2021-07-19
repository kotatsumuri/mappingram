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
                    <v-file-input v-model = "file" accept="image/*" >
                    </v-file-input>
                </v-card-text>
                <v-card-text>
                    <v-text-field
                        hide-details
                        prepend-icon="mdi-magnify"
                        signal-line
                        @click:prepend="search"
                        @keydown.enter="search"
                        v-model="address"
                    >
                    </v-text-field> 
                    場所を選択
                    <div>
                        <GmapMap
                         ref="mapRef"
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
                         map-type-id="terrain"
                         style="height:300px"
                         @center_changed = "change_center"
                        >
                            <GmapMarker
                             :position="pos"
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
import {gmapApi} from 'vue2-google-maps';

export default {
    name: "PostDialog",
    data: function(){
        return{
            showDialog:false,
            comment:null,
            file:null,
            center:{lat:35.68562,lng:139.75127},
            pos: null,
            image_image: null,
            image_size: {},
            image_type: '',
            image_src: null,
            image_image_scaled:null,
            size: null,
            address: null
        }
    },
    mounted: function() {
        this.pos = this.center;
    },
    computed: {
        google: gmapApi
    },
    watch: {
        file: function() {
            this.image_open_file();
        }
    },
    methods: {
        send: function() {
            if(!this.file){
                alert("画像を選択してください。");
                return;
            }

            this.attachImage(this.file, "post/"+this.$store.getters.user["uid"]+"/main/");
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
                        commitdata["lat"] = _this.pos.lat();
                        commitdata["lng"] = _this.pos.lng();
                        
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
                        _this.showDialog = false;
                        _this.image_save(str_date, commitdata);
                        alert("投稿が完了しました");
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
        image_open_file: function() {
            var reader = new FileReader();
            var that = this;
            reader.onload = () => {
                that.image_type = that.file.type;
                that.image_src = reader.result;
                that.image_image = new Image();
                that.image_image.onload = () => {
                    that.image_size = {width : that.image_image.width, height: that.image_image.height};
                    that.image_scale_change();
                };
                that.image_image.src = that.image_src;
            }
            reader.readAsDataURL(this.file);
        },
        image_scale_change: function() {
            var image = this.image_image;
            var size, sx, sy, sw, sh, dx, dy, dw, dh;
            size = (image.width < image.height) ? image.width : image.height;
            var x = Math.floor((image.width - size) / 2);
            var y = Math.floor((image.height - size) / 2);
            sx = x;
            sy = y;
            sw = sh = size;
            dx = dy = 0;
            dw = dh = size;

            var canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            var context = canvas.getContext('2d');
            context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
            this.image_image_scaled = canvas;
            this.size = size;
        },
        image_save: async function(str_date, commitdata) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = 50;
            canvas.height = 50;
            context.drawImage(this.image_image_scaled, 0, 0, this.size, this.size, 0, 0, canvas.width, canvas.height);

            let that = this;
            canvas.toBlob(function(blob){
                var img = new Image();
                img.src = blob;
                const uploadTask = firebase.storage().ref().child("post/"+that.$store.getters.user["uid"]+"/sub/" + str_date).put(blob);
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
                            commitdata["sub_url"] = downloadURL;
                            firebase.database().ref("post/"+that.$store.getters.user["uid"]+str_date).update(commitdata);
                        })
                    }
                )
            });
            

        },
        change_center: function() {
            var that = this;
            this.$refs.mapRef.$mapPromise.then((map) => {
                that.pos = map.getCenter();
            })
        },
        search: function() {
            let that = this;
            let geocoder = new this.google.maps.Geocoder();
            if(this.address == null)
                return;
            geocoder.geocode({
                'address': that.address
            }, (results, status) => {
                if(status === that.google.maps.GeocoderStatus.OK) {
                    that.$refs.mapRef.$mapPromise.then((map) => {
                        let latlng = new that.google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                        map.panTo(latlng);
                    })
                }
            });
        }
    }
}
</script>

<style scoped>
</style>

