using OpenAI;
using OpenAI.Chat;
using System.ClientModel;

namespace VLangsReact.Server
{
    public class OpenAIService
    {
        private readonly ChatClient _client;

        public OpenAIService(IConfiguration config)
        {
            var apiKey = config["GPT_API_KEY"];
            _client = new ChatClient("gpt-4o", apiKey);
        }

        public async Task<string> Send(string prompt)
        {
            ChatCompletion completion = await _client.CompleteChatAsync([prompt]);
            return completion.Content[0].Text;
        }
    }
}