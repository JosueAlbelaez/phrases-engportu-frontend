import { useState, useEffect } from 'react';
import { getRandomPhrase, getPhrasesByCategory, Phrase } from './services/api';
import { PlayCircle } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import logo from './assets/logo.png';

const languages = ['English', 'Portuguese'];
const DEFAULT_LANGUAGE = 'English';

const categories = {
  English: [
    'Greeting and Introducing', 'Health and Wellness', 'Shopping and Business',
    'Travel and Tourism', 'Family and Personal Relationships', 'Work and Professions','Education and Learning', 'Food and Restaurants', 'Emergencies and Safety','Entertainment and Leisure', 'Technology and Communication', 'Culture and Society', 'Sports and Outdoor Activities', 'Advanced Idioms and Expressions', 'Opinions and Debates','Environment and Sustainability', 'Professional Networking and Business Jargon','Psychology and Emotions', 'Literature and Arts', 'Cultural Traditions and Festivals', 'Science and Innovation', 'Politics and Current Events', 'History and Historical Events', 'Law and Legal Terminology', 'Advanced Debate and Rhetoric', 'Travel for Study or Work Abroad', 'Financial and Investment Terminology', 'Philosophy and Ethics', 'Development and Software Engineering'
  ]
  ,
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
      const randomPhrases = await getRandomPhrase(selectedLanguage, category, 10);
      setPhrases(randomPhrases);
      setCurrentPhrase(randomPhrases[0]);
      setCurrentIndex(0);
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
      const randomPhrases = await getRandomPhrase(language, '', 10);
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

  const speakPhrase = (rate: number = 1) => {
    if (currentPhrase && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentPhrase.targetText);
      utterance.lang = selectedLanguage === 'English' ? 'en-US' : 'pt-BR';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        selectedLanguage === 'Portuguese'
          ? 'bg-gradient-to-b from-green-400  to-green-800'
          : 'bg-gradient-to-b from-blue-400 to-blue-800'
      }`}
    >
      <header className="flex justify-center py-1 mb-3">
        <img src={logo} alt="Logo" className="w-20 h-20"/>
      </header>

      <div className="max-w-md mx-auto bg-white/70 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="mb-4">
            <select
              className="w-full p-2 border rounded mb-4"
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              disabled={isLoading}
            >
              {languages.map((language) => (
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
              {categories[selectedLanguage as keyof typeof categories].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="text-center">Cargando...</div>
          ) : (
            currentPhrase && (
              <div className="text-center">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={handlePrevious}
                    className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-600"
                    disabled={phrases.length <= 1}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-600"
                    disabled={phrases.length <= 1}
                  >
                    Next
                  </button>
                </div>

                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">{currentPhrase.targetText}</h2>
                  <p className="text-gray-600">{currentPhrase.translatedText}</p>
                </div>

                <div className="flex justify-center space-x-2 md:space-x-4">
  <button
    onClick={() => speakPhrase(1)}
    className="flex items-center px-2 py-1 md:px-4 md:py-2 text-sm md:text-base bg-green-800 text-white rounded hover:bg-green-600"
  >
    <PlayCircle className="mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
    Speak
  </button>
  <button
    onClick={() => speakPhrase(0.4)}
    className="flex items-center px-2 py-1 md:px-4 md:py-2 text-sm md:text-base bg-green-800 text-white rounded hover:bg-green-600"
  >
    <PlayCircle className="mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
    Slow
  </button>
  <button
    onClick={() => loadInitialPhrases(selectedCategory)}
    className="px-2 py-1 md:px-4 md:py-2 text-sm md:text-base bg-green-800 text-white rounded hover:bg-green-600"
  >
    Random
  </button>
</div>
              </div>
            )
          )}
        </div>
      </div>

      <footer className="mt-6 text-center text-green-300">
        <div className="inline-flex px-4 flex-col md:flex-row bg-black/50 rounded py-2 justify-center items-center space-x-0 md:space-x-4">
          <p>
            Creado por{' '}
            <a
              href="https://josuealbelaez.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300 hover:text-white shadow hover:shadow-green-300/60 transition duration-300"
            >
              JOSUÉ ALBELÁEZ
            </a>
          </p>
          <div className="flex justify-center space-x-4 mt-4 md:mt-0">
            <a
              href="https://www.linkedin.com/in/juanjosuealbelaez/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300 hover:text-white shadow hover:shadow-green-300/60 transition duration-300"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://github.com/JosueAlbelaez"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300 hover:text-white shadow hover:shadow-green-300/60 transition duration-300"
            >
              <FaGithub size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}