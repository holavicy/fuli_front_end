<template>
  <d2-container>
    <template slot="header">
      <div class="user-info">
        <el-image style="width: 100px; height: 100px" :src="userInfo.avatar" fit="fit"></el-image>
        {{userInfo.name}}
        {{userInfo.staffNo}}
      </div>
    </template>
    <div class="gift-bag-info">礼包信息</div>
    <div class="staff-list" v-if="userInfo.position == '工段长'">工段长的下属信息</div>
    <!-- <template slot="footer">footer</template> -->
  </d2-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'index',
  data () {
    return {
      isGDLeader: true,
      userInfo: {}
    }
  },

  methods: {
    ...mapActions('d2admin/db', [
      'database',
      'databaseClear'
    ]),
    async load () {
      const db = await this.database({ user: true })
      this.userInfo = db.get('user_info').value()
      console.log(this.userInfo)
    }
  },

  created () {
    this.load()
  }
}
</script>
