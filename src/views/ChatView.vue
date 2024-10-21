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
          // Gera o prompt com base no histórico da conversa
          const prompt =
          `Envie apenas texto simples sem formatação. De acordo com essas respostas, gere uma ajuda para esse usuário:\n` +
          conversationHistory.value
                  .map((entry) => `Bot: ${entry.roboMessage}\nUsuário: ${entry.personMessage}`)
                  .join('\n');

          console.log('Prompt enviado ao Gemini:', prompt);

          try {
            // Chama a função generateText
            const generatedText = await generateText(prompt);
            console.log('Texto gerado pela IA:', generatedText);

            // Extrai o texto da resposta
            const iaResponseText = generatedText.candidates[0].content.parts[0].text;

            // Adiciona a resposta da IA às mensagens
            messages.value.push({ text: iaResponseText, isUser: false });
          } catch (error) {
            console.error('Erro ao gerar texto:', error);
          }
        }
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
