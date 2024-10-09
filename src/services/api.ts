import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface Phrase {
  _id: string;
  language: string;
  category: string;
  targetText: string;
  translatedText: string;
}

export const getRandomPhrase = async (language: string, category?: string, count: number = 10): Promise<Phrase[]> => {
  const response = await axios.get(`${API_URL}/phrases/random`, {
    params: { language, category, count }
  });
  return response.data;
};

export const getPhrasesByCategory = async (language: string, category: string): Promise<Phrase[]> => {
  const response = await axios.get(`${API_URL}/phrases/category/${category}`, {
    params: { language }
  });
  return response.data;
};