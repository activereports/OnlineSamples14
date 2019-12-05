using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace FinancialPortfolio_AngularCore.Controllers
{
    [Route("api/[controller]")]
    public class ReportsController : Controller
    {
        private static string[] validExtensions = { ".rdl", ".rdlx", ".rdlx-master", ".rpx" };

        [HttpGet("")]
        public IEnumerable<ReportInfo> Reports() => typeof(ReportsController).Assembly.GetManifestResourceNames()
            .Where(x => x.StartsWith(Startup.EmbeddedReportsPrefix) && validExtensions.Any(ext => x.EndsWith(ext, StringComparison.InvariantCultureIgnoreCase)))
            .Select(x => x.Substring(Startup.EmbeddedReportsPrefix.Length + 1))
            .Select(x => new ReportInfo { Name = x })
            .ToArray();

        public class ReportInfo
        {
            public string Name { get; set; }
        }
    }
}
