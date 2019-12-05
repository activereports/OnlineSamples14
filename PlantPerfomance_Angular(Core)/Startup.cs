using System;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using GrapeCity.ActiveReports.Aspnetcore.Viewer;
using Microsoft.Extensions.Logging;
using GrapeCity.ActiveReports.Web.Viewer;
using System.Data.SQLite.Linq;

namespace PlantPerfomance_AngularCore
{
    public class Startup
    {
        public static string EmbeddedReportsPrefix = "PlantPerfomance_Angular(Core).Reports";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddLogging(config =>
                {
                    // Disable the default logging configuration
                    config.ClearProviders();

                    // Enable logging for debug mode only
                    if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == EnvironmentName.Development)
                    {
                        config.AddConsole();
                    }
                })
                .AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);


            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseDeveloperExceptionPage();

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            //Configure reporting to get reports from folder.
            //You can also use the reports embedded into the assembly (UseEmbeddedTemplates method)
            //or your own reports store (UseCustomStore method).
            app.UseReporting(config =>
			{
				config.UseEmbeddedTemplates(EmbeddedReportsPrefix, Assembly.GetAssembly(GetType()));
				config.UseDataProviders(new DataProviderInfo[]
				{
					new DataProviderInfo("SQLite", 
						typeof(SQLiteProviderFactory).AssemblyQualifiedName,
						typeof(SQLiteConnectionAdapter).AssemblyQualifiedName)
				});
			});

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
