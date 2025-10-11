using Microsoft.AspNetCore.Mvc;

namespace VLangsReact.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController(OpenAIService openAIService) : Controller
    {
        private readonly OpenAIService _service = openAIService;

        [HttpGet("generate")]
        public async Task<IActionResult> Generate([FromQuery] string sourceLanguage, [FromBody] string[]? messages = null)
        {
            var filePath = Path.Combine(AppContext.BaseDirectory, "Prompts/StoryGameGenerationPrompt.txt");
            var prompt = System.IO.File.ReadAllText(filePath);

            if (string.IsNullOrWhiteSpace(prompt))
                throw new InvalidOperationException("Prompt template is empty.");

            prompt = prompt.Replace("@SOURCE_LANGUAGE", sourceLanguage);
            return Ok(openAIService.Send(prompt).Result);
        }
    }
}
