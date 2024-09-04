<template>
  <div :class="['message', isUser ? 'message-user' : 'message-bot']">
    <div class="message-content">
      <div class="avatar" :class="isUser ? 'avatar-user' : 'avatar-bot'">
        <span v-if="isUser">👤</span>
        <span v-else>🤖</span>
      </div>
      <div class="text-container">
        <p v-if="!isInput" class="text-lg">{{ message.text }}</p>
        <div v-else class="w-full">
          <div v-if="message.type === 'text'" class="flex items-center mb-2">
            <input
              v-model="response"
              type="text"
              @keyup.enter="sendResponse"
              placeholder="Digite sua resposta..."
              class="p-3 flex-grow border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
            />
            <button
              @click="toggleListening"
              class="ml-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              :class="{ 'animate-pulse': isListening }"
            >
              <i :class="['pi', isListening ? 'pi-stop' : 'pi-microphone']"></i>
            </button>
          </div>
          <div v-else-if="message.type === 'buttons'" class="flex flex-col items-center">
            <button
              v-for="option in message.options"
              :key="option"
              @click="sendResponse(option)"
              class="p-2 mb-2 bg-blue-500 text-white rounded w-full max-w-md"
            >
              {{ option }}
            </button>
          </div>
          <button v-if="message.type === 'text'" @click="sendResponse" class="p-3 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600 transition duration-300 transform hover:scale-105">
            Enviar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, PropType } from 'vue';

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface CustomSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognition = typeof window.SpeechRecognition;

interface Message {
  text: string;
  isUser: boolean;
  type?: 'text' | 'buttons';
  options?: string[];
}

export default defineComponent({
  name: 'Message',
  props: {
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
    isUser: {
      type: Boolean,
      required: true,
    },
    isInput: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['send'],
  setup(props, { emit }) {
    const response = ref('');
    const isListening = ref(false);
    let recognition: CustomSpeechRecognition | null = null;

    onMounted(() => {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition) as unknown as { new (): CustomSpeechRecognition };
        recognition = new SpeechRecognition();
        if (recognition) {
          recognition.lang = 'pt-BR';
          recognition.continuous = true;
          recognition.interimResults = true;

          recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0].transcript)
              .join('');
            response.value = transcript;
          };

          recognition.onerror = (event: any) => {
            console.error('Erro no reconhecimento de fala:', event.error);
            isListening.value = false;
          };

          recognition.onend = () => {
            isListening.value = false;
          };
        }
      } else {
        console.error('Reconhecimento de fala não é suportado neste navegador.');
      }
    });

    onUnmounted(() => {
      if (recognition) {
        recognition.stop();
      }
    });

    const toggleListening = () => {
      if (recognition) {
        if (isListening.value) {
          recognition.stop();
        } else {
          recognition.start();
          isListening.value = true;
        }
      } else {
        console.error('Reconhecimento de fala não está disponível.');
      }
    };

    const sendResponse = (option: string | null = null) => {
      if (option) {
        emit('send', option);
      } else {
        emit('send', response.value);
      }
      response.value = '';
      if (recognition && isListening.value) {
        recognition.stop();
      }
    };

    return {
      response,
      isListening,
      toggleListening,
      sendResponse,
    };
  },
});
</script>

<style scoped>
.message {
  max-width: 100%;
  margin-bottom: 15px;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.message:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.message-content {
  display: flex;
  align-items: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  margin-right: 10px;
}

.avatar-bot {
  background-color: #bbdefb;
}

.avatar-user {
  background-color: #c8e6c9;
}

.text-container {
  flex: 1;
}

.message-bot {
  background-color: #e3f2fd;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.message-user {
  background-color: #e8f5e9;
  align-self: flex-end;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.message-user .message-content {
  flex-direction: row-reverse;
}

.message-user .avatar {
  margin-right: 0;
  margin-left: 10px;
}

input, button {
  font-size: 1rem;
}

button {
  font-weight: bold;
  letter-spacing: 0.5px;
}

.pi {
  font-size: 1.2rem;
}
</style>
