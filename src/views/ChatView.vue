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
        
        <!-- @ts-ignore -->
        <Message
            v-if="currentQuestion"
            :key="'input'"
            :message="currentQuestion" 
            :isUser="true"
            :isInput="true"
            @send="handleSend"
        />
      </TransitionGroup>
      <!-- Indicador de carregamento -->
      <div v-if="isLoading" class="loading-indicator">
        Analisando seu caso para te dar as melhores dicas...
      </div>
      <!-- Botão de Copiar Texto -->
      <button v-if="botResponseText" @click="copyText" class="copy-button">
        Copiar Texto
      </button>
      <!-- Botão de Recarregar Página -->
      <button v-if="botResponseText" @click="reloadPage" class="reload-button">
        Recarregar Página
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, onMounted, watch } from 'vue';
import Message from '@/components/Message.vue';
import { questions, getQuestionsByCategory, Question } from '@/data/question';
import { generateText } from '@/components/Message.vue'; // Importe a função generateText

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
    const selectedCategory = ref<string | null>(null);
    const conversationHistory = ref<{ roboMessage: string; personMessage: string }[]>([]);
    const isLoading = ref(false); // Variável reativa para o estado de carregamento
    const botResponseText = ref('');

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

    const handleSend = async (response: string) => {
      if (questionIndex === 0) {
        userName.value = response;
      } else if (questionIndex === 1) {
        preferredName.value = response;
      }

      messages.value.push({ text: response, isUser: true });

      // Adicionar ao histórico de conversa
      if (currentQuestion.value) {
        conversationHistory.value.push({
          roboMessage: currentQuestion.value.text,
          personMessage: response,
        });
      }

      if (questionIndex === 5) { // Índice da pergunta de seleção de categoria
        selectedCategory.value = response;
      }

      questionIndex++;

      const relevantQuestions = getQuestionsByCategory(selectedCategory.value);
      if (questionIndex < relevantQuestions.length) {
        currentQuestion.value = relevantQuestions[questionIndex];
        updateQuestionText();
        messages.value.push({ text: currentQuestion.value.text, isUser: false });
      } else {
        // Se chegarmos ao final das perguntas, verificar se devemos gerar a resposta da IA
        currentQuestion.value = null;

        // Verifica se a última pergunta foi "Gostaria de receber as dicas da IAVO?"
        if (
            conversationHistory.value.length > 0 &&
            conversationHistory.value[conversationHistory.value.length - 1].roboMessage.includes('Gostaria de receber as dicas da IAVO?') &&
            response.toLowerCase() === 'sim'
        ) {
          isLoading.value = true; // Inicia o carregamento

          // Cria o prompt juntando todas as mensagens e respostas do histórico da conversa
          const prompt =
            `**Por favor, forneça uma resposta completa e detalhada ao usuário, levando em consideração as mensagens anteriores.**\n` +
            `Sua resposta deve ser em formato Markdown e conter o máximo de informações úteis possíveis em uma única resposta. Não faça perguntas adicionais ao usuário nao pergunte se ele quer mais informacoes e nao pergunte se ele entendeu o que voce disse e nem se ele quer mais detalhes e nem se elesta disponivel para continuar a conversa.\n\n` +
            conversationHistory.value
                .map((entry) => `**Bot:** ${entry.roboMessage}\n**Usuário:** ${entry.personMessage}`)
                .join('\n\n') +
            `\n\n**Instruções Adicionais:**\n` +
            `- Forneça conselhos personalizados que ajudem o usuário a ter uma vida mais saudável e ativa.\n` +
            `- Inclua sugestões de acordo com a categoria selecionada pela usuário.\n` +
            `- Responda exclusivamente em Markdown.\n` +
            `- Evite formatações desnecessárias e foque na clareza e no detalhamento.`;

          console.log('Prompt enviado ao Gemini:', prompt);

          try {
            // Chama a função generateText
            const generatedText = await generateText(prompt);
            console.log('Texto gerado pela IA:', generatedText);

            // Extrai o texto da resposta
            const iaResponseText = generatedText.candidates[0].content.parts[0].text;

            // Adiciona a resposta da IA às mensagens
            messages.value.push({ text: iaResponseText, isUser: false });
            botResponseText.value = iaResponseText;
          } catch (error) {
            console.error('Erro ao gerar texto:', error);
          } finally {
            isLoading.value = false; // Termina o carregamento
          }
        }
      }
      scrollToBottom();
    };

    const copyText = () => {
      const textToCopy = botResponseText.value;
      if (textToCopy) {
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
    };

    const reloadPage = () => {
      window.location.reload();
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
      isLoading, // Retorna a variável reativa do estado de carregamento
      botResponseText,
      copyText,
      reloadPage,
    };
  },
});
</script>

<style scoped>
/* Estilos para o indicador de carregamento */
.loading-indicator {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 10px;
}

/* Estilos para o botão de Copiar Texto */
.copy-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.copy-button:hover {
  background-color: #45a049;
}

/* Estilos para o botão de Recarregar Página */
.reload-button {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  margin-top: 10px;
  margin-left: 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reload-button:hover {
  background-color: #d32f2f;
}
</style>
