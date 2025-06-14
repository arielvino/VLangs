using Microsoft.AspNetCore.Mvc;

namespace VLangs.Controllers
{
    [Route("read")]
    public class ReadController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
