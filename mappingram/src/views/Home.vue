<template>
    <div class="Home" style="padding:0">
        <GmapMap
          ref="map"
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
          :style="{height: mapHeight + 'px', width: mapWidth + 'px'}"
          @click="focusMap"
        > 
          <GmapMarker
            v-for="key in Object.keys($store.getters.post)"
            :key="key"
            :position="{lat: $store.getters.post[key]['lat'], lng: $store.getters.post[key]['lng']}"
            :icon="$store.getters.post[key]['sub_url']"
            @click="markerClicked(key)"
          ></GmapMarker>
        </GmapMap>
        <post-view-dialog :postKey="postKey" :show="postViewDialogShow" @close="postViewDialogShow = false"></post-view-dialog>
        <Header class="header" :w="mapWidth - 24" @change_addr="change_address" @search="search"></Header>
        <post-dialog class="post-dialog"></post-dialog>
    </div>
</template>

<script>
import PostDialog from "../components/PostDialog.vue"
import PostViewDialog from "../components/PostViewDialog.vue"
import Header from "../components/Header.vue";
import {gmapApi} from 'vue2-google-maps'

export default {
  name: "Home",

  components: {
    PostDialog,
    PostViewDialog,
    Header
  },

  data :function () {
    return {
      center:{lat:35.68562,lng:139.75127},
      mapWidth: null,
      mapHeight: null,
      flag: false,
      address: null,
      postKey: null,
      postViewDialogShow: false
    }
  },

  watch: {
  },

  computed: {
    google: gmapApi
  },

  mounted: function() {
    this.mapResize();
    window.addEventListener('resize', this.mapResize);
  },

  methods: {
    mapResize: function() {
      this.mapHeight = window.innerHeight;
      this.mapWidth = window.innerWidth;
    },
    focusMap: function() {
      document.activeElement.blur();
      console.log(document.activeElement);
    },
    getPosition: function() {
      let that = this;
      if(navigator.geolocation) {
        const options = {
         enableHighAccuracy: false,
         timeout: 5000,
         maximumAge: 0
       }
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log(position);
          that.$refs.map.$mapPromise.then((map) => {
            map.panTo({lat:position.coords.latitude, lng:position.coords.longitude})
          });
          alert(position);
        }, function(error){ error; alert("位置情報が取得できませんでした");}, options);
      } else {
        alert("error");
      }
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
          that.$refs.map.$mapPromise.then((map) => {
            let latlng = new that.google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
            console.log(latlng);
            map.panTo(latlng);
          })
        }
      })
    },
    change_address: function(addr) {
      this.address = addr;
    },
    markerClicked: function(key) {
      this.postKey = key;
      this.postViewDialogShow = true;
    }
  }
};
</script>

<style scoped>
.header {
  top:0;
  position: absolute;
  margin:12px;
}
.post-dialog {
  bottom: 0;
  position: absolute;
  right:0;
  margin: 0 16px 16px 0;
}
</style>