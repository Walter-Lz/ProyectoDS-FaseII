// Función para realizar la traducción con la API de DeepL

export const translateText = async (text, targetLang) => {
    const apiKey = process.env.EXPO_PUBLIC_DEEPL_API_KEY; // Reemplaza con tu clave de API
    const url = 'https://api-free.deepl.com/v2/translate'; // Usa api-free.deepl.com para la versión gratuita
  
    const params = new URLSearchParams({
      auth_key: apiKey,
      text: text,
      target_lang: targetLang, // Por ejemplo, 'ES' para español, 'EN' para inglés
    });
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: params,
      });
  
      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }
  
      const data = await response.json();
      const translatedText = data.translations[0].text;
  
        return translatedText;
    } catch (error) {
      console.error('Hubo un error al traducir:', error);
    }
  }
   

  