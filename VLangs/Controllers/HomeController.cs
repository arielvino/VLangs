using Microsoft.AspNetCore.Mvc;

namespace VLangs.Controllers
{
    [Route("/")]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return RedirectToAction("Index", "Read");
        }
    }
}
