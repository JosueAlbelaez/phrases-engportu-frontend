import { useState, useEffect } from 'react';
import { getRandomPhrase, getPhrasesByCategory, Phrase } from './services/api';
import { PlayCircle, Clock, Home, Sun, Moon, Mail, Phone, MapPin} from 'lucide-react';
import { FaLinkedin, FaInstagram, FaTiktok } from 'react-icons/fa';
import { useTheme } from './contexts/ThemeContext';
import VoiceRecorder from './components/VoiceRecorder';
import logo from './assets/logo.png';
const currentYear = new Date().getFullYear();

const languages = ['English']; //, 'Portuguese'
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
  const [resetRecorder, setResetRecorder] = useState(false);
  const [typedText, setTypedText] = useState('');

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
      setResetRecorder(prev => !prev);
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
      setResetRecorder(prev => !prev);
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
        setResetRecorder(prev => !prev);
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
      setResetRecorder(prev => !prev);
    }
  };

  const handlePrevious = () => {
    if (phrases.length > 0) {
      const prevIndex = currentIndex === 0 ? phrases.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentPhrase(phrases[prevIndex]);
      setResetRecorder(prev => !prev);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < phrases.length) {
      setCurrentPage(currentPage + 1);
      setResetRecorder(prev => !prev);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setResetRecorder(prev => !prev);
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

  useEffect(() => {
    const text = 'Elige la categoría, practica, pronuncia, DIVIÉRTETE';
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;
    
    const typeNextCharacter = () => {
      if (currentIndex <= text.length) {
        setTypedText(text.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeNextCharacter, 50);
      }
    };

    typeNextCharacter();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setTypedText('');
    };
  }, []);

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
                      <div className="flex justify-center py-2 space-x-1">
                      <button
  onClick={() => speakPhrase(phrase, 1)}
  className={`flex items-center justify-center 
              px-2 py-1 text-xs min-w-[50px] 
              md:px-4 md:py-2 md:text-base md:min-w-[60px] 
              rounded transition-colors 
              ${
                isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
              } text-white`}
>
  <PlayCircle className="w-4 h-4 md:w-5 md:h-5" />
</button>

<button
  onClick={() => speakPhrase(phrase, 0.4)}
  className={`flex items-center justify-center 
              px-2 py-1 text-xs min-w-[50px] 
              md:px-4 md:py-2 md:text-base md:min-w-[60px] 
              rounded transition-colors 
              ${
                isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
              } text-white`}
>
  <Clock className="w-4 h-4 md:w-5 md:h-5" />
</button>
                        <VoiceRecorder 
                          targetPhrase={phrase.targetText} 
                          isDarkMode={isDarkMode} 
                          resetKey={resetRecorder}
                          inline={true}
                          resultId={`similarity-result-${startIndex + index}`}
                        />
                      </div>
                      <div id={`similarity-result-${startIndex + index}`} className="h-9 pb-2">
                        {/* El resultado de la comparación aparecerá aquí */}
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

      <div className="flex flex-col space-y-4">
        <div className="flex justify-center space-x-1">
        <button
  onClick={() => currentPhrase && speakPhrase(currentPhrase, 1)}
  className={`flex items-center justify-center 
              px-2 py-1 text-sm min-w-[50px] 
              md:px-4 md:py-2 md:text-base md:min-w-[70px] 
              ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'} 
              text-white rounded`}
>
  <PlayCircle className="mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5" />
  Speak
</button>
<button
  onClick={() => currentPhrase && speakPhrase(currentPhrase, 0.4)}
  className={`flex items-center justify-center 
              px-2 py-1 text-sm min-w-[50px] 
              md:px-4 md:py-2 md:text-base md:min-w-[70px] 
              ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'} 
              text-white rounded`}
>
  <Clock className="mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5" />
  Slow
</button>
          {currentPhrase && (
            <VoiceRecorder 
              targetPhrase={currentPhrase.targetText} 
              isDarkMode={isDarkMode} 
              resetKey={resetRecorder}
              inline={true}
            />
          )}
        </div>

        <div id="similarity-result" className="h-8">
          {/* El resultado de la comparación aparecerá aquí */}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              isDarkMode ? 'bg-green-600' : 'bg-green-800'
            }`}
            style={{ width: `${((currentIndex + 1) / phrases.length) * 100}%` }}
          ></div>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
     <header className="flex flex-col py-4 mb-2 max-w-4xl mx-auto w-full px-4">
        <div className="flex justify-between items-center w-full mb-2">
        <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="w-20 h-20" />
            <button
              onClick={() => window.location.href = 'https://fluentphrases.org/'}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </button>
          </div>
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
        </div>

        <div className={`text-center ${isDarkMode ? 'text-yellow-400' : 'text-green-200'}`}>
  <p className={`text-lg font-bold h-[90px] overflow-hidden 
    text-shadow-xl ${isDarkMode ? 'text-shadow-[#ffffff] dark:text-shadow-[#ffffff]' : 'text-shadow-[#000000]'}`}>
    {typedText}
  </p>
</div>


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

      <footer className={`w-full text-gray-300 mt-8 ${isDarkMode ? 'bg-gray-900' : 'bg-blue-700'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <img src={logo} alt="Logo" className="w-24 h-24"/>
              <p className="text-sm">
                Transformando el aprendizaje de idiomas a través de la tecnología y la innovación.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="hover:text-white transition-colors">Inicio</a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white transition-colors">Sobre Nosotros</a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-white transition-colors">Planes</a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">Blog</a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:contact@example.com" className="hover:text-white transition-colors">
                    Info@fluentphrases.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+1234567890" className="hover:text-white transition-colors">
                    +54-1162908729
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>CIUDAD DE BUENOS AIRES, ARGENTINA</span>
                </li>
              </ul>
            </div>

            {/* Social Media & Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Síguenos</h3>
              <div className="flex space-x-4 mb-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pink-500 transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <FaTiktok size={24} />
                </a>
              </div>
              <a
                href="/contact"
                className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Contactar
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm">
                © {currentYear} Fluent Phrases. Todos los derechos reservados.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="/privacy" className="hover:text-white transition-colors">
                  Política de Privacidad
                </a>
                <a href="/terms" className="hover:text-white transition-colors">
                  Términos de Uso
                </a>
                <a href="/cookies" className="hover:text-white transition-colors">
                  Política de Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}