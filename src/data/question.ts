export interface Question {
    text: string;
    type: 'text' | 'buttons';
    options?: string[];
    condition?: (answers: string[]) => boolean;
  }
  
  export const questions: Question[] = [
    // Introdução combinada com a coleta do nome
    {
      text: 'Olá! Meu nome é IAVO. Estou aqui para te ajudar a ter uma vida mais saudável e ativa. Qual é o seu nome?',
      type: 'text',
    },
  
    // Pergunta sobre como o usuário gostaria de ser chamado
    {
      text: 'Prazer em te conhecer, [Nome]! Como você gostaria que eu te chamasse?',
      type: 'text',
    },
  
    // Coletando Informações Básicas
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
  
    // Escolha do Tipo de Auxílio
    {
      text: 'Agora que já te conheço melhor, como posso te ajudar hoje? Escolha uma das opções abaixo.',
      type: 'buttons',
      options: ['Exercícios Físicos', 'Rotina Diária', 'Dieta e Nutrição', 'Saúde Geral'],
    },
  
    // Exercícios Físicos
    {
      text: 'Você já participou de alguma sessão de fisioterapia?',
      type: 'buttons',
      options: ['Sim', 'Não'],
      condition: (answers: string[]) => answers.includes('Exercícios Físicos')
    },
    {
      text: 'Você gostaria de receber recomendações de exercícios para melhorar sua mobilidade?',
      type: 'buttons',
      options: ['Sim', 'Não'],
      condition: (answers: string[]) => answers.includes('Exercícios Físicos')
    },
    {
      text: 'Você prefere exercícios sentados ou em pé?',
      type: 'buttons',
      options: ['Sentados', 'Em pé', 'Ambos'],
      condition: (answers: string[]) => answers.includes('Exercícios Físicos')
    },
  
    // Rotina Diária
    {
      text: 'Você gosta de caminhar ao ar livre?',
      type: 'buttons',
      options: ['Sim', 'Não'],
      condition: (answers: string[]) => answers.includes('Rotina Diária')
    },
    {
      text: 'Você prefere atividades em grupo ou individuais?',
      type: 'buttons',
      options: ['Grupo', 'Individual'],
      condition: (answers: string[]) => answers.includes('Rotina Diária')
    },
    {
      text: 'Como você descreveria sua rotina diária?',
      type: 'text',
      condition: (answers: string[]) => answers.includes('Rotina Diária')
    },
  
    // Dieta e Nutrição
    {
      text: 'Você segue alguma dieta específica?',
      type: 'buttons',
      options: ['Sim', 'Não'],
      condition: (answers: string[]) => answers.includes('Dieta e Nutrição')
    },
    {
      text: 'Gostaria de receber dicas de alimentos que ajudam a fortalecer os ossos e músculos?',
      type: 'buttons',
      options: ['Sim', 'Não'],
      condition: (answers: string[]) => answers.includes('Dieta e Nutrição')
    },
    {
      text: 'Você tem alguma restrição alimentar?',
      type: 'text',
      condition: (answers: string[]) => answers.includes('Dieta e Nutrição')
    },
  
    // Saúde Geral
    {
      text: 'Como você descreveria sua saúde atualmente?',
      type: 'buttons',
      options: ['Muito boa', 'Boa', 'Regular', 'Ruim'],
      condition: (answers: string[]) => answers.includes('Saúde Geral')
    },
    {
      text: 'Você tem algum problema de saúde que gostaria de mencionar?',
      type: 'text',
      condition: (answers: string[]) => answers.includes('Saúde Geral')
    },
    
    // Conclusão
    {
      text: 'Gostaria de saber mais sobre como manter uma vida saudável e ativa?',
      type: 'buttons',
      options: ['Sim', 'Não']
    },
    {
      text: 'Você gostaria de receber dicas regulares no seu dispositivo?',
      type: 'buttons',
      options: ['Sim', 'Não']
    },
    
    // Feedback
    {
      text: 'Foi útil conversar comigo hoje?',
      type: 'buttons',
      options: ['Sim', 'Não', 'Mais ou menos']
    },
    {
      text: 'Tem algo mais que você gostaria de compartilhar ou perguntar?',
      type: 'text'
    }
  ];
  