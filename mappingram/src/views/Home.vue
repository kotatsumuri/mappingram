<template>
    <div class="Home">
      <v-container>
        <v-card
        class="mx-auto"
        width="300"
        >

    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
    >
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>アルバム名</v-list-item-title>

        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-list>
        <v-list-item>
          <v-list-group
           :value="true"
           prepend-icon="mdi-account"
          >

          <template v-slot:activator>
            <v-list-item-title>My account</v-list-item-title>
          </template>

          <v-list-group
           :value="true"
           no-action
           sub-group
          >

          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>アカウント情報</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for ="([title, icon], i) in admins"
            :key="i"
            link          
          >

          <v-list-item-title v-text="title"></v-list-item-title>

          <v-list-item-icon>
            <v-icon v-text="icon"></v-icon>
          </v-list-item-icon>

        </v-list-item>
          </v-list-group>

          



          </v-list-group>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
      <post-dialog>
      </post-dialog>
      <post-view-dialog>
      </post-view-dialog>
      </v-container>
    </div>
</template>

<script>
import PostDialog from "../components/PostDialog.vue"
import PostViewDialog from "../components/PostViewDialog.vue"
export default {
  name: "Home",

  components: {
    PostDialog,
    PostViewDialog
  },

  data () {
    return {
      drawer: true,    
    mini: true,
    }
  },

  data: () => ({
    admins: [
    ['Management', 'mdi-account-multiple-outline'],
    ['Settings', 'mdi-cog-outline'],
    ],
  }),

};
</script>
