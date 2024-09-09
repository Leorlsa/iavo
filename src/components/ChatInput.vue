<template>
  <div class="flex flex-col items-center w-full">
    <div v-if="question.type === 'text'" class="w-full flex flex-col items-center">
      <input
        v-model="response"
        type="text"
        @keyup.enter="sendResponse"
        placeholder="Digite sua resposta..."
        class="p-2 mb-2 border rounded w-full max-w-md"
      />
      <button @click="sendResponse" class="p-2 bg-blue-500 text-white rounded w-full max-w-md">
        Enviar
      </button>
    </div>
    <div v-else-if="question.type === 'buttons'" class="w-full flex flex-col items-center">
      <button
        v-for="option in question.options"
        :key="option"
        @click="sendResponse(option)"
        class="p-2 mb-2 bg-blue-500 text-white rounded w-full max-w-md"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { TextServiceClient } from '@google/generative-ai';

// Configure a client with your API key
const client = new TextServiceClient({
  apiKey: 'AIzaSyByh63TEtmjLH2WpP2sxafq-VJoqz1mODI',
});

export const generateText = async (prompt: string) => {
  try {
    const response = await client.generateText({
      prompt: {
        text: prompt,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar texto:', error);
    throw error;
  }
};

export default defineComponent({
  name: 'ChatInput',
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const response = ref('');
    const conversationHistory = ref<{ question: string, answer: string }[]>([]); // Armazena a conversa
    const userResponses = ref<string[]>([]); // Armazena as respostas do usuário

    // Carregar histórico do localStorage ao montar o componente
    onMounted(() => {
      const savedHistory = localStorage.getItem('conversationHistory');
      if (savedHistory) {
        conversationHistory.value = JSON.parse(savedHistory);
        console.log('Histórico carregado:', conversationHistory.value);
      }
    });

    const saveConversationHistory = () => {
      console.log('Salvando conversa no localStorage:', conversationHistory.value);
      localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory.value));
    };

    const sendResponse = async (option: string | null = null) => {
      try {
        // Capturar a resposta do usuário (opção clicada ou texto digitado)
        const userResponse = option || response.value;

        // Armazenar a resposta do usuário
        userResponses.value.push(userResponse);

        // Criar o prompt com todas as respostas do usuário
        const prompt = userResponses.value.join(' ');

        // Enviar o prompt para a IA e obter a pergunta gerada
        const generatedText = await generateText(prompt);

        // Armazenar no histórico a pergunta do robô e a resposta do usuário
        conversationHistory.value.push({
          question: props.question.text,  // A pergunta feita pelo robô (IA)
          answer: userResponse,           // A resposta fornecida pelo usuário
        });

        console.log('Pergunta do robô:', props.question.text);
        console.log('Resposta do usuário:', userResponse);
        console.log('Texto gerado pela IA:', generatedText);

        // Salvar no localStorage
        saveConversationHistory();

        // Emitir a resposta gerada pela IA
        emit('send', generatedText);

        // Limpar o campo de resposta
        response.value = '';
      } catch (error) {
        console.error('Erro ao enviar resposta:', error);
      }
    };

    return {
      response,
      sendResponse,
      conversationHistory,
    };
  },
});
</script>

<style scoped>
/* Adicione qualquer estilo adicional aqui, se necessário */
</style>