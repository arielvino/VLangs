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
            Console.WriteLine($"Translating '{word}' from '{sourceLang}' to '{targetLang}' using '{engine}' engine");

            try
            {
                if (engine == "gpt")
                {
                    var translation = Translator.TranslateGPT(openAIService, word, targetLang, sourceLang);
                    return Ok(new { translation });
                }
                else if (engine == "google")
                {
                    var translation = Translator.TranslateGoogleApi(word, targetLang, sourceLang);
                    Console.WriteLine($"Translation successful: '{word}' -> '{translation}'");
                    return Ok(new { translation });
                }
                else
                {
                    return BadRequest(new { error = $"Unknown translation engine: {engine}. Use 'google' or 'gpt'." });
                }
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Translation error: {ex.Message}");
                return StatusCode(503, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected translation error: {ex.Message}");
                return StatusCode(500, new { error = "Translation service encountered an error", details = ex.Message });
            }
        }
    }
}