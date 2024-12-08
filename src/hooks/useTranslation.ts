import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);

  const translateContent = useCallback(async (content: string, targetLanguage: string) => {
    try {
      setIsTranslating(true);
      
      // First check cache
      const { data: cachedTranslation } = await supabase
        .from('content_translations')
        .select('translated_content')
        .eq('content_key', content)
        .eq('language', targetLanguage)
        .maybeSingle();

      if (cachedTranslation) {
        return cachedTranslation.translated_content;
      }

      // If not in cache, call translation function
      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: { content, targetLanguage }
      });

      if (error) throw error;

      // Cache the translation
      await supabase
        .from('content_translations')
        .insert([
          {
            content_key: content,
            language: targetLanguage,
            translated_content: data.translation
          }
        ]);

      return data.translation;
    } catch (error) {
      console.error('Translation error:', error);
      return content; // Fallback to original content
    } finally {
      setIsTranslating(false);
    }
  }, []);

  return {
    translateContent,
    isTranslating
  };
};