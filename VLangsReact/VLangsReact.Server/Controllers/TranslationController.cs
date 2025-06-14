using Microsoft.AspNetCore.Mvc;
using Google.Apis.Translate.v2;
using Google.Apis.Services;
using Google.Cloud.Translation.V2;
using System.Security;

namespace VLangsReact.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TranslateController : ControllerBase
    {
        [HttpGet("google")]
        public IActionResult Translate(string word, string targetLang="he", string sourceLang="en")
        {
            return Ok(new
            {
                translation = Translator.TranslateGoogleApi(word, targetLang, sourceLang),
            });
        }
    }
}