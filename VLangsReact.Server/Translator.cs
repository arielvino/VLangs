using Google.Cloud.Translation.V2;

namespace VLangsReact.Server
{
    public static class Translator
    {
        private static readonly TranslationClient TranslationClient = new TranslationClientBuilder { ApiKey = Environment.GetEnvironmentVariable("GOOGLE_TRANSLATE_API_KEY") }.Build();

        public static string TranslateGoogleApi(string word, string targetLang, string sourceLang)
        {
            var result = TranslationClient.TranslateText(word, targetLang, sourceLang);
            return result.TranslatedText;
        }
    }
}
