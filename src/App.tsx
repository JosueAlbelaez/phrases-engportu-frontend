import React, { useState, useEffect } from 'react';
import { getRandomPhrase, getPhrasesByCategory, Phrase } from './services/api';
import { PlayCircle } from 'lucide-react';

const languages = ['English', 'Portuguese'];
const DEFAULT_LANGUAGE = 'English';

const categories = {
  English: [
    'Greeting and Introducing', 'Health and Wellness', 'Shopping and Business',
    'Travel and Tourism', 'Family and Personal Relationships', 'Work and Professions',
    'Education and Learning', 'Food and Restaurants', 'Emergencies and Safety',
    'Entertainment and Leisure', 'Technology and Communication', 'Culture and Society',
    'Opinions and Debates'
  ],
  Portuguese: [
    'Cumprimentos e Apresentações', 'Diretrizes Básicas', 'Procedimentos em Escritórios',
     'Família e Casa', 'Saúde e Bem-Estar', 'Compras e Negócios',
    'Viagem e Turismo', 'Família e Relacionamentos Pessoais', 'Trabalho e Profissões',
    'Educação e Aprendizagem', 'Comida e Restaurantes', 'Emergências e Segurança',
    'Entretenimento e Lazer', 'Tecnologia e Comunicação', 'Cultura e Sociedade',
    'Opiniões e Debates'
  ]
};

export default function App() {
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialPhrases();
  }, []);

  const loadInitialPhrases = async (category: string = '') => {
    try {
        setIsLoading(true);
        const randomPhrases = await getRandomPhrase(selectedLanguage, category, 10); // Obtener 10 frases aleatorias
        setPhrases(randomPhrases);
        setCurrentPhrase(randomPhrases[0]);
        setCurrentIndex(0); // Resetea el índice a 0 al cargar nuevas frases
    } catch (error) {
        console.error('Error loading initial phrases:', error);
    } finally {
        setIsLoading(false);
    }
};



  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    setSelectedCategory('');
    try {
      setIsLoading(true);
      const randomPhrases = await getRandomPhrase(language, '', 10); // Obtener 10 frases aleatorias del nuevo idioma
      setPhrases(randomPhrases);
      setCurrentPhrase(randomPhrases[0]);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error loading phrases for new language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    try {
      setIsLoading(true);
      if (category) {
        const categoryPhrases = await getPhrasesByCategory(selectedLanguage, category);
        setPhrases(categoryPhrases);
        setCurrentPhrase(categoryPhrases[0]);
        setCurrentIndex(0);
      } else {
        await loadInitialPhrases();
      }
    } catch (error) {
      console.error('Error loading category phrases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (phrases.length > 0) {
      const nextIndex = (currentIndex + 1) % phrases.length;
      setCurrentIndex(nextIndex);
      setCurrentPhrase(phrases[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (phrases.length > 0) {
      const prevIndex = currentIndex === 0 ? phrases.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentPhrase(phrases[prevIndex]);
    }
  };

  const speakPhrase = () => {
    if (currentPhrase && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentPhrase.targetText);
      utterance.lang = selectedLanguage === 'English' ? 'en-US' : 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-green-800 p-8">
      <div className="max-w-md mx-auto bg-green-200 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="mb-4">
            <select
              className="w-full p-2 border rounded mb-4"
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              disabled={isLoading}
            >
              {languages.map(language => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
            
            <select
              className="w-full p-2 border rounded"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={isLoading}
            >
              <option value="">All Categories</option>
              {categories[selectedLanguage as keyof typeof categories].map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : currentPhrase && (
            <div className="text-center">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 bg-green-900 text-white rounded"
                  disabled={phrases.length <= 1}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-green-900 text-white rounded"
                  disabled={phrases.length <= 1}
                >
                  Next
                </button>
              </div>
              
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">{currentPhrase.targetText}</h2>
                <p className="text-gray-600">{currentPhrase.translatedText}</p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={speakPhrase}
                  className="flex items-center px-4 py-2 bg-secondary text-white rounded"
                >
                  <PlayCircle className="mr-2" />
                  Speak
                </button>
  <button
    onClick={() => loadInitialPhrases(selectedCategory)} // Llamar con la categoría seleccionada
    className="px-4 py-2 bg-secondary text-white rounded"
>
    Random
</button>


              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}