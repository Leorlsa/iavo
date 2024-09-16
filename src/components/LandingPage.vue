<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>IA Amiga do Idoso</h1>
        <p>Seu assistente pessoal para uma vida mais saudável e ativa na melhor idade.</p>
        <button class="btn btn-primary">Comece Agora</button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2>Como Podemos Ajudar</h2>
        <div class="feature-grid">
          <FeatureCard
              :icon="'activity'"
              title="Atividades Físicas"
              description="Exercícios personalizados para manter você ativo e saudável."
          />
          <FeatureCard
              :icon="'brain'"
              title="Estímulo Mental"
              description="Jogos e desafios para manter sua mente afiada."
          />
          <FeatureCard
              :icon="'heart'"
              title="Monitoramento de Saúde"
              description="Acompanhamento de indicadores vitais para seu bem-estar."
          />
          <FeatureCard
              :icon="'utensils'"
              title="Nutrição Balanceada"
              description="Dicas e receitas para uma alimentação saudável."
          />
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta">
      <div class="container">
        <h2>Pronto para Melhorar sua Qualidade de Vida?</h2>
        <p>Junte-se a milhares de idosos que já estão aproveitando os benefícios da nossa IA assistente.</p>
        <button class="btn btn-secondary">Experimente Gratuitamente</button>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <div class="container">
        <p>&copy; 2023 IA Amiga do Idoso. Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { Activity, Brain, Heart, Utensils } from 'lucide-vue-next';
import FeatureCard from "@/components/FeatureCardV2.vue";

export default {
  name: 'LandingPage',
  components: {
    FeatureCard,
    Activity,
    Brain,
    Heart,
    Utensils
  }
}

</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background-color: #FAFAFA;
  color: #333333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.hero {
  padding: 80px 0;
}

.hero h1 {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 24px;
}

.hero p {
  font-size: 24px;
  max-width: 600px;
  margin: 0 auto 32px;
}

.btn {
  display: inline-block;
  font-size: 18px;
  padding: 12px 32px;
  border-radius: 9999px;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #2196F3;
  color: white;
}

.btn-primary:hover {
  background-color: #1E88E5;
}

.features {
  padding: 80px 0;
  background-color: white;
}

.features h2 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 48px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.feature-card .icon {
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.cta {
  padding: 80px 0;
}

.cta h2 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 24px;
}

.cta p {
  font-size: 20px;
  max-width: 600px;
  margin: 0 auto 32px;
}

.btn-secondary {
  background-color: #4CAF50;
  color: white;
}

.btn-secondary:hover {
  background-color: #45a049;
}

footer {
  background-color: #333333;
  color: white;
  padding: 32px 0;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 36px;
  }

  .hero p, .cta p {
    font-size: 18px;
  }

  .features h2, .cta h2 {
    font-size: 30px;
  }
}
</style>