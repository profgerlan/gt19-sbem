import { Paper } from './types';

// In a real deployment, this data would likely be fetched from 'data/trabalhos.json'
// For this demo, we are hardcoding sample data.
// Note: The 'downloadUrl' points to generic sample PDFs for demonstration purposes.

export const SAMPLE_PAPERS: Paper[] = [
  {
    id: 1,
    title: "Educação Estatística e Pensamento Probabilístico no Ensino Médio",
    authors: "Lopes, Celi; Moura, Jônata",
    year: 2023,
    type: "Artigo",
    eventOrJournal: "Revista Brasileira de Educação Matemática",
    keywords: ["Educação Estatística", "Probabilidade", "Formação de professores"],
    abstract: "Neste artigo, discutimos a importância do desenvolvimento do pensamento probabilístico e como a educação estatística pode ser integrada ao currículo do Ensino Médio para promover uma cidadania crítica.",
    fileName: "lopes_moura_2023.pdf",
    downloadUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    viewCount: 1245,
    downloadCount: 342,
    recentLocations: ["São Paulo, SP", "Campinas, SP", "Lisboa, PT", "Rio de Janeiro, RJ"]
  },
  {
    id: 2,
    title: "Modelagem Matemática na Educação Básica: Desafios e Perspectivas",
    authors: "Silva, Gerlan; Almeida, Maria",
    year: 2024,
    type: "Comunicação Científica",
    eventOrJournal: "XIV ENEM - Encontro Nacional de Educação Matemática",
    keywords: ["Modelagem Matemática", "Educação Básica", "Prática Docente"],
    abstract: "O trabalho apresenta relatos de experiência sobre a implementação de atividades de modelagem matemática em escolas públicas, destacando os desafios enfrentados pelos docentes e o engajamento dos estudantes.",
    fileName: "silva_2024_modelagem.pdf",
    downloadUrl: "https://www.africau.edu/images/default/sample.pdf",
    viewCount: 890,
    downloadCount: 156,
    recentLocations: ["Belo Horizonte, MG", "Salvador, BA", "Brasília, DF"]
  },
  {
    id: 3,
    title: "O Uso de Tecnologias Digitais no Ensino de Geometria",
    authors: "Costa, Rafael; Souza, Ana",
    year: 2022,
    type: "Dissertação",
    eventOrJournal: "Universidade Estadual Paulista",
    keywords: ["Geometria", "GeoGebra", "Tecnologia Educacional"],
    abstract: "Esta pesquisa investiga como o software GeoGebra pode auxiliar na visualização de propriedades geométricas complexas em turmas de 9º ano, promovendo uma aprendizagem mais dinâmica e interativa.",
    fileName: "costa_souza_2022_geo.pdf",
    downloadUrl: "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
    viewCount: 2100,
    downloadCount: 567,
    recentLocations: ["São Paulo, SP", "Curitiba, PR", "Porto, PT", "Maputo, MZ"]
  },
  {
    id: 4,
    title: "Etnomatemática: Conexões Culturais e Currículo Escolar",
    authors: "Oliveira, Marcos",
    year: 2023,
    type: "Artigo",
    eventOrJournal: "BOLEMA",
    keywords: ["Etnomatemática", "Cultura", "Currículo"],
    abstract: "Análise das possibilidades de inserção da Etnomatemática no currículo oficial, valorizando os saberes prévios dos alunos e suas conexões culturais com a matemática formal.",
    fileName: "oliveira_2023_etno.pdf",
    downloadUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    viewCount: 430,
    downloadCount: 89,
    recentLocations: ["Manaus, AM", "Belém, PA"]
  },
  {
    id: 5,
    title: "Gamificação nas Aulas de Álgebra: Um Estudo de Caso",
    authors: "Pereira, Lucas; Santos, Júlia",
    year: 2024,
    type: "Relato de Experiência",
    eventOrJournal: "Seminário Internacional de Tecnologias",
    keywords: ["Gamificação", "Álgebra", "Engajamento"],
    abstract: "Relato sobre a utilização de plataformas gamificadas para o ensino de equações de primeiro grau, observando aumento significativo na motivação discente.",
    fileName: "pereira_santos_2024.pdf",
    downloadUrl: "https://www.africau.edu/images/default/sample.pdf",
    viewCount: 156,
    downloadCount: 23,
    recentLocations: ["Recife, PE", "Fortaleza, CE", "São Paulo, SP"]
  }
];