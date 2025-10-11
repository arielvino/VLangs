using Microsoft.AspNetCore.Mvc;

namespace VLangsReact.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TranslateController(OpenAIService openAIService) : ControllerBase
    {
        [CheckReferrer]
        [HttpGet]
        public IActionResult Translate(string engine, string word, string targetLang, string sourceLang)
        {
            Console.WriteLine($"Translating '{word}' from '{sourceLang}' to '{targetLang}' by '{engine}'");
            if (engine == "gpt")
                return Ok(new
                {
                    translation = Translator.TranslateGPT(openAIService, word, targetLang, sourceLang),
                });
            if (engine == "google")
                return Ok(new
                {
                    translation = Translator.TranslateGoogleApi(word, targetLang, sourceLang),
                });
            else
                return BadRequest("Unknown translation engine.");
        }
    }
}