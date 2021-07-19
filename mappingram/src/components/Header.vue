<template>
    <div name="header">
        <v-toolbar
        dense
        :style="{width:w+'px'}"
        >
            <v-text-field
            hide-details
            prepend-icon="mdi-magnify"
            signal-line
            @click:prepend="search()"
            v-model="addr"
            @keydown.enter="search"
            >
            </v-text-field>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="logout"><v-icon>mdi-logout</v-icon></v-btn>
                </template>
                <span>ログアウト</span>
            </v-tooltip>
            <!--<v-avatar
                color="primary"
                size="30">
            </v-avatar>-->
        </v-toolbar>
    </div>
</template>

<script>
import firebase from "firebase";
export default {
    name: "Header",
    props: {
        w: {
            type: Number,
            default: 0
        },
    },
    data: function() {
        return {
            addr: null,
        }
    },
    watch: {
        addr: function() {
            this.$emit('change_addr', this.addr)
        }
    },
    methods: {
        search: function() {
            this.$emit('search');
        },
        logout: function() {
            this.$router.push('/login');
            firebase.auth().signOut();
            this.$store.commit("logout");
        }
    }
}
</script>

<style scoped>
</style>
