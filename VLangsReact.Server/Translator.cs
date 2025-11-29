using Google.Cloud.Translation.V2;

namespace VLangsReact.Server
{
    public static class Translator
    {
        private static readonly IConfiguration _config;
        private static readonly TranslationClient? TranslationClient;
        private static readonly bool IsGoogleTranslationAvailable;

        static Translator()
        {
            // Build configuration manually
            _config = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .AddUserSecrets<Program>()
                .Build();

            var apiKey = _config["GOOGLE_TRANSLATE_API_KEY"];
            if (!string.IsNullOrWhiteSpace(apiKey))
            {
                try
                {
                    TranslationClient = new TranslationClientBuilder { ApiKey = apiKey }.Build();
                    IsGoogleTranslationAvailable = true;
                    Console.WriteLine("Google Translation API initialized successfully");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to initialize Google Translation API: {ex.Message}");
                    IsGoogleTranslationAvailable = false;
                }
            }
            else
            {
                Console.WriteLine("WARNING: GOOGLE_TRANSLATE_API_KEY is not set. Google Translation will not be available.");
                IsGoogleTranslationAvailable = false;
            }
        }

        public static string TranslateGoogleApi(string word, string targetLang, string sourceLang)
        {
            if (!IsGoogleTranslationAvailable || TranslationClient == null)
            {
                throw new InvalidOperationException("Google Translation API is not available. Please set GOOGLE_TRANSLATE_API_KEY environment variable.");
            }

            try
            {
                var result = TranslationClient.TranslateText(word, targetLang, sourceLang);
                return result.TranslatedText;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Google Translation failed: {ex.Message}");
                throw new InvalidOperationException($"Translation failed: {ex.Message}", ex);
            }
        }

        public static string TranslateGPT(OpenAIService openAIService, string word, string targetLang, string sourceLang)
        {
            var filePath = Path.Combine(AppContext.BaseDirectory, "Prompts/WordExplainTemplate.txt");
            var prompt = File.ReadAllText(filePath);

            if (string.IsNullOrWhiteSpace(prompt))
                throw new InvalidOperationException("Prompt template is empty.");

            prompt = prompt.Replace("@WORD", word)
                                         .Replace("@SOURCE_LANGUAGE", sourceLang)
                                         .Replace("@TARGET_LANGUAGE", targetLang);
            return openAIService.Send(prompt).Result;

        }
    }
}
