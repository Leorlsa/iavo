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
import { defineComponent, ref } from 'vue';

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

    const sendResponse = (option = null) => {
      emit('send', option || response.value);
      response.value = '';
    };

    return {
      response,
      sendResponse,
    };
  },
});
</script>

<style scoped>
/* Adicione qualquer estilo adicional aqui, se necessário */
</style>