export interface Question {
  text: string;
  type: 'text' | 'buttons';
  options?: string[];
  category?: 'Exercícios Físicos' | 'Rotina' | 'Dieta e Nutrição' | 'Saúde Geral';
}

export const questions: Question[] = [
  // Perguntas iniciais (sem categoria)
  {
    text: 'Olá! Meu nome é IAVO. Estou aqui para te ajudar a ter uma vida mais saudável e ativa. Qual é o seu nome?',
    type: 'text',
  },
  {
    text: 'Prazer em te conhecer, [Nome]! Como você gostaria que eu te chamasse?',
    type: 'text',
  },
  {
    text: 'Perfeito, [NomePreferido]! Qual é a sua idade?',
    type: 'text',
  },
  {
    text: 'Qual é o seu peso (em kg)?',
    type: 'text',
  },
  {
    text: 'Qual é a sua altura (em cm)?',
    type: 'text',
  },
  {
    text: 'Agora que já te conheço melhor, como posso te ajudar hoje? Escolha uma das opções abaixo.',
    type: 'buttons',
    options: ['Exercícios Físicos', 'Rotina', 'Dieta e Nutrição', 'Saúde Geral'],
  },
  // Exercícios Físicos
  {
    text: 'Você já participou de alguma sessão de fisioterapia?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Você gostaria de receber recomendações de exercícios para melhorar sua mobilidade?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Você prefere exercícios sentados ou em pé?',
    type: 'buttons',
    options: ['Sentados', 'Em pé', 'Ambos'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Você tem costume de se alongar antes dos exercícios?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Prefere exercícios com peso corporal ou com equipamentos?',
    type: 'buttons',
    options: ['Peso corporal', 'Com equipamentos'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Já tentou exercícios de respiração durante o exercício?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Você faz exercícios de manhã ou à tarde?',
    type: 'buttons',
    options: ['Manhã', 'Tarde'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Seu objetivo é melhorar a mobilidade ou a força?',
    type: 'buttons',
    options: ['Mobilidade', 'Força', 'Ambos'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Você já teve alguma lesão praticando exercícios?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Costuma se hidratar durante os exercícios?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Você prefere exercícios mais dinâmicos ou mais tranquilos?',
    type: 'buttons',
    options: ['Dinâmicos', 'Tranquilos'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Quer saber sobre a importância do aquecimento antes do exercício?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Precisa de ajuda para criar um plano de exercícios?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Como você está se sentindo em relação à sua saúde física?',
    type: 'text',
    category: 'Exercícios Físicos'
  },
  {
    text: 'Você faz alguma atividade física regularmente?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Tem algum desconforto físico que gostaria de mencionar?',
    type: 'text',
    category: 'Exercícios Físicos'
  },
  {
    text: 'Você prefere exercícios leves ou moderados?',
    type: 'buttons',
    options: ['Leves', 'Moderados'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Qual parte do corpo você gostaria de fortalecer ou melhorar?',
    type: 'text',
    category: 'Exercícios Físicos'
  },
  {
    text: 'Quer saber como organizar sua rotina de exercícios?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Prefere fazer exercícios em casa ou ao ar livre?',
    type: 'buttons',
    options: ['Em casa', 'Ao ar livre'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Como você se sente após a prática de exercícios?',
    type: 'text',
    category: 'Exercícios Físicos'
  },
  {
    text: 'Quer incluir alongamentos ou exercícios de equilíbrio?',
    type: 'buttons',
    options: ['Alongamentos', 'Equilíbrio', 'Ambos'],
    category: 'Exercícios Físicos'
  },
  {
    text: 'Precisa de ajuda para começar ou adaptar seus exercícios?',
    type: 'text',
    category: 'Exercícios Físicos'
  },
  {
    text: 'Gostaria de receber lembretes diários para se exercitar?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Exercícios Físicos'
  },

  // Rotina Diária
  {
    text: 'Você gosta de caminhar ao ar livre?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Rotina'
  },
  {
    text: 'Você prefere atividades em grupo ou individuais?',
    type: 'buttons',
    options: ['Grupo', 'Individual'],
    category: 'Rotina'
  },
  {
    text: 'Como você descreveria sua rotina diária?',
    type: 'text',
    category: 'Rotina'
  },

  // Dieta e Nutrição
  {
    text: 'Você segue alguma dieta específica?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Dieta e Nutrição'
  },
  {
    text: 'Gostaria de receber dicas de alimentos que ajudam a fortalecer os ossos e músculos?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Dieta e Nutrição'
  },
  {
    text: 'Você tem alguma restrição alimentar?',
    type: 'text',
    category: 'Dieta e Nutrição'
  },

  // Saúde Geral
  {
    text: 'Como você descreveria sua saúde atualmente?',
    type: 'buttons',
    options: ['Muito boa', 'Boa', 'Regular', 'Ruim'],
    category: 'Saúde Geral'
  },
  {
    text: 'Você tem algum problema de saúde que gostaria de mencionar?',
    type: 'text',
    category: 'Saúde Geral'
  },
  {
    text: 'Você costuma sentir cansaço depois de caminhadas leves?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Saúde Geral'
  },
  {
    text: 'Já tentou fazer uma pausa para respiração profunda durante suas caminhadas?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Saúde Geral'
  },
  {
    text: 'Prefere exercícios para melhorar sua resistência ou para relaxar?',
    type: 'buttons',
    options: ['Resistência', 'Relaxar'],
    category: 'Saúde Geral'
  },
  {
    text: 'Já experimentou fazer alongamentos antes de começar a caminhar?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Saúde Geral'
  },
  {
    text: 'Quer dicas de como melhorar sua respiração durante atividades físicas?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Saúde Geral'
  },
  {
    text: 'Costuma fazer pausas para descansar durante o exercício?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Saúde Geral'
  },
  {
    text: 'Prefere fazer exercícios em casa ou em espaços ao ar livre?',
    type: 'buttons',
    options: ['Em casa', 'Ao ar livre'],
    category: 'Saúde Geral'
  },
  {
    text: 'Você já tentou incluir exercícios de mobilidade para ajudar com o cansaço?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Saúde Geral'
  },
  {
    text: 'Quer saber mais sobre como a hidratação pode ajudar durante o exercício?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Saúde Geral'
  },
  {
    text: 'Costuma se alongar após o exercício?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Saúde Geral'
  },
  {
    text: 'Como você se sente depois de realizar suas atividades físicas?',
    type: 'text',
    category: 'Saúde Geral'
  },
  {
    text: 'Gostaria de ajustar sua rotina de exercícios para evitar cansaço?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Saúde Geral'
  },
  {
    text: 'Quer incluir exercícios de relaxamento na sua rotina para ajudar a melhorar o bem-estar?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Saúde Geral'
  },
  {
    text: 'Quer saber mais sobre como equilibrar sua alimentação para ter mais energia?',
    type: 'buttons',
    options: ['Sim', 'Não'],
    category: 'Saúde Geral'
  },

  // Conclusão
  {
    text: 'Gostaria de saber mais sobre como manter uma vida saudável e ativa?',
    type: 'buttons',
    options: ['Sim', 'Não']
  },

  // Feedback
  {
    text: 'Gostaria de receber as dicas da IAVO?',
    type: 'buttons',
    options: ['Sim', 'Não']
  }
];

export function getQuestionsByCategory(selectedCategory: string | null): Question[] {
  return questions.filter(q => !q.category || q.category === selectedCategory);
}
