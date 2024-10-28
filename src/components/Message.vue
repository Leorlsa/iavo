<template>
  <div :class="['message', isUser ? 'message-user' : 'message-bot']">
    <div class="message-content">
      <div class="avatar" :class="isUser ? 'avatar-user' : 'avatar-bot'">
        <span v-if="isUser">👤</span>
        <span v-else>🤖</span>
      </div>
      <div class="text-container">
        <div v-if="!isInput" class="text-lg" v-html="markdownToHtml(message.text)"></div>
        <div v-else class="w-full">
          <div v-if="message.type === 'text'" class="flex items-center mb-2">
            <input
                v-model="response"
                type="text"
                @keyup.enter="sendResponse()"
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
            <button
              @click="clearResponse"
              class="ml-2 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Limpar
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
          <button
              v-if="message.type === 'text'"
              @click="sendResponse()"
              class="p-3 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600 transition duration-300 transform hover:scale-105"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
    <!-- Card para a resposta da IA -->
    <div v-if="aiResponse" class="ai-response-card">
      <p>{{ aiResponse }}</p>
      <button @click="copyResponse" class="copy-button">
        Copiar a resposta
      </button>
    </div>
    <!-- Indicador de carregamento -->
    <div v-if="isLoading" class="loading-indicator">
      Carregando...
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, PropType } from 'vue';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { marked } from 'marked'; // Importe a biblioteca marked

// Inicialização do cliente da API do Google Generative AI
const client = new GoogleGenerativeAI({
  apiKey: 'AIzaSyByh63TEtmjLH2WpP2sxafq-VJoqz1mODI', // Substitua pela sua chave de API
});

// Função para gerar texto usando a API do Gemini
export const generateText = async (prompt: string) => {
  try {
    const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            key: 'AIzaSyByh63TEtmjLH2WpP2sxafq-VJoqz1mODI', // Substitua pela sua chave de API
          },
        }
    );

    return response.data;
  } catch (error) {
    console.error('Erro ao gerar texto:', error);
    throw error;
  }
};

// Estender a interface Window para incluir SpeechRecognition e webkitSpeechRecognition
interface Window {
  SpeechRecognition: {
    new (): CustomSpeechRecognition;
  };
  webkitSpeechRecognition: {
    new (): CustomSpeechRecognition;
  };
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

declare global {
  interface Window {
    SpeechRecognition: {
      new (): CustomSpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): CustomSpeechRecognition;
    };
  }
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
    const isLoading = ref(false); // Variável reativa para o estado de carregamento
    const conversationHistory = ref<{ roboMessage: string; personMessage: string }[]>([]);
    let recognition: CustomSpeechRecognition | null = null;

    // Variável reativa para a resposta da IA
    const aiResponse = ref('');

    const markdownToHtml = (text: string) => {
      return marked(text);
    };

    const clearResponse = () => {
      response.value = '';
    };

    onMounted(() => {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition) as {
          new (): CustomSpeechRecognition;
        };
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

    const sendResponse = async (option: string | null = null) => {
      let userResponse = '';
      if (option) {
        userResponse = option;
        console.log('Resposta do usuário (opção):', option);
        emit('send', option);
      } else {
        userResponse = response.value;
        console.log('Resposta do usuário (texto):', response.value);
        emit('send', response.value);
      }

      // Adicionar a mensagem atual e a resposta do usuário ao histórico da conversa
      conversationHistory.value.push({
        roboMessage: props.message.text,
        personMessage: userResponse,
      });

      console.log('Histórico de conversa atualizado:', conversationHistory.value);

      // Limpar o input de resposta
      response.value = '';

      if (recognition && isListening.value) {
        recognition.stop();
      }

      isLoading.value = true; // Inicia o carregamento

      try {
        // Verifica se a pergunta é "Gostaria de receber as dicas da IAVO?" e a resposta do usuário é "Sim"
        if (
            props.message.text === 'Gostaria de receber as dicas da IAVO?' &&
            userResponse.toLowerCase() === 'sim'
        ) {
         // Cria o prompt juntando todas as mensagens e respostas do histórico da conversa
        const prompt =
            `**Por favor, forneça uma resposta completa e detalhada ao usuário, levando em consideração as mensagens anteriores.**\n` +
            `Sua resposta deve ser em formato Markdown e conter o máximo de informações úteis possíveis em uma única resposta. Não faça perguntas adicionais ao usuário.\n\n` +
            conversationHistory.value
                .map((entry) => `**Bot:** ${entry.roboMessage}\n**Usuário:** ${entry.personMessage}`)
                .join('\n\n') +
            `\n\n**Instruções Adicionais:**\n` +
            `- Forneça conselhos personalizados que ajudem o usuário a ter uma vida mais saudável e ativa.\n` +
            `- Inclua sugestões de exercícios físicos adequados, atividades para manter a mente ativa, dicas de alimentação saudável e orientações para acompanhar a saúde.\n` +
            `- Responda exclusivamente em Markdown.\n` +
            `- Evite formatações desnecessárias e foque na clareza e no detalhamento.`;

        console.log('Prompt enviado ao Gemini:', prompt);
          try {
            // Envia o prompt para a API do Gemini
            const generatedText = await generateText(prompt);
            console.log('Texto gerado pela IA:', generatedText);

            // Extrai o texto da resposta
            const iaResponseText = generatedText.candidates[0].content.parts[0].text;

            // Atualiza a variável reativa com a resposta da IA
            aiResponse.value = iaResponseText;
          } catch (error) {
            console.error('Erro ao gerar texto:', error);
          }
        }
      } finally {
        isLoading.value = false; // Termina o carregamento
      }
    };

    const copyResponse = () => {
      const textToCopy = aiResponse.value;
      const tempInput = document.createElement('input');
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      console.log('Texto copiado para a área de transferência:', textToCopy);
    };

    return {
      response,
      isListening,
      isLoading, // Retorna a variável reativa do estado de carregamento
      toggleListening,
      clearResponse,
      sendResponse,
      conversationHistory,
      aiResponse, // Retorna a variável reativa da resposta da IA
      markdownToHtml,
      copyResponse,
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

input,
button {
  font-size: 1rem;
}

button {
  font-weight: bold;
  letter-spacing: 0.5px;
}

.pi {
  font-size: 1.2rem;
}

/* Estilos para o card da resposta da IA */
.ai-response-card {
  max-width: 100%;
  margin-top: 15px;
  padding: 12px 16px;
  border-radius: 18px;
  background-color: #f3e5f5; /* Um roxo claro */
  word-wrap: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Adicione estilos para o Markdown renderizado */
:deep(.markdown-content) {
  /* Estilos para elementos Markdown */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1em;
    margin-bottom: 0.5em;
  }
  p {
    margin-bottom: 1em;
  }
  ul, ol {
    margin-left: 1.5em;
    margin-bottom: 1em;
  }
  code {
    background-color: #f0f0f0;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }
  pre {
    background-color: #f0f0f0;
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
  }
}

/* Estilos para o indicador de carregamento */
.loading-indicator {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 10px;
}
</style>
