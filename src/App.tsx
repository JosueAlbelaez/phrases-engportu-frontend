import { useState, useEffect } from 'react';
import { getRandomPhrase, getPhrasesByCategory, Phrase } from './services/api';
import { PlayCircle, Clock, Sun, Moon } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { useTheme } from './contexts/ThemeContext';
import logo from './assets/logo.png';

const languages = ['English', 'Portuguese'];
const DEFAULT_LANGUAGE = 'English';
const ITEMS_PER_PAGE = 50;

const TABLE_VIEW_CATEGORIES = [
  '1000 Nouns',
  'Adjectives and Adverbs',
  'Prepositions and Conjunctions',
  'Articles, Determiners and Interjections'
];

const categories = {
  English: [
    'Greeting and Introducing', '1000 Nouns', 'Adjectives and Adverbs', 'Prepositions and Conjunctions', 'Articles, Determiners and Interjections', 
    'Health and Wellness', 'Shopping and Business', 'Travel and Tourism', 'Family and Personal Relationships', 'Work and Professions',
    'Education and Learning', 'Food and Restaurants', 'Emergencies and Safety',
    'Entertainment and Leisure', 'Technology and Communication', 'Culture and Society',
    'Sports and Outdoor Activities', 'Advanced Idioms and Expressions', 'Opinions and Debates',
    'Environment and Sustainability', 'Professional Networking and Business Jargon',
    'Psychology and Emotions', 'Literature and Arts', 'Cultural Traditions and Festivals',
    'Science and Innovation', 'Politics and Current Events', 'History and Historical Events',
    'Law and Legal Terminology', 'Advanced Debate and Rhetoric', 'Travel for Study or Work Abroad',
    'Financial and Investment Terminology', 'Philosophy and Ethics', 'Development and Software Engineering'
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

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-green-200 rounded-full"></div>
      <div className="w-12 h-12 border-4 border-green-800 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
    </div>
    <p className="mt-4 text-lg font-medium text-green-800">Loading phrases...</p>
  </div>
);

export default function App() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

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
      setCurrentPage(0);
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
      setCurrentPage(0);
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
        setCurrentPage(0);
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

  const handleNextPage = () => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < phrases.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const speakPhrase = (phrase: Phrase, rate: number = 1) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase.targetText);
      utterance.lang = selectedLanguage === 'English' ? 'en-US' : 'pt-BR';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderTableView = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, phrases.length);
    const currentPhrases = phrases.slice(startIndex, endIndex);

    return (
      <div className="w-full">
        <div className="flex justify-between mb-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={`flex items-center px-3 py-2 md:px-4 md:py-2 text-xs md:text-base ${
              isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
            } text-white rounded disabled:opacity-50`}
          >
            Previous
          </button>
          <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            p- {currentPage + 1} of {Math.ceil(phrases.length / ITEMS_PER_PAGE)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={(currentPage + 1) * ITEMS_PER_PAGE >= phrases.length}
            className={`flex items-center px-3 py-2 md:px-4 md:py-2 text-xs md:text-base ${
              isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
            } text-white rounded disabled:opacity-95`}
          >
            Next
          </button>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
          <table className="min-w-full">
            <tbody>
              {currentPhrases.map((phrase, index) => (
                <tr key={index} className={`border-b-2 ${isDarkMode ? 'border-gray-600' : ''}`}>
                  <td className="p-2 sm:p-4">
                    <div className="flex-col justify-center items-center">
                      <div className="flex-1">
                        <p className={`text-base sm:text-lg font-bold ${
                          isDarkMode ? 'text-green-400' : 'text-green-800'
                        } mb-1`}>
                          {phrase.targetText}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {phrase.translatedText}
                        </p>
                      </div>
                      <div className="flex justify-center space-x-2 pt-2">
                        <button
                          onClick={() => speakPhrase(phrase, 1)}
                          className={`p-2 ${
                            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
                          } text-white rounded`}
                        >
                          <PlayCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => speakPhrase(phrase, 0.4)}
                          className={`p-2 ${
                            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
                          } text-white rounded`}
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4 mb-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={`flex items-center px-3 py-2 md:px-4 md:py-2 text-xs md:text-base ${
              isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
            } text-white rounded disabled:opacity-50`}
          >
            Previous
          </button>
          <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            p- {currentPage + 1} of {Math.ceil(phrases.length / ITEMS_PER_PAGE)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={(currentPage + 1) * ITEMS_PER_PAGE >= phrases.length}
            className={`flex items-center px-3 py-2 md:px-4 md:py-2 text-xs md:text-base ${
              isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
            } text-white rounded disabled:opacity-95`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderDefaultView = () => (
    <div className="text-center">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevious}
          className={`px-4 py-2 ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded disabled:opacity-50`}
          disabled={phrases.length <= 1}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className={`px-4 py-2 ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded disabled:opacity-95`}
          disabled={phrases.length <= 1}
        >
          Next
        </button>
      </div>

      <div className="mb-4">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : ''}`}>
          {currentPhrase?.targetText}
        </h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {currentPhrase?.translatedText}
        </p>
      </div>

      <div className="flex justify-center space-x-2 md:space-x-4">
        <button
          onClick={() => currentPhrase && speakPhrase(currentPhrase, 1)}
          className={`flex items-center px-2 py-1 md:px-4 md:py-2 text-sm md:text-base ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded`}
        >
          <PlayCircle className="mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
          Speak
        </button>
        <button
          onClick={() => currentPhrase && speakPhrase(currentPhrase, 0.4)}
          className={`flex items-center px-2 py-1 md:px-4 md:py-2 text-sm md:text-base ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded`}
        >
          <Clock className="mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
          Slow
        </button>
        <button
          onClick={() => loadInitialPhrases(selectedCategory)}
          className={`px-2 py-1 md:px-4 md:py-2 text-sm md:text-base ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded`}
        >
          Random
        </button>
      </div>

      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              isDarkMode ? 'bg-green-600' : 'bg-green-800'
            }`}
            style={{ width: `${((currentIndex + 1) / phrases.length) * 100}%` }}
          ></div>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
          {currentIndex + 1} of {phrases.length} phrases
        </p>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen p-8 ${
        isDarkMode
          ? 'bg-gray-900'
          : selectedLanguage === 'Portuguese'
          ? 'bg-gradient-to-b from-green-400 to-green-800'
          : 'bg-gradient-to-b from-blue-400 to-blue-800'
      }`}
    >
      <header className="flex justify-between items-center py-1 mb-3 max-w-4xl mx-auto">
        <img src={logo} alt="Logo" className="w-20 h-20"/>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-800" />
          )}
        </button>
      </header>

      <div className={`max-w-4xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white/70'} rounded-xl shadow-md overflow-hidden`}>
        <div className="p-2 sm:p-8">
          <div className="mb-4">
            <select
              className={`w-full p-2 border rounded mb-4 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''
              }`}
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
              className={`w-full p-2 border rounded ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''
              }`}
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
            <LoadingSpinner />
          ) : (
            currentPhrase && (
              TABLE_VIEW_CATEGORIES.includes(selectedCategory)
                ? renderTableView()
                : renderDefaultView()
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