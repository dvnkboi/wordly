<template>
  <div class="h-full w-full flex justify-start items-center flex-col gap-5">
    <div
      ref="scrollChat"
      class="h-full w-full flex justify-start items-center flex-col gap-5 overflow-auto p-5 pb-10"
    >
      <transition-group name="fade-left" appear>
        <!-- //!liste des bulles de chat avec infos de l'emetteur -->
        <bubble
          class="transition duration-300"
          :key="message"
          v-for="message in messages"
          :message="message.message"
          :user="users[message.userId]"
        />
      </transition-group>
    </div>
    <!-- //!input for message to send to users -->
    <chat-box @msgSend="handleMsg" v-if="!sp" />
  </div>
</template>

<script>
import bubble from './bubble.vue'
import chatBox from './chatBox.vue'
import { v4 as uuidv4 } from 'uuid';

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
      this.$emit('msgSend', {
        userId: this.playingUser,
        message: msg
      });
      this.$refs.scrollChat.scrollTop = this.$refs.scrollChat.scrollHeight;
    }
  },
  watch: {
    chatMsgToPush: {
      handler: function (chatMsgToPush) {
        this.messages.push({
          userId: chatMsgToPush.userId,
          message: chatMsgToPush.message,
        });
        this.$nextTick(() => {
          this.$refs.scrollChat.scrollTop = this.$refs.scrollChat.scrollHeight;
        });
      },
      deep: true
    }
  },
  props: ['users', 'chatMsgToPush', 'playingUser', 'sp']
}
</script>

<style scoped>
.fade-left-enter-from,
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(-25px);
}
</style>