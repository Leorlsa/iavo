<template>
    <div class="flex flex-col h-screen justify-center items-center bg-gradient-to-r from-blue-100 to-green-100">
      <h1 class="text-4xl font-bold mb-6 text-blue-600 shadow-text transform transition-transform duration-500 hover:scale-105">IAVO</h1>
      <div class="w-full max-w-2xl h-3/4 overflow-y-auto p-6 bg-white rounded-xl shadow-2xl border border-gray-200" ref="chatContainer">
        <TransitionGroup name="message-list" tag="div" class="flex flex-col space-y-6">
          <Message
            v-for="(message, index) in messages"
            :key="index"
            :message="message"
            :isUser="message.isUser"
          />
          <Message
            v-if="currentQuestion"
            :key="'input'"
            :message="currentQuestion"
            :isUser="true"
            :isInput="true"
            @send="handleSend"
          />
        </TransitionGroup>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, nextTick, onMounted, watch } from 'vue';
  import Message from '@/components/Message.vue';
  import { questions, Question } from '@/data/question';

  interface Message {
    text: string;
    isUser: boolean;
    type?: 'text' | 'buttons';
    options?: string[];
  }

  export default defineComponent({
    name: 'ChatView',
    components: {
      Message,
    },
    setup() {
      const messages = ref<Message[]>([]);
      const currentQuestion = ref<Question | null>(questions[0]);
      const chatContainer = ref(null);
      let questionIndex = 0;
      const userName = ref('');
      const preferredName = ref('');

      const scrollToBottom = () => {
        nextTick(() => {
          const container = chatContainer.value as HTMLElement | null;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      };

      const updateQuestionText = () => {
        if (currentQuestion.value?.text.includes('[Nome]')) {
          currentQuestion.value.text = currentQuestion.value.text.replace('[Nome]', userName.value);
        }
        if (currentQuestion.value?.text.includes('[NomePreferido]')) {
          currentQuestion.value.text = currentQuestion.value.text.replace('[NomePreferido]', preferredName.value);
        }
      };

      const handleSend = (response: string) => {
        if (questionIndex === 0) {
          userName.value = response;
        } else if (questionIndex === 1) {
          preferredName.value = response;
        }

        messages.value.push({ text: response, isUser: true });
        questionIndex++;

        if (questionIndex < questions.length) {
          currentQuestion.value = questions[questionIndex];
          updateQuestionText();
          messages.value.push({ text: currentQuestion.value.text, isUser: false });
        } else {
          currentQuestion.value = null;
        }
        scrollToBottom();
      };

      if (currentQuestion.value) {
        messages.value.push({ text: currentQuestion.value.text, isUser: false });
      }

      onMounted(() => {
        scrollToBottom();
      });

      watch(messages, () => {
        scrollToBottom();
      }, { deep: true });

      return {
        messages,
        currentQuestion,
        handleSend,
        chatContainer,
        userName,
        preferredName,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Adicione uma barra de rolagem personalizada */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #4299e1 #e2e8f0;
  }
  
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #e2e8f0;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #4299e1;
    border-radius: 20px;
    border: 2px solid #e2e8f0;
  }
  
  .message-list-enter-active,
  .message-list-leave-active {
    transition: all 0.5s ease;
  }
  .message-list-enter-from,
  .message-list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  
  .shadow-text {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
