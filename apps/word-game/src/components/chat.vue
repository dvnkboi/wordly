<template>
  <div class="h-full w-full flex justify-start items-center flex-col gap-5">
    <div
      ref="scrollChat"
      class="h-full w-full flex justify-start items-center flex-col gap-5 overflow-auto p-5 pb-10"
    >
      <transition-group name="fade-left" appear>
        <bubble
          class="transition duration-300"
          :key="message"
          v-for="message in messages"
          :message="message.message"
          :user="users[message.userId]"
        />
      </transition-group>
    </div>
    <chat-box @msgSend="handleMsg" v-if="!sp" />
  </div>
</template>

<script>
import bubble from './bubble.vue'
import chatBox from './chatBox.vue'

export default {
  data() {
    return {
      messages: []
    }
  },
  components: {
    bubble,
    chatBox
  },
  methods: {
    handleMsg(msg) {
      this.messages.push({
        userId: this.playingUser.id,
        message: msg
      });
      this.$nextTick(() => {
        this.$refs.scrollChat.scrollTop = this.$refs.scrollChat.scrollHeight;
      });
    }
  },
  watch: {
    guessText: {
      handler: function (guessText) {
        this.messages.push({
          userId: '0',
          message: guessText.msg
        });
        this.$nextTick(() => {
          this.$refs.scrollChat.scrollTop = this.$refs.scrollChat.scrollHeight;
        });
      },
      deep: true
    }
  },
  props: ['users', 'guessText', 'playingUser', 'sp']
}
</script>

<style scoped>
.fade-left-enter-from,
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(-25px);
}
</style>