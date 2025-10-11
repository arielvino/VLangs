using Google.Cloud.Translation.V2;

namespace VLangsReact.Server
{
    public static class Translator
    {
        private static readonly IConfiguration _config;
        private static readonly TranslationClient TranslationClient;

        //private static readonly TranslationClient TranslationClient;// = new TranslationClientBuilder { ApiKey = _config["GOOGLE_TRANSLATE_API_KEY"] }.Build();

        static Translator()
        {
            // Build configuration manually
            _config = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .AddUserSecrets<Program>()
                .Build();

            var apiKey = _config["GOOGLE_TRANSLATE_API_KEY"];
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new InvalidOperationException("GOOGLE_TRANSLATE_API_KEY is not set.");

            TranslationClient = new TranslationClientBuilder { ApiKey = apiKey }.Build();
        }

        public static string TranslateGoogleApi(string word, string targetLang, string sourceLang)
        {
            var result = TranslationClient.TranslateText(word, targetLang, sourceLang);
            return result.TranslatedText;
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
