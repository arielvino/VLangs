using Microsoft.AspNetCore.Mvc;

namespace VLangsReact.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TranslateController : ControllerBase
    {
        [HttpGet("google")]
        [CheckReferrer]
        public IActionResult Translate(string word, string targetLang, string sourceLang)
        {
            return Ok(new
            {
                translation = Translator.TranslateGoogleApi(word, targetLang, sourceLang),
            });
        }
    }
}