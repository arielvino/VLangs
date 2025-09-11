using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace VLangsReact.Server
{
    public class CheckReferrerAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var request = context.HttpContext.Request;
            var referrer = request.Headers["Referer"].FirstOrDefault();

            if (!string.IsNullOrEmpty(referrer))
            {
                try
                {
                    var refUri = new Uri(referrer);
                    if (!string.Equals(refUri.Host, request.Host.Host, StringComparison.OrdinalIgnoreCase))
                    {
                        context.Result = new ForbidResult();
                    }
                }
                catch (UriFormatException)
                {
                    context.Result = new ForbidResult();
                }
            }

            base.OnActionExecuting(context);
        }
    }

}
